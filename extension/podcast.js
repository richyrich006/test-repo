'use strict';

// ── ReadAloud Podcast Engine ──────────────────────────────────────────────────
// Converts an article into an NPR-style audio podcast using the Anthropic API
// for script generation, Web Audio API for ambient music, and the browser's
// SpeechSynthesis API for multi-speaker narration.

window.__rtaPodcast = (() => {

  // ── Ambient music ───────────────────────────────────────────────────────────
  // Generates a simple ambient news soundscape entirely via Web Audio API —
  // no external files required.  Layers: pink noise room ambience + low drone chord.

  class AmbientMusic {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.sources = [];
      this.running = false;
    }

    start() {
      if (this.running) return;
      this.ctx = new AudioContext();
      this.ctx.resume(); // Required: browser suspends AudioContext created outside a user gesture
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // ── Layer 1: pink-ish noise (room/air ambience) ──
      const bufLen = this.ctx.sampleRate * 3;
      const buffer = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufLen; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2 + white * 0.5362) / 6;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const lpf = this.ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 500;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.value = 0.06;

      noise.connect(lpf);
      lpf.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start();
      this.sources.push(noise);

      // ── Layer 2: sustained drone chord (D minor — D2, F2, A2) ──
      [[73.4, 0.018], [87.3, 0.012], [110, 0.010]].forEach(([freq, gain]) => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const oscGain = this.ctx.createGain();
        oscGain.gain.value = gain;

        osc.connect(oscGain);
        oscGain.connect(this.masterGain);
        osc.start();
        this.sources.push(osc);
      });

      // ── Layer 3: subtle high shimmer ──
      const shimmer = this.ctx.createOscillator();
      shimmer.type = 'sine';
      shimmer.frequency.value = 880;
      const shimGain = this.ctx.createGain();
      shimGain.gain.value = 0.004;
      shimmer.connect(shimGain);
      shimGain.connect(this.masterGain);
      shimmer.start();
      this.sources.push(shimmer);

      this.running = true;
      // Fade in over 2.5 s
      this.masterGain.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 2.5);
    }

    // Duck to ~40% volume while speech is playing
    duck(rampMs = 600) {
      if (!this.masterGain || !this.running) return;
      const t = this.ctx.currentTime + rampMs / 1000;
      this.masterGain.gain.linearRampToValueAtTime(0.4, t);
    }

    // Bring back to full volume
    unduck(rampMs = 800) {
      if (!this.masterGain || !this.running) return;
      const t = this.ctx.currentTime + rampMs / 1000;
      this.masterGain.gain.linearRampToValueAtTime(1, t);
    }

    // Fade out and close
    stop() {
      if (!this.running) return;
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2.5);
      setTimeout(() => {
        this.sources.forEach((s) => { try { s.stop(); } catch (_) {} });
        try { this.ctx.close(); } catch (_) {}
        this.running = false;
      }, 3000);
    }
  }

  // ── Script generation ──────────────────────────────────────────────────────

  const SYSTEM_PROMPT = `You are a seasoned NPR radio script writer. Your task is to convert a news article into a polished, engaging NPR-style podcast segment.

FORMAT RULES (follow exactly):
- First line must be: [INTRO_MUSIC]
- Last line must be: [OUTRO_MUSIC]
- Each spoken line: [HOST] or [REPORTER] followed by a space and the text
- One speaker segment per line — no line breaks within a segment
- No other tags, stage directions, or formatting

STYLE RULES:
- Host name: Alex. Correspondent name: Jordan (use sparingly — only for complex stories needing a second perspective)
- Tone: calm, intelligent, authoritative but accessible — classic NPR
- Open with a compelling news hook that draws the listener in
- Use active voice, present tense where natural
- Short, punchy sentences. Smooth transitions between ideas
- Close with: "Reporting for ReadAloud, I'm Alex."
- Target ~900–1,100 words of spoken text (about 7–9 minutes of audio at broadcast pace)`;

  async function generateScript(articleText, title) {
    const { podcastApiKey = '' } = await chrome.storage.sync.get('podcastApiKey');
    if (!podcastApiKey) throw new Error('NO_API_KEY');

    // Truncate article to ~3 000 words to control cost/latency
    const truncated = articleText.split(/\s+/).slice(0, 3000).join(' ');

    const userMessage = `Article title: ${title}\n\nArticle text:\n${truncated}`;

    const resp = await chrome.runtime.sendMessage({
      action: 'anthropicFetch',
      headers: {
        'x-api-key': podcastApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!resp.ok) {
      throw new Error(resp.data?.error?.message || resp.error || `API error ${resp.status}`);
    }

    return resp.data.content[0].text;
  }

  // ── Script parsing ─────────────────────────────────────────────────────────
  // Returns an array of segment objects:
  //   { type: 'INTRO_MUSIC' | 'OUTRO_MUSIC' | 'HOST' | 'REPORTER', text?: string }

  function parseScript(raw) {
    const segments = [];
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed === '[INTRO_MUSIC]') { segments.push({ type: 'INTRO_MUSIC' }); continue; }
      if (trimmed === '[OUTRO_MUSIC]') { segments.push({ type: 'OUTRO_MUSIC' }); continue; }

      const match = trimmed.match(/^\[(HOST|REPORTER)\]\s+(.+)$/);
      if (match) {
        segments.push({ type: match[1], text: match[2] });
      }
    }
    return segments;
  }

  // ── Voice selection ────────────────────────────────────────────────────────

  function waitForVoices() {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) { resolve(voices); return; }
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        resolve(window.speechSynthesis.getVoices());
      }, { once: true });
    });
  }

  function getPodcastVoices(voices) {
    voices = (voices || []).filter((v) => v.lang.startsWith('en'));

    // Score: cloud/neural voices rank highest
    const score = (v) => {
      let s = 0;
      if (!v.localService) s += 20;
      if (v.name.includes('Google')) s += 8;
      if (v.name.includes('Neural') || v.name.includes('Natural') ||
          v.name.includes('Premium') || v.name.includes('Enhanced')) s += 5;
      if (v.lang === 'en-US') s += 2;
      return s;
    };

    const sorted = [...voices].sort((a, b) => score(b) - score(a));

    const host = sorted[0] || null;
    // Pick a distinct reporter voice — prefer different gender keyword in name
    const reporter = sorted.find((v, i) => {
      if (i === 0) return false;
      const hostFemale = /female|woman|girl|she/i.test(host?.name || '');
      const vFemale = /female|woman|girl|she/i.test(v.name);
      return hostFemale !== vFemale; // opposite apparent gender
    }) || sorted[1] || host;

    return { host, reporter };
  }

  // ── TTS orchestration ──────────────────────────────────────────────────────

  function speakSegment(text, voice, rate, pitch) {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      // Split into sentences for smoother playback
      const sentences = text
        .split(/(?<=[.!?])\s+(?=[A-Z"'\u201C])/u)
        .map((s) => s.trim())
        .filter(Boolean);

      let idx = 0;
      const speakNext = () => {
        if (idx >= sentences.length) { resolve(); return; }
        const utt = new SpeechSynthesisUtterance(sentences[idx++]);
        utt.voice = voice;
        utt.rate = rate;
        utt.pitch = pitch;
        utt.onend = speakNext;
        utt.onerror = (e) => { if (e.error !== 'interrupted') console.warn('podcast TTS:', e.error); resolve(); };
        synth.speak(utt);
      };
      speakNext();
    });
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  // ── Abort signal helpers ───────────────────────────────────────────────────

  let _abortController = null;

  function isAborted() {
    return _abortController?.signal.aborted ?? false;
  }

  // ── Public state ───────────────────────────────────────────────────────────

  let _active = false;
  let _music = null;

  // ── Main entrypoint ────────────────────────────────────────────────────────

  async function start(chunks, title, onStatus) {
    if (_active) return;
    _active = true;
    _abortController = new AbortController();

    const status = (msg) => { if (onStatus) onStatus(msg); };
    const music = new AmbientMusic();
    _music = music;

    try {
      status('Generating podcast script…');

      const rawScript = await generateScript(chunks.join('\n\n'), title || document.title);
      if (isAborted()) return;

      const segments = parseScript(rawScript);
      if (segments.length === 0) throw new Error('Empty script returned');

      const voices = getPodcastVoices(await waitForVoices());
      const { rate = 1 } = await chrome.storage.sync.get('rate').catch(() => ({ rate: 1 }));

      status('Now playing podcast…');

      for (const seg of segments) {
        if (isAborted()) break;

        if (seg.type === 'INTRO_MUSIC') {
          music.start();
          await sleep(2500);       // Let music breathe before speech
          if (!isAborted()) music.duck();
          await sleep(400);

        } else if (seg.type === 'OUTRO_MUSIC') {
          music.unduck();
          await sleep(2500);
          music.stop();
          _music = null;

        } else {
          const isReporter = seg.type === 'REPORTER';
          // Reporter: slightly lower pitch to distinguish from host
          await speakSegment(
            seg.text,
            isReporter ? voices.reporter : voices.host,
            rate * 0.95,           // podcast pace is slightly slower than article reading
            isReporter ? 0.85 : 1
          );
          if (!isAborted()) await sleep(300); // natural pause between segments
        }
      }

    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        status('⚠ Add your API key in Settings to use Podcast mode.');
        chrome.runtime.sendMessage({ action: 'openOptions' });
      } else {
        status('Podcast error: ' + err.message);
        console.error('ReadAloud Podcast:', err);
      }
    } finally {
      window.speechSynthesis.cancel();
      if (_music) { _music.stop(); _music = null; }
      _active = false;
      if (onStatus) onStatus(null); // signal done
    }
  }

  function stop() {
    if (!_active) return;
    window.speechSynthesis.cancel();
    if (_abortController) _abortController.abort();
    if (_music) { _music.stop(); _music = null; }
    _active = false;
  }

  function isActive() { return _active; }

  return { start, stop, isActive };
})();
