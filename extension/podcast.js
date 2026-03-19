'use strict';

// ── ReadAloud Podcast Engine ──────────────────────────────────────────────────
// Converts an article into an NPR-style audio podcast using the Anthropic API
// for script generation, Jamendo API for real background music, and the
// browser's SpeechSynthesis API for multi-speaker narration.

window.__rtaPodcast = (() => {

  // ── Jamendo Music Player ───────────────────────────────────────────────────
  // Fetches a real royalty-free track from Jamendo and routes it through
  // Web Audio API for volume ducking under speech.
  //
  // Free client IDs: register at https://developer.jamendo.com
  // The ID below is the public test key from Jamendo's own docs.

  const JAMENDO_CLIENT_ID = 'b6747d04';
  const JAMENDO_GENRES = ['lounge', 'ambient', 'jazz', 'classical'];
  // SomaFM streams used as fallback if Jamendo is unavailable
  const SOMAFM_FALLBACKS = [
    'https://ice1.somafm.com/groovesalad-256-mp3',
    'https://ice1.somafm.com/dronezone-256-mp3',
    'https://ice1.somafm.com/lush-256-mp3',
  ];

  class JamendoMusic {
    constructor() {
      this.audioEl = null;
      this.running = false;
      this.trackInfo = null; // { title, artist } for "now playing" display
      this._fadeRaf = null;
    }

    async _fetchJamendoTrack() {
      const genre = JAMENDO_GENRES[Math.floor(Math.random() * JAMENDO_GENRES.length)];
      const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}` +
        `&format=json&limit=50&tags=${genre}&orderby=popularity_total&audioformat=mp31`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Jamendo API ${resp.status}`);
      const data = await resp.json();
      if (!data.results?.length) throw new Error('No Jamendo tracks returned');
      const track = data.results[Math.floor(Math.random() * data.results.length)];
      return { audioUrl: track.audio, title: track.name, artist: track.artist_name };
    }

    // Smooth volume fade using rAF
    _fadeTo(target, durationMs) {
      if (this._fadeRaf) cancelAnimationFrame(this._fadeRaf);
      const el = this.audioEl;
      if (!el) return;
      const start = el.volume;
      const startTime = performance.now();
      const tick = () => {
        if (!this.audioEl) return;
        const t = Math.min((performance.now() - startTime) / durationMs, 1);
        this.audioEl.volume = start + (target - start) * t;
        if (t < 1) this._fadeRaf = requestAnimationFrame(tick);
      };
      this._fadeRaf = requestAnimationFrame(tick);
    }

    async start() {
      if (this.running) return;

      // ── Step 1: unlock autoplay WITHIN the user gesture ──────────────────
      // Muted autoplay is always allowed. We start muted so that the play()
      // call happens synchronously here (before any await breaks the gesture
      // chain). The real src is swapped in after the async Jamendo fetch.
      this.audioEl = new Audio();
      this.audioEl.muted = true;
      this.audioEl.loop = true;
      // play() with no src rejects immediately; we ignore that rejection —
      // the important thing is Chrome marks this element as "user-activated".
      this.audioEl.play().catch(() => {});

      // ── Step 2: fetch a track (async — gesture chain already unlocked) ──
      let audioUrl;
      try {
        const track = await this._fetchJamendoTrack();
        audioUrl = track.audioUrl;
        this.trackInfo = { title: track.title, artist: track.artist };
      } catch (_) {
        audioUrl = SOMAFM_FALLBACKS[Math.floor(Math.random() * SOMAFM_FALLBACKS.length)];
        this.trackInfo = null;
      }

      // ── Step 3: swap in real src and unmute ───────────────────────────────
      this.audioEl.volume = 0;
      this.audioEl.muted = false;
      this.audioEl.src = audioUrl;
      await this.audioEl.play();
      this.running = true;

      // Fade in to 35% over 2.5 s
      this._fadeTo(0.35, 2500);
    }

    // Duck to ~8% while speech plays
    duck() { this._fadeTo(0.08, 600); }

    // Restore to 35%
    unduck() { this._fadeTo(0.35, 800); }

    stop() {
      if (!this.running) return;
      this._fadeTo(0, 2500);
      setTimeout(() => {
        try { this.audioEl.pause(); this.audioEl.src = ''; } catch (_) {}
        this.audioEl = null;
        this.running = false;
      }, 3000);
    }
  }

  // ── Script generation ──────────────────────────────────────────────────────
  // Uses claude-haiku for fast generation (~2-3s vs ~8s with Sonnet).
  // Shorter target (400-600 words) also speeds things up without losing quality.

  const SYSTEM_PROMPT = `You are a seasoned NPR radio script writer. Convert a news article into a polished, engaging NPR-style podcast segment.

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
- Target ~400–600 words of spoken text (about 3–4 minutes of audio at broadcast pace)`;

  async function generateScript(articleText, title) {
    const { podcastApiKey = '' } = await chrome.storage.sync.get('podcastApiKey');
    if (!podcastApiKey) throw new Error('NO_API_KEY');

    // Truncate article to ~2 000 words to reduce latency
    const truncated = articleText.split(/\s+/).slice(0, 2000).join(' ');
    const userMessage = `Article title: ${title}\n\nArticle text:\n${truncated}`;

    const resp = await chrome.runtime.sendMessage({
      action: 'anthropicFetch',
      headers: {
        'x-api-key': podcastApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
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

  function parseScript(raw) {
    const segments = [];
    const speakerMap = {};

    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed === '[INTRO_MUSIC]') { segments.push({ type: 'INTRO_MUSIC' }); continue; }
      if (trimmed === '[OUTRO_MUSIC]') { segments.push({ type: 'OUTRO_MUSIC' }); continue; }

      const match = trimmed.match(/^\[([A-Z][A-Z0-9_]*)\]\s+(.+)$/i);
      if (!match) continue;

      const tag = match[1].toUpperCase();
      const text = match[2];

      if (tag === 'HOST' || tag === 'REPORTER') {
        segments.push({ type: tag, text });
        continue;
      }

      if (!speakerMap[tag]) {
        speakerMap[tag] = Object.keys(speakerMap).length === 0 ? 'HOST' : 'REPORTER';
      }
      segments.push({ type: speakerMap[tag], text });
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
    const reporter = sorted.find((v, i) => {
      if (i === 0) return false;
      const hostFemale = /female|woman|girl|she/i.test(host?.name || '');
      const vFemale = /female|woman|girl|she/i.test(v.name);
      return hostFemale !== vFemale;
    }) || sorted[1] || host;

    return { host, reporter };
  }

  // ── TTS orchestration ──────────────────────────────────────────────────────

  function speakSegment(text, voice, rate, pitch) {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      const sentences = text
        .split(/(?<=[.!?])\s+(?=[A-Z"'\u201C])/u)
        .map((s) => s.trim())
        .filter(Boolean);

      if (sentences.length === 0) { resolve(); return; }

      const keepAlive = setInterval(() => synth.resume(), 5000);
      const done = () => { clearInterval(keepAlive); resolve(); };

      let idx = 0;

      const speakNext = () => {
        if (isAborted() || idx >= sentences.length) { done(); return; }

        const sentence = sentences[idx++];
        const utt = new SpeechSynthesisUtterance(sentence);
        utt.voice = voice;
        utt.rate = rate;
        utt.pitch = pitch;

        let advanced = false;
        const advance = () => {
          if (advanced) return;
          advanced = true;
          clearTimeout(timer);
          speakNext();
        };

        const wordCount = sentence.split(/\s+/).length;
        const expectedMs = (wordCount / ((rate || 1) * 150)) * 60000 + 3000;
        const timer = setTimeout(advance, expectedMs);

        utt.onend = advance;
        utt.onerror = (e) => {
          if (advanced) return;
          advanced = true;
          clearTimeout(timer);
          if (e.error === 'interrupted') { done(); return; }
          console.warn('podcast TTS:', e.error);
          speakNext();
        };

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
  // Music fetch and script generation run in parallel so the listener hears
  // the intro music almost immediately (typically < 2 s) rather than waiting
  // for the full LLM round-trip before anything plays.

  async function start(chunks, title, onStatus) {
    if (_active) return;
    _active = true;
    _abortController = new AbortController();

    const status = (msg) => { if (onStatus) onStatus(msg); };
    const music = new JamendoMusic();
    _music = music;

    try {
      // Kick off music fetch and script generation in parallel
      status('Loading podcast…');

      const [rawScript] = await Promise.all([
        generateScript(chunks.join('\n\n'), title || document.title),
        music.start().catch((err) => {
          // Non-fatal: log and continue without music
          console.warn('ReadAloud Podcast music:', err);
        }),
      ]);

      if (isAborted()) return;

      const segments = parseScript(rawScript);
      if (segments.length === 0) throw new Error('Empty script returned');

      const voices = getPodcastVoices(await waitForVoices());
      const { rate = 1 } = await chrome.storage.sync.get('rate').catch(() => ({ rate: 1 }));

      // Show "now playing" track name if we got one from Jamendo
      const nowPlaying = music.trackInfo
        ? `🎵 ${music.trackInfo.title} — ${music.trackInfo.artist}`
        : 'Now playing podcast…';
      status(nowPlaying);

      for (const seg of segments) {
        if (isAborted()) break;

        if (seg.type === 'INTRO_MUSIC') {
          // Music is already playing — just let it breathe for 3 s before speech
          await sleep(3000);
          if (!isAborted()) music.duck();
          await sleep(400);

        } else if (seg.type === 'OUTRO_MUSIC') {
          music.unduck();
          await sleep(2500);
          music.stop();
          _music = null;

        } else {
          const isReporter = seg.type === 'REPORTER';
          await speakSegment(
            seg.text,
            isReporter ? voices.reporter : voices.host,
            rate * 0.95,
            isReporter ? 0.85 : 1
          );
          if (!isAborted()) await sleep(300);
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
      if (onStatus) onStatus(null);
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
