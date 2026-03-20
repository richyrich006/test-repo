'use strict';

// ── ReadAloud Discussion Podcast Engine ───────────────────────────────────────
// Converts an article into a lively 2-person discussion podcast using:
//   • Anthropic API  → generate conversational script (Alex & Sarah)
//   • ElevenLabs API → synthesize each speaker with a distinct voice
//   • Web Audio API  → ambient music (shared with podcast.js pattern)

window.__rtaDiscussion = (() => {

  // ── Browser TTS fallback ───────────────────────────────────────────────────
  // Used when ElevenLabs voice resolution fails for any reason (401, plan
  // restrictions, network).  Mirrors the logic in podcast.js.

  function waitForVoices() {
    return new Promise((resolve) => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) { resolve(v); return; }
      window.speechSynthesis.addEventListener('voiceschanged',
        () => resolve(window.speechSynthesis.getVoices()), { once: true });
    });
  }

  function pickBrowserVoices(voices) {
    const en = (voices || []).filter((v) => v.lang.startsWith('en'));
    const score = (v) => {
      let s = 0;
      if (!v.localService) s += 20;
      if (v.name.includes('Google')) s += 8;
      if (v.lang === 'en-US') s += 2;
      return s;
    };
    const sorted = [...en].sort((a, b) => score(b) - score(a));
    const host = sorted[0] || null;
    const guest = sorted.find((v, i) => {
      if (i === 0) return false;
      const hostF = /female|woman|girl/i.test(host?.name || '');
      const vF    = /female|woman|girl/i.test(v.name);
      return hostF !== vF;
    }) || sorted[1] || host;
    return { alex: host, sarah: guest };
  }

  function speakBrowser(text, voice) {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      const sentences = text
        .split(/(?<=[.!?])\s+(?=[A-Z"'\u201C])/u)
        .map((s) => s.trim()).filter(Boolean);
      if (sentences.length === 0) { resolve(); return; }
      const keepAlive = setInterval(() => synth.resume(), 5000);
      const done = () => { clearInterval(keepAlive); resolve(); };
      let idx = 0;
      const speakNext = () => {
        if (isAborted() || idx >= sentences.length) { done(); return; }
        const sentence = sentences[idx++];
        const utt = new SpeechSynthesisUtterance(sentence);
        utt.voice = voice;
        utt.rate = 0.95;
        let advanced = false;
        const advance = () => { if (advanced) return; advanced = true; clearTimeout(timer); speakNext(); };
        const timer = setTimeout(advance, (sentence.split(/\s+/).length / 142) * 60000 + 3000);
        utt.onend = advance;
        utt.onerror = (e) => {
          if (advanced) return; advanced = true; clearTimeout(timer);
          if (e.error === 'interrupted') { done(); return; }
          console.warn('Discussion TTS:', e.error); speakNext();
        };
        synth.speak(utt);
      };
      speakNext();
    });
  }

  // ── Voice selection ─────────────────────────────────────────────────────────
  // Avoid the /v1/voices list endpoint — it 401s on free plans.  Instead keep
  // a prioritised candidate list of known free pre-made voices and let the
  // playback engine skip any that ElevenLabs rejects as library-only.

  const EL_VOICES = {
    male:   [
      'TX3LPaxmHKxFdv7VOQHJ', // Liam
      'nPczCjzI2devNBz1zQrb', // Brian
      'onwK4e9ZLuTAKqWW03F9', // Daniel
      'JBFqnCBsd6RMkjVDRZzb', // George
      'N2lVS1w4EtoT3dr4eOWO', // Callum
    ],
    female: [
      'Xb7hH8MSUJpSbSDYk0k2', // Alice
      'XrExE9yKIg1WjnnlVkGX', // Matilda
      'pFZP5JQG7iQjIQuC4Bku', // Lily
      'XB0fDUnXU5powFXDhCwa', // Charlotte
      'SAz9YHcvj6GT2YYXdXww', // River
    ],
  };

  // Returns a voices object.  No API call; candidate probing happens lazily at
  // first playback so we never spend credits just to discover working voices.
  async function resolveVoices(_apiKey) {
    const bv = pickBrowserVoices(await waitForVoices());
    return {
      mode: 'elevenlabs',          // attempt ElevenLabs; falls back per-segment
      alex:  EL_VOICES.male[0],   alexIdx:  0,
      sarah: EL_VOICES.female[0], sarahIdx: 0,
      browserAlex: bv.alex, browserSarah: bv.sarah,
      useBrowser: false,           // flipped true if all EL candidates exhausted
    };
  }

  // Plays one segment, auto-advancing ElevenLabs candidate voices on rejection.
  async function playSegment(seg, voices, apiKey) {
    if (voices.useBrowser) {
      const bv = seg.type === 'SARAH' ? voices.browserSarah : voices.browserAlex;
      return speakBrowser(seg.text, bv);
    }

    const isAlex      = seg.type !== 'SARAH';
    const candidates  = isAlex ? EL_VOICES.male : EL_VOICES.female;
    const idxKey      = isAlex ? 'alexIdx'       : 'sarahIdx';
    const voiceKey    = isAlex ? 'alex'           : 'sarah';

    while (voices[idxKey] < candidates.length) {
      try {
        await fetchAndPlay(seg.text, voices[voiceKey], apiKey);
        return; // success — keep using this voice
      } catch (err) {
        const isVoiceError = /voice.not.found|voice_not_found|not.find.voice|library|free user|upgrade|subscription/i.test(err.message);
        const isQuotaError = /quota|429|limit|exceed|credit/i.test(err.message);
        if (isQuotaError || (!isVoiceError && !isQuotaError)) {
          // Quota exhausted or unrecoverable error — go straight to browser TTS
          console.warn('ReadAloud Discussion: ElevenLabs unavailable, switching to browser TTS');
          voices.useBrowser = true;
          const bvQ = isAlex ? voices.browserAlex : voices.browserSarah;
          return speakBrowser(seg.text, bvQ);
        }
        voices[idxKey]++;
        if (voices[idxKey] < candidates.length) {
          voices[voiceKey] = candidates[voices[idxKey]];
        }
      }
    }
    // All ElevenLabs candidates failed — switch to browser TTS permanently
    console.warn('ReadAloud Discussion: all ElevenLabs voices exhausted, switching to browser TTS');
    voices.useBrowser = true;
    const bv = isAlex ? voices.browserAlex : voices.browserSarah;
    return speakBrowser(seg.text, bv);
  }

  // ── Ambient music (same as podcast.js) ────────────────────────────────────
  class AmbientMusic {
    constructor() { this.ctx = null; this.masterGain = null; this.sources = []; this.running = false; }

    start() {
      if (this.running) return;
      this.ctx = new AudioContext();
      this.ctx.resume();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

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
      noise.buffer = buffer; noise.loop = true;
      const lpf = this.ctx.createBiquadFilter();
      lpf.type = 'lowpass'; lpf.frequency.value = 500;
      const noiseGain = this.ctx.createGain(); noiseGain.gain.value = 0.05;
      noise.connect(lpf); lpf.connect(noiseGain); noiseGain.connect(this.masterGain);
      noise.start(); this.sources.push(noise);

      [[73.4, 0.015], [110, 0.009]].forEach(([freq, gain]) => {
        const osc = this.ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq;
        const g = this.ctx.createGain(); g.gain.value = gain;
        osc.connect(g); g.connect(this.masterGain); osc.start(); this.sources.push(osc);
      });

      this.running = true;
      this.masterGain.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 2.5);
    }

    duck(rampMs = 600) {
      if (!this.masterGain || !this.running) return;
      this.masterGain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + rampMs / 1000);
    }

    unduck(rampMs = 800) {
      if (!this.masterGain || !this.running) return;
      this.masterGain.gain.linearRampToValueAtTime(1, this.ctx.currentTime + rampMs / 1000);
    }

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

  const SYSTEM_PROMPT = `You are writing a script for a casual, engaging podcast where two co-hosts discuss a news article.

Co-hosts:
- Alex: analytical, plays devil's advocate, asks probing questions
- Sarah: enthusiastic, connects ideas to broader trends, adds personal perspective

FORMAT (follow exactly):
- First line must be: [INTRO_MUSIC]
- Last line must be: [OUTRO_MUSIC]
- Speaker lines: [ALEX] text  or  [SARAH] text — one segment per line, no line breaks within
- Natural conversational language: contractions, short reactions ("Right!", "Exactly.", "Hmm,"), friendly interruptions
- No stage directions, no other tags

STYLE:
- Open with Alex greeting listeners and introducing the topic in 1-2 sentences
- Explore 3-4 key points from the article with back-and-forth exchanges
- Include at least one moment of friendly disagreement or pushback
- Keep individual turns short (2-4 sentences) for natural dialogue rhythm
- Target ~700-900 words of spoken text total
- Close with Alex saying: "Thanks for listening to ReadAloud. We'll catch you next time."`;

  async function generateScript(articleText, title) {
    const { podcastApiKey = '' } = await chrome.storage.sync.get('podcastApiKey');
    if (!podcastApiKey) throw new Error('NO_ANTHROPIC_KEY');

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
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!resp.ok) throw new Error(resp.data?.error?.message || resp.error || `API error ${resp.status}`);
    return resp.data.content[0].text;
  }

  // ── Script parsing ─────────────────────────────────────────────────────────

  function parseScript(raw) {
    const segments = [];
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed === '[INTRO_MUSIC]') { segments.push({ type: 'INTRO_MUSIC' }); continue; }
      if (trimmed === '[OUTRO_MUSIC]') { segments.push({ type: 'OUTRO_MUSIC' }); continue; }
      const match = trimmed.match(/^\[(ALEX|SARAH)\]\s+(.+)$/);
      if (match) segments.push({ type: match[1], text: match[2] });
    }
    return segments;
  }

  // ── ElevenLabs TTS ─────────────────────────────────────────────────────────

  function fetchAndPlay(text, voiceId, apiKey) {
    return new Promise(async (resolve, reject) => {
      if (_abortController?.signal.aborted) { reject(new Error('aborted')); return; }

      let resp;
      try {
        resp = await chrome.runtime.sendMessage({
          action: 'elevenLabsFetch',
          voiceId,
          apiKey,
          body: JSON.stringify({
            text,
            model_id: 'eleven_turbo_v2_5',
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        });
      } catch (err) { reject(err); return; }

      if (!resp.ok) { reject(new Error(resp.error || `ElevenLabs error ${resp.status}`)); return; }

      const binary = atob(resp.audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      _currentAudio = audio;

      audio.onended = () => { URL.revokeObjectURL(url); _currentAudio = null; resolve(); };
      audio.onerror = () => { URL.revokeObjectURL(url); _currentAudio = null; reject(new Error('Playback failed')); };
      audio.play().catch((err) => { URL.revokeObjectURL(url); _currentAudio = null; reject(err); });
    });
  }

  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

  // ── State ──────────────────────────────────────────────────────────────────

  let _active = false;
  let _music = null;
  let _abortController = null;
  let _currentAudio = null;

  function isAborted() { return _abortController?.signal.aborted ?? false; }

  // ── Main entrypoint ────────────────────────────────────────────────────────

  async function start(chunks, title, onStatus) {
    if (_active) return;
    _active = true;
    _abortController = new AbortController();

    const status = (msg) => { if (onStatus) onStatus(msg); };
    const music = new AmbientMusic();
    _music = music;

    try {
      // Check ElevenLabs key
      const { elevenLabsApiKey = '' } = await chrome.storage.sync.get('elevenLabsApiKey');
      if (!elevenLabsApiKey) {
        status('⚠ Add your ElevenLabs API key in Settings to use Discussion mode.');
        chrome.runtime.sendMessage({ action: 'openOptions' });
        return;
      }

      status('Generating discussion script…');
      const [rawScript, voices] = await Promise.all([
        generateScript(chunks.join('\n\n'), title || document.title),
        resolveVoices(elevenLabsApiKey),
      ]);
      if (isAborted()) return;

      const segments = parseScript(rawScript);
      if (segments.length === 0) throw new Error('Empty script returned');

      status('Now playing discussion podcast…');

      for (const seg of segments) {
        if (isAborted()) break;

        if (seg.type === 'INTRO_MUSIC') {
          music.start();
          await sleep(2500);
          if (!isAborted()) music.duck();
          await sleep(400);

        } else if (seg.type === 'OUTRO_MUSIC') {
          music.unduck();
          await sleep(2500);
          music.stop();
          _music = null;

        } else {
          await playSegment(seg, voices, elevenLabsApiKey);
          if (!isAborted()) await sleep(250);
        }
      }

    } catch (err) {
      if (err.message === 'NO_ANTHROPIC_KEY') {
        status('⚠ Add your Anthropic API key in Settings for script generation.');
        chrome.runtime.sendMessage({ action: 'openOptions' });
      } else if (err.message !== 'aborted') {
        status('Discussion error: ' + err.message);
        console.error('ReadAloud Discussion:', err);
      }
    } finally {
      if (_currentAudio) { _currentAudio.pause(); _currentAudio = null; }
      if (_music) { _music.stop(); _music = null; }
      _active = false;
      if (onStatus) onStatus(null);
    }
  }

  function stop() {
    if (!_active) return;
    if (_abortController) _abortController.abort();
    if (_currentAudio) { _currentAudio.pause(); _currentAudio = null; }
    if (_music) { _music.stop(); _music = null; }
    _active = false;
  }

  function isActive() { return _active; }

  return { start, stop, isActive };
})();
