'use strict';

// Guard: only initialize once per page load.
if (!window.__readAloud) {

  const RA = {
    synth: window.speechSynthesis,
    utterance: null,
    chunks: [],       // array of paragraph strings
    chunkIndex: 0,    // which paragraph we're on
    rate: 1.5,
    playing: false,
    paused: false,
    active: false,
    keepAliveTimer: null,
  };

  window.__readAloud = RA;

  // ─── Article extraction via Readability.js ────────────────────────────────

  function extractArticle() {
    const docClone = document.cloneNode(true);
    const article = new Readability(docClone).parse();
    if (!article || !article.content) return null;
    return article;
  }

  // Parse Readability's cleaned HTML into an array of paragraph strings.
  // This is what we feed to TTS — no ads, no nav, no headers/footers.
  function getParagraphs(article) {
    const div = document.createElement('div');
    div.innerHTML = article.content;

    const blocks = div.querySelectorAll('p, h1, h2, h3, h4, h5, li');
    const paras = [];
    blocks.forEach((el) => {
      const text = el.textContent.replace(/\s+/g, ' ').trim();
      if (text.length > 15) paras.push(text);
    });

    // Fallback: plain text split by newlines
    if (paras.length === 0) {
      return article.textContent
        .split(/\n+/)
        .map((s) => s.replace(/\s+/g, ' ').trim())
        .filter((s) => s.length > 15);
    }

    return paras;
  }

  // ─── Word-span rendering ──────────────────────────────────────────────────
  // Each word gets a <span> with its character start/end positions stored
  // as data attributes so we can map Web Speech API charIndex → DOM element.

  function renderParagraph(text, chunkIdx) {
    let html = '';
    let pos = 0;
    let wordIdx = 0;

    // Split on whitespace, preserving the whitespace tokens
    const parts = text.split(/(\s+)/);
    for (const part of parts) {
      if (part.trim().length > 0) {
        const safe = escHtml(part);
        html += `<span class="rta-word" id="rta-${chunkIdx}-${wordIdx}" data-s="${pos}" data-e="${pos + part.length}">${safe}</span>`;
        wordIdx++;
      } else {
        html += part; // preserve spacing as-is
      }
      pos += part.length;
    }
    return html;
  }

  function escHtml(t) {
    return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ─── UI ───────────────────────────────────────────────────────────────────

  function buildUI(article, paragraphs) {
    const existing = document.getElementById('rta-panel');
    if (existing) existing.remove();

    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const speedBtns = speeds
      .map((s) => `<button class="rta-speed${s === RA.rate ? ' rta-speed-active' : ''}" data-speed="${s}">${s}x</button>`)
      .join('');

    const panel = document.createElement('div');
    panel.id = 'rta-panel';
    panel.innerHTML = `
      <div id="rta-player">
        <div class="rta-player-group">
          <button class="rta-btn" id="rta-prev" title="Previous paragraph">⏮</button>
          <button class="rta-btn rta-play-btn" id="rta-playpause" title="Play">▶</button>
          <button class="rta-btn" id="rta-next" title="Next paragraph">⏭</button>
        </div>
        <div id="rta-status">Ready</div>
        <div class="rta-player-group">
          <span class="rta-label">Speed</span>
          ${speedBtns}
        </div>
        <button id="rta-close" title="Close">✕</button>
      </div>
    `;

    document.body.appendChild(panel);
    attachEvents(paragraphs);
  }

  function attachEvents(paragraphs) {
    // Close
    document.getElementById('rta-close').addEventListener('click', teardown);

    // Play / Pause
    document.getElementById('rta-playpause').addEventListener('click', () => {
      if (!RA.playing && !RA.paused) {
        startReading(RA.chunkIndex);
      } else if (RA.playing) {
        RA.synth.pause();
        RA.paused = true;
        RA.playing = false;
        setPlayBtn(false);
        stopKeepAlive();
      } else {
        RA.synth.resume();
        RA.paused = false;
        RA.playing = true;
        setPlayBtn(true);
        startKeepAlive();
      }
    });

    // Prev / Next paragraph
    document.getElementById('rta-prev').addEventListener('click', () => {
      jump(Math.max(0, RA.chunkIndex - 1));
    });
    document.getElementById('rta-next').addEventListener('click', () => {
      jump(Math.min(paragraphs.length - 1, RA.chunkIndex + 1));
    });

    // Speed buttons
    document.querySelectorAll('.rta-speed').forEach((btn) => {
      btn.addEventListener('click', () => {
        RA.rate = parseFloat(btn.dataset.speed);
        document.querySelectorAll('.rta-speed').forEach((b) => b.classList.remove('rta-speed-active'));
        btn.classList.add('rta-speed-active');
        // Restart current chunk at new speed if playing
        if (RA.playing) {
          RA.synth.cancel();
          RA.paused = false;
          startReading(RA.chunkIndex);
        }
      });
    });
  }

  function setPlayBtn(playing) {
    const btn = document.getElementById('rta-playpause');
    if (btn) btn.textContent = playing ? '⏸' : '▶';
  }

  function setStatus(text) {
    const el = document.getElementById('rta-status');
    if (el) el.textContent = text;
  }

  function setActivePara(idx) {
    document.querySelectorAll('.rta-para-active').forEach((el) => el.classList.remove('rta-para-active'));
    const el = document.getElementById(`rta-para-${idx}`);
    if (el) {
      el.classList.add('rta-para-active');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // ─── TTS ──────────────────────────────────────────────────────────────────

  function getBestVoice() {
    const voices = RA.synth.getVoices();
    return (
      voices.find((v) => v.name.includes('Google') && v.lang.startsWith('en')) ||
      voices.find((v) => v.name.includes('Microsoft') && v.lang.startsWith('en')) ||
      voices.find((v) => v.lang === 'en-US') ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0]
    );
  }

  // Chrome has a silent-pause bug where speech stops after ~15 seconds.
  // Calling pause()+resume() every 10s keeps it alive.
  function startKeepAlive() {
    clearInterval(RA.keepAliveTimer);
    RA.keepAliveTimer = setInterval(() => {
      if (RA.synth.speaking && !RA.synth.paused) {
        RA.synth.pause();
        RA.synth.resume();
      }
    }, 10000);
  }

  function stopKeepAlive() {
    clearInterval(RA.keepAliveTimer);
  }

  function startReading(idx) {
    if (idx >= RA.chunks.length) {
      setStatus('Done');
      setPlayBtn(false);
      RA.playing = false;
      stopKeepAlive();
      return;
    }

    RA.chunkIndex = idx;
    RA.playing = true;
    RA.paused = false;
    setPlayBtn(true);
    setActivePara(idx);
    setStatus(`Paragraph ${idx + 1} of ${RA.chunks.length}`);
    startKeepAlive();

    const text = RA.chunks[idx];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = RA.rate;
    utterance.voice = getBestVoice();

    utterance.onboundary = (event) => {
      if (event.name !== 'word') return;
      highlightWord(idx, event.charIndex);
    };

    utterance.onend = () => {
      if (!RA.paused) startReading(idx + 1);
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') console.warn('ReadAloud TTS error:', e.error);
    };

    RA.utterance = utterance;
    RA.synth.speak(utterance);
  }

  function highlightWord(chunkIdx, charIndex) {
    // Clear previous highlight
    const prev = document.querySelector('.rta-word.rta-hl');
    if (prev) prev.classList.remove('rta-hl');

    const para = document.getElementById(`rta-para-${chunkIdx}`);
    if (!para) return;

    for (const span of para.querySelectorAll('.rta-word')) {
      const s = parseInt(span.dataset.s, 10);
      const e = parseInt(span.dataset.e, 10);
      if (charIndex >= s && charIndex < e) {
        span.classList.add('rta-hl');
        span.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        break;
      }
    }
  }

  function jump(idx) {
    RA.synth.cancel();
    RA.paused = false;
    if (RA.playing) {
      startReading(idx);
    } else {
      RA.chunkIndex = idx;
      setActivePara(idx);
      setStatus(`Paragraph ${idx + 1} of ${RA.chunks.length}`);
    }
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  function activate() {
    if (RA.active) {
      teardown();
      return;
    }

    const article = extractArticle();
    if (!article) {
      alert('ReadAloud: Could not extract article content from this page.');
      return;
    }

    const paragraphs = getParagraphs(article);
    if (paragraphs.length === 0) {
      alert('ReadAloud: No readable content found on this page.');
      return;
    }

    RA.chunks = paragraphs;
    RA.chunkIndex = 0;
    RA.active = true;
    buildUI(article, paragraphs);
  }

  function teardown() {
    RA.synth.cancel();
    stopKeepAlive();
    const panel = document.getElementById('rta-panel');
    if (panel) panel.remove();
    RA.active = false;
    RA.playing = false;
    RA.paused = false;
    RA.chunkIndex = 0;
  }

  // ─── Entry points ─────────────────────────────────────────────────────────

  // Listen for subsequent icon clicks (background.js sends this message)
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'activate') activate();
  });

  // Auto-activate on first injection (triggered by first icon click)
  activate();
}
