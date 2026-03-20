'use strict';

// ── ReadAloud NPR News Article Engine ─────────────────────────────────────────
// Converts an article into an NPR-style radio news report using:
//   • Anthropic API   → generate anchor script
//   • ElevenLabs API  → synthesize authoritative news voices
//   • Jamendo API     → real intro music (plays once at the top, then fades out)

window.__rtaPodcast = (() => {

  // ── ElevenLabs voice candidates ───────────────────────────────────────────
  // Prioritised list of known free pre-made voices. The engine tries them in
  // order and skips any that ElevenLabs rejects as library-only on the plan.
  // HOST = primary anchor (male), REPORTER = field correspondent (female).

  const EL_VOICES = {
    host: [
      'onwK4e9ZLuTAKqWW03F9', // Daniel  — deep, authoritative
      'JBFqnCBsd6RMkjVDRZzb', // George  — measured, trustworthy
      'TX3LPaxmHKxFdv7VOQHJ', // Liam    — clear, professional
      'nPczCjzI2devNBz1zQrb', // Brian   — warm baritone
      'N2lVS1w4EtoT3dr4eOWO', // Callum  — composed
    ],
    reporter: [
      'Xb7hH8MSUJpSbSDYk0k2', // Alice     — crisp, professional
      'XB0fDUnXU5powFXDhCwa', // Charlotte — articulate
      'XrExE9yKIg1WjnnlVkGX', // Matilda   — clear, even
      'pFZP5JQG7iQjIQuC4Bku', // Lily      — composed
      'SAz9YHcvj6GT2YYXdXww', // River     — measured
    ],
  };

  // ── ElevenLabs TTS ─────────────────────────────────────────────────────────

  function fetchAndPlay(text, voiceId, apiKey) {
    return new Promise(async (resolve, reject) => {
      if (isAborted()) { reject(new Error('aborted')); return; }

      let resp;
      try {
        resp = await chrome.runtime.sendMessage({
          action: 'elevenLabsFetch',
          voiceId,
          apiKey,
          body: JSON.stringify({
            text,
            model_id: 'eleven_turbo_v2_5',
            // Higher stability = more consistent, anchor-like delivery
            voice_settings: { stability: 0.72, similarity_boost: 0.55 },
          }),
        });
      } catch (err) { reject(err); return; }

      if (!resp.ok) {
        reject(new Error(resp.error || `ElevenLabs error ${resp.status}`));
        return;
      }

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

  // Speak one script segment via ElevenLabs, auto-advancing candidates on
  // voice-not-found errors, falling back to browser TTS if all fail.
  async function speakSegment(text, voiceState, roleKey, apiKey) {
    if (voiceState.useBrowser) {
      return speakBrowser(text, voiceState[`browser_${roleKey}`], voiceState.rate);
    }

    const candidates = EL_VOICES[roleKey];
    const idxKey = `${roleKey}Idx`;

    while (voiceState[idxKey] < candidates.length) {
      if (isAborted()) return;
      try {
        await fetchAndPlay(text, candidates[voiceState[idxKey]], apiKey);
        return; // success — keep using this voice
      } catch (err) {
        const isVoiceErr = /voice.not.found|voice_not_found|not.find.voice|library/i.test(err.message);
        const isQuotaErr = /quota|429|limit|exceed|credit/i.test(err.message);
        if (!isVoiceErr && !isQuotaErr) throw err;
        if (isQuotaErr) {
          // Credits exhausted — skip remaining EL candidates and go straight to browser TTS
          console.warn('ReadAloud Podcast: ElevenLabs quota reached, switching to browser TTS');
          voiceState.useBrowser = true;
          return speakBrowser(text, voiceState[`browser_${roleKey}`], voiceState.rate);
        }
        voiceState[idxKey]++;
      }
    }

    // All ElevenLabs candidates exhausted — fall back to browser TTS
    console.warn('ReadAloud Podcast: ElevenLabs voices exhausted, switching to browser TTS');
    voiceState.useBrowser = true;
    return speakBrowser(text, voiceState[`browser_${roleKey}`], voiceState.rate);
  }

  // ── Browser TTS fallback ───────────────────────────────────────────────────

  function waitForVoices() {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) { resolve(voices); return; }
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        resolve(window.speechSynthesis.getVoices());
      }, { once: true });
    });
  }

  function pickBrowserVoices(voices) {
    const en = (voices || []).filter((v) => v.lang.startsWith('en'));
    const score = (v) => {
      let s = 0;
      if (!v.localService) s += 20;
      if (v.name.includes('Google')) s += 8;
      if (v.name.includes('Neural') || v.name.includes('Premium') ||
          v.name.includes('Enhanced')) s += 5;
      if (v.lang === 'en-US') s += 2;
      return s;
    };
    const sorted = [...en].sort((a, b) => score(b) - score(a));
    const host = sorted[0] || null;
    const reporter = sorted.find((v, i) => {
      if (i === 0) return false;
      const hf = /female|woman|girl/i.test(host?.name || '');
      const vf = /female|woman|girl/i.test(v.name);
      return hf !== vf;
    }) || sorted[1] || host;
    return { host, reporter };
  }

  function speakBrowser(text, voice, rate) {
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
        utt.rate = rate * 0.95;
        utt.pitch = 1;

        let advanced = false;
        const advance = () => {
          if (advanced) return; advanced = true; clearTimeout(timer); speakNext();
        };
        const wc = sentence.split(/\s+/).length;
        const timer = setTimeout(advance, (wc / ((rate || 1) * 150)) * 60000 + 500);
        utt.onend = advance;
        utt.onerror = (e) => {
          if (advanced) return; advanced = true; clearTimeout(timer);
          if (e.error === 'interrupted') { done(); return; }
          speakNext();
        };
        synth.speak(utt);
      };
      speakNext();
    });
  }

  // ── Jamendo Intro Music ────────────────────────────────────────────────────
  // Plays a real royalty-free track for the intro only — fades out completely
  // before the anchor starts speaking.

  const JAMENDO_CLIENT_ID = 'b6747d04';
  const JAMENDO_GENRES = ['lounge', 'ambient', 'jazz', 'classical'];
  const SOMAFM_FALLBACKS = [
    'https://ice1.somafm.com/groovesalad-256-mp3',
    'https://ice1.somafm.com/dronezone-256-mp3',
  ];

  class IntroMusic {
    constructor() {
      this.audioEl = null;
      this.running = false;
      this.trackInfo = null;
      this._fadeRaf = null;
    }

    async _fetchJamendoTrack() {
      const genre = JAMENDO_GENRES[Math.floor(Math.random() * JAMENDO_GENRES.length)];
      const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}` +
        `&format=json&limit=50&tags=${genre}&orderby=popularity_total&audioformat=mp31`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Jamendo API ${resp.status}`);
      const data = await resp.json();
      if (!data.results?.length) throw new Error('No tracks');
      const track = data.results[Math.floor(Math.random() * data.results.length)];
      return { audioUrl: track.audio, title: track.name, artist: track.artist_name };
    }

    _fadeTo(target, durationMs) {
      if (this._fadeRaf) cancelAnimationFrame(this._fadeRaf);
      const el = this.audioEl;
      if (!el) return Promise.resolve();
      const start = el.volume;
      const startTime = performance.now();
      return new Promise((resolve) => {
        const tick = () => {
          if (!this.audioEl) { resolve(); return; }
          const t = Math.min((performance.now() - startTime) / durationMs, 1);
          this.audioEl.volume = start + (target - start) * t;
          if (t < 1) { this._fadeRaf = requestAnimationFrame(tick); }
          else resolve();
        };
        this._fadeRaf = requestAnimationFrame(tick);
      });
    }

    async start() {
      if (this.running) return;

      // Unlock autoplay within the user gesture (muted play before any await)
      this.audioEl = new Audio();
      this.audioEl.muted = true;
      this.audioEl.loop = true;
      this.audioEl.play().catch(() => {});

      let audioUrl;
      try {
        const track = await this._fetchJamendoTrack();
        audioUrl = track.audioUrl;
        this.trackInfo = { title: track.title, artist: track.artist };
      } catch (_) {
        audioUrl = SOMAFM_FALLBACKS[Math.floor(Math.random() * SOMAFM_FALLBACKS.length)];
        this.trackInfo = null;
      }

      this.audioEl.volume = 0;
      this.audioEl.muted = false;
      this.audioEl.src = audioUrl;
      await this.audioEl.play();
      this.running = true;

      // Fade in to 60% (prominent intro level) over 1.5 s
      await this._fadeTo(0.6, 1500);
    }

    // Fade out and stop completely — awaitable so callers know when it's silent
    async fadeOutAndStop(durationMs = 2000) {
      if (!this.running) return;
      await this._fadeTo(0, durationMs);
      try { this.audioEl.pause(); this.audioEl.src = ''; } catch (_) {}
      this.audioEl = null;
      this.running = false;
    }
  }

  // ── Script generation ──────────────────────────────────────────────────────

  const SYSTEM_PROMPT = `You are a seasoned NPR news anchor and radio scriptwriter. Convert a news article into a polished NPR-style radio news report.

FORMAT RULES (follow exactly):
- First line must be: [INTRO_MUSIC]
- Last line must be: [OUTRO_MUSIC]
- Each spoken line: [HOST] or [REPORTER] followed by a space and the text
- One speaker segment per line — no line breaks within a segment
- No other tags, stage directions, or formatting

STYLE RULES:
- Anchor name: Alex. Correspondent name: Jordan (use [REPORTER] sparingly — only for stories needing a field perspective or expert voice)
- Tone: authoritative, measured, clear — classic NPR anchor delivery
- Lead with the most important fact; no throat-clearing or preamble
- Active voice, present tense where natural. Short declarative sentences
- No filler phrases ("In this piece we'll discuss…", "Let's dive in")
- Close with: "I'm Alex. This is ReadAloud."
- Target ~400–600 words of spoken text (about 3–4 minutes at broadcast pace)`;

  async function generateScript(articleText, title) {
    const { podcastApiKey = '' } = await chrome.storage.sync.get('podcastApiKey');
    if (!podcastApiKey) throw new Error('NO_API_KEY');

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
      if (tag === 'HOST' || tag === 'REPORTER') { segments.push({ type: tag, text }); continue; }

      if (!speakerMap[tag]) {
        speakerMap[tag] = Object.keys(speakerMap).length === 0 ? 'HOST' : 'REPORTER';
      }
      segments.push({ type: speakerMap[tag], text });
    }
    return segments;
  }

  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

  // ── Abort helpers ──────────────────────────────────────────────────────────

  let _abortController = null;
  function isAborted() { return _abortController?.signal.aborted ?? false; }

  // ── State ──────────────────────────────────────────────────────────────────

  let _active = false;
  let _music = null;
  let _currentAudio = null;

  // ── Main entrypoint ────────────────────────────────────────────────────────

  async function start(chunks, title, onStatus) {
    if (_active) return;
    _active = true;
    _abortController = new AbortController();

    const status = (msg) => { if (onStatus) onStatus(msg); };
    const music = new IntroMusic();
    _music = music;

    try {
      const { elevenLabsApiKey = '' } = await chrome.storage.sync.get('elevenLabsApiKey');
      if (!elevenLabsApiKey) {
        status('⚠ Add your ElevenLabs API key in Settings for NPR voices.');
        chrome.runtime.sendMessage({ action: 'openOptions' });
        return;
      }

      // Kick off music + script generation in parallel
      status('Loading news report…');
      const [rawScript] = await Promise.all([
        generateScript(chunks.join('\n\n'), title || document.title),
        music.start().catch((err) => console.warn('ReadAloud intro music:', err)),
      ]);

      if (isAborted()) return;

      const segments = parseScript(rawScript);
      if (segments.length === 0) throw new Error('Empty script returned');

      // Set up voice state (ElevenLabs with browser fallback)
      const bv = pickBrowserVoices(await waitForVoices());
      const { rate = 1 } = await chrome.storage.sync.get('rate').catch(() => ({ rate: 1 }));
      const voiceState = {
        hostIdx: 0, reporterIdx: 0,
        browser_host: bv.host, browser_reporter: bv.reporter,
        useBrowser: false, rate,
      };

      const nowPlaying = music.trackInfo
        ? `🎵 ${music.trackInfo.title} — ${music.trackInfo.artist}`
        : 'Now on air…';
      status(nowPlaying);

      for (const seg of segments) {
        if (isAborted()) break;

        if (seg.type === 'INTRO_MUSIC') {
          // Let the music play prominently for 4 s, then fade it out before speaking
          await sleep(4000);
          if (!isAborted() && _music) {
            await music.fadeOutAndStop(2000);
            _music = null;
          }

        } else if (seg.type === 'OUTRO_MUSIC') {
          // Music already gone — nothing to do
          continue;

        } else {
          const roleKey = seg.type === 'REPORTER' ? 'reporter' : 'host';
          status('On air…');
          await speakSegment(seg.text, voiceState, roleKey, elevenLabsApiKey);
          if (!isAborted()) await sleep(150);
        }
      }

    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        status('⚠ Add your Anthropic API key in Settings to use News Report mode.');
        chrome.runtime.sendMessage({ action: 'openOptions' });
      } else {
        status('News report error: ' + err.message);
        console.error('ReadAloud News Report:', err);
      }
    } finally {
      window.speechSynthesis.cancel();
      if (_currentAudio) { try { _currentAudio.pause(); } catch (_) {} _currentAudio = null; }
      if (_music) { _music.fadeOutAndStop(500); _music = null; }
      _active = false;
      if (onStatus) onStatus(null);
    }
  }

  function stop() {
    if (!_active) return;
    window.speechSynthesis.cancel();
    if (_abortController) _abortController.abort();
    if (_currentAudio) { try { _currentAudio.pause(); } catch (_) {} _currentAudio = null; }
    if (_music) { _music.fadeOutAndStop(500); _music = null; }
    _active = false;
  }

  function isActive() { return _active; }

  return { start, stop, isActive };
})();
