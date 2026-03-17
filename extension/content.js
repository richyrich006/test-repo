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
    markedEls: [],    // page DOM elements we've modified
    wordTimers: [],   // setTimeout IDs for timer-based word highlighting
  };

  window.__readAloud = RA;

  // ─── Article extraction via Readability.js ────────────────────────────────

  // Selectors for content that should never be read aloud
  const JUNK_SELECTORS = [
    'form', '[class*="newsletter"]', '[class*="signup"]', '[class*="sign-up"]',
    '[class*="subscribe"]', '[id*="newsletter"]', '[id*="signup"]', '[id*="subscribe"]',
    '[class*="cookie"]', '[class*="consent"]', '[class*="gdpr"]',
    '[class*="promo"]', '[class*="banner"]', '[class*="advert"]',
    '[class*="related"]', '[class*="recommended"]', '[class*="more-stories"]',
    '[class*="social-share"]', '[class*="share-bar"]',
  ].join(',');

  function extractArticle() {
    const docClone = document.cloneNode(true);
    if (!docClone || !docClone.documentElement) return null;
    // Strip junk nodes before Readability sees them
    docClone.querySelectorAll(JUNK_SELECTORS).forEach((el) => el.remove());
    try {
      const article = new Readability(docClone).parse();
      if (!article || !article.content) return null;
      return article;
    } catch (e) {
      return null;
    }
  }

  // Patterns that mark a paragraph as boilerplate (newsletter CTAs, cookie notices, etc.)
  const BOILERPLATE_RE = /sign[\s-]?up|newsletter|subscribe|email address|your info will be|privacy policy|cookie|follow us|advertisement|sponsored|terms of (use|service)/i;

  // Parse Readability's cleaned HTML into an array of paragraph strings.
  function getParagraphs(article) {
    const div = document.createElement('div');
    div.innerHTML = article.content;

    // Remove any leftover form/input elements Readability kept
    div.querySelectorAll('form, input, button[type="submit"], [class*="newsletter"], [class*="signup"]').forEach((el) => el.remove());

    const blocks = div.querySelectorAll('p, h1, h2, h3, h4, h5, li');
    const paras = [];
    blocks.forEach((el) => {
      const text = el.textContent.replace(/\s+/g, ' ').trim();
      // Skip very short lines and obvious boilerplate
      if (text.length < 20) return;
      if (text.length < 120 && BOILERPLATE_RE.test(text)) return;
      paras.push(text);
    });

    // Fallback: plain text split by newlines
    if (paras.length === 0) {
      return article.textContent
        .split(/\n+/)
        .map((s) => s.replace(/\s+/g, ' ').trim())
        .filter((s) => s.length > 20 && !(s.length < 120 && BOILERPLATE_RE.test(s)));
    }

    return paras;
  }

  // ─── Word-span rendering ──────────────────────────────────────────────────

  function renderParagraph(text, chunkIdx) {
    let html = '';
    let pos = 0;
    let wordIdx = 0;

    const parts = text.split(/(\s+)/);
    for (const part of parts) {
      if (part.trim().length > 0) {
        const safe = escHtml(part);
        html += `<span class="rta-word" data-s="${pos}" data-e="${pos + part.length}">${safe}</span>`;
        wordIdx++;
      } else {
        html += part;
      }
      pos += part.length;
    }
    return html;
  }

  function escHtml(t) {
    return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ─── Page element matching ────────────────────────────────────────────────
  // Find the real DOM elements on the page that correspond to each extracted
  // paragraph, wrap their text in word spans, and attach click handlers.

  function markPageElements(paragraphs) {
    const candidates = Array.from(
      document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li')
    ).filter((el) => !el.closest('#rta-panel'));

    const used = new Set();

    paragraphs.forEach((text, idx) => {
      const normText = text.replace(/\s+/g, ' ').trim();

      let bestEl = null;
      let bestScore = 0;

      for (const el of candidates) {
        if (used.has(el)) continue;
        const elText = el.textContent.replace(/\s+/g, ' ').trim();

        if (elText === normText) {
          bestEl = el;
          bestScore = 1;
          break;
        }

        // Accept if the element's text is mostly contained in the paragraph
        if (normText.includes(elText) && elText.length > 15) {
          const score = elText.length / normText.length;
          if (score > 0.7 && score > bestScore) {
            bestScore = score;
            bestEl = el;
          }
        }
      }

      if (bestEl) {
        used.add(bestEl);
        bestEl._rtaOrigHTML = bestEl.innerHTML;
        bestEl.setAttribute('data-rta-chunk', idx);
        bestEl.innerHTML = renderParagraph(normText, idx);
        bestEl.classList.add('rta-para');
        // Word clicks jump to that exact word; paragraph clicks (whitespace) start from beginning
        bestEl.querySelectorAll('.rta-word').forEach((span) => {
          span.addEventListener('click', handleWordClick);
        });
        bestEl.addEventListener('click', handleParaClick);
        RA.markedEls.push(bestEl);
      }
    });
  }

  function handleWordClick(e) {
    e.stopPropagation();
    const span = e.currentTarget;
    const para = span.closest('[data-rta-chunk]');
    if (!para) return;
    const idx = parseInt(para.getAttribute('data-rta-chunk'), 10);
    const charOffset = parseInt(span.dataset.s, 10);
    if (isNaN(idx) || isNaN(charOffset)) return;
    RA.synth.cancel();
    RA.paused = false;
    RA.playing = true;
    startReading(idx, charOffset);
  }

  function handleParaClick(e) {
    const el = e.currentTarget;
    const idx = parseInt(el.getAttribute('data-rta-chunk'), 10);
    if (isNaN(idx)) return;
    RA.synth.cancel();
    RA.paused = false;
    RA.playing = true;
    startReading(idx, 0);
  }

  function restorePageElements() {
    RA.markedEls.forEach((el) => {
      el.innerHTML = el._rtaOrigHTML;
      el.removeAttribute('data-rta-chunk');
      el.classList.remove('rta-para', 'rta-para-active');
      el.removeEventListener('click', handleParaClick);
      delete el._rtaOrigHTML;
    });
    RA.markedEls = [];
  }

  // ─── UI ───────────────────────────────────────────────────────────────────

  const LOGO_SVG = `<svg id="rta-logo-svg" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="22" height="22" rx="6" fill="url(#rta-grad)"/>
    <defs>
      <linearGradient id="rta-grad" x1="0" y1="0" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stop-color="#6366f1"/>
        <stop offset="1" stop-color="#8b5cf6"/>
      </linearGradient>
    </defs>
    <rect x="3"   y="9"  width="2.2" height="4"   rx="1.1" fill="white" opacity="0.85"/>
    <rect x="6.5" y="6"  width="2.2" height="10"  rx="1.1" fill="white"/>
    <rect x="10"  y="8"  width="2.2" height="6"   rx="1.1" fill="white" opacity="0.9"/>
    <rect x="13.5" y="4" width="2.2" height="14"  rx="1.1" fill="white"/>
    <rect x="17"  y="7"  width="2.2" height="8"   rx="1.1" fill="white" opacity="0.85"/>
  </svg>`;

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
        <div id="rta-logo" title="Drag to move">${LOGO_SVG}</div>
        <div id="rta-controls">
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
        </div>
        <div id="rta-actions">
          <button id="rta-collapse" title="Minimize">−</button>
          <button id="rta-close" title="Close">✕</button>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    makeDraggable(panel);
    attachEvents(paragraphs);
  }

  function makeDraggable(panel) {
    let dragging = false, startX, startY, origLeft, origTop;
    const handle = panel.querySelector('#rta-logo');

    handle.addEventListener('mousedown', (e) => {
      dragging = true;
      const rect = panel.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
      // Switch from centered CSS to explicit position so we can move it freely
      panel.style.transform = 'none';
      panel.style.bottom = 'auto';
      panel.style.left = rect.left + 'px';
      panel.style.top = rect.top + 'px';
      handle.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const x = Math.max(0, Math.min(e.clientX - startX, window.innerWidth - panel.offsetWidth));
      const y = Math.max(0, Math.min(e.clientY - startY, window.innerHeight - panel.offsetHeight));
      panel.style.left = x + 'px';
      panel.style.top = y + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (dragging) {
        dragging = false;
        handle.style.cursor = 'grab';
      }
    });
  }

  function attachEvents(paragraphs) {
    document.getElementById('rta-close').addEventListener('click', teardown);

    document.getElementById('rta-collapse').addEventListener('click', () => {
      const panel = document.getElementById('rta-panel');
      const collapsed = panel.classList.toggle('rta-collapsed');
      document.getElementById('rta-collapse').title = collapsed ? 'Expand' : 'Minimize';
      document.getElementById('rta-collapse').textContent = collapsed ? '+' : '−';
    });

    document.getElementById('rta-playpause').addEventListener('click', () => {
      if (!RA.playing && !RA.paused) {
        startReading(RA.chunkIndex);
      } else if (RA.playing) {
        RA.synth.pause();
        RA.paused = true;
        RA.playing = false;
        setPlayBtn(false);
        stopKeepAlive();
        clearWordTimers();
      } else {
        RA.synth.resume();
        RA.paused = false;
        RA.playing = true;
        setPlayBtn(true);
        startKeepAlive();
      }
    });

    document.getElementById('rta-prev').addEventListener('click', () => {
      jump(Math.max(0, RA.chunkIndex - 1));
    });
    document.getElementById('rta-next').addEventListener('click', () => {
      jump(Math.min(paragraphs.length - 1, RA.chunkIndex + 1));
    });

    document.querySelectorAll('.rta-speed').forEach((btn) => {
      btn.addEventListener('click', () => {
        RA.rate = parseFloat(btn.dataset.speed);
        document.querySelectorAll('.rta-speed').forEach((b) => b.classList.remove('rta-speed-active'));
        btn.classList.add('rta-speed-active');
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
    const el = document.querySelector(`[data-rta-chunk="${idx}"]`);
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

  function startReading(idx, charOffset = 0) {
    if (idx >= RA.chunks.length) {
      setStatus('Done');
      setPlayBtn(false);
      RA.playing = false;
      stopKeepAlive();
      return;
    }

    clearWordTimers();
    RA.chunkIndex = idx;
    RA.playing = true;
    RA.paused = false;
    setPlayBtn(true);
    setActivePara(idx);
    setStatus(`Paragraph ${idx + 1} of ${RA.chunks.length}`);
    startKeepAlive();

    // Pre-highlight the starting word so there's instant visual feedback
    if (charOffset > 0) highlightWord(idx, charOffset);

    const fullText = RA.chunks[idx];
    const text = charOffset > 0 ? fullText.substring(charOffset) : fullText;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = RA.rate;
    utterance.voice = getBestVoice();

    utterance.onboundary = (event) => {
      if (event.name !== 'word') return;
      // onboundary is working — cancel the timer fallback and use events instead
      clearWordTimers();
      // event.charIndex is relative to the utterance text (which may be sliced),
      // so add charOffset to map back to the original span data-s positions.
      highlightWord(idx, event.charIndex + charOffset);
    };

    utterance.onend = () => {
      clearWordTimers();
      if (!RA.paused) startReading(idx + 1);
    };

    utterance.onerror = (e) => {
      clearWordTimers();
      if (e.error !== 'interrupted') console.warn('ReadAloud TTS error:', e.error);
    };

    RA.utterance = utterance;
    RA.synth.speak(utterance);
    // Start timer-based highlights as fallback; onboundary cancels them if it fires
    scheduleWordHighlights(idx, charOffset);
  }

  function highlightWord(chunkIdx, charIndex) {
    const prev = document.querySelector('.rta-word.rta-hl');
    if (prev) prev.classList.remove('rta-hl');

    const para = document.querySelector(`[data-rta-chunk="${chunkIdx}"]`);
    if (!para) return;

    for (const span of para.querySelectorAll('.rta-word')) {
      const s = parseInt(span.dataset.s, 10);
      const e = parseInt(span.dataset.e, 10);
      if (charIndex >= s && charIndex < e) {
        span.classList.add('rta-hl');
        break;
      }
    }
  }

  function clearWordTimers() {
    RA.wordTimers.forEach((t) => clearTimeout(t));
    RA.wordTimers = [];
  }

  // Schedule per-word highlight timeouts as a fallback for when onboundary
  // doesn't fire (common with Google/Chrome voices in Chromium-based browsers).
  // If onboundary does fire, it calls clearWordTimers() and takes over.
  function scheduleWordHighlights(chunkIdx, charOffset) {
    clearWordTimers();
    const para = document.querySelector(`[data-rta-chunk="${chunkIdx}"]`);
    if (!para) return;

    const words = Array.from(para.querySelectorAll('.rta-word'));
    const startIdx = charOffset > 0
      ? words.findIndex((w) => parseInt(w.dataset.e, 10) > charOffset)
      : 0;
    if (startIdx < 0) return;

    // ~60ms per character at 1× rate ≈ 150 WPM average; scales with RA.rate
    const msPerChar = 60 / RA.rate;
    let elapsed = 0;

    for (let i = startIdx; i < words.length; i++) {
      const word = words[i];
      const wordLen = word.textContent.trim().length;
      const delay = elapsed;
      elapsed += Math.max(wordLen * msPerChar, 100); // min 100ms per word

      RA.wordTimers.push(
        setTimeout(() => {
          const prev = document.querySelector('.rta-word.rta-hl');
          if (prev) prev.classList.remove('rta-hl');
          word.classList.add('rta-hl');
        }, delay)
      );
    }
  }

  function jump(idx) {
    RA.synth.cancel();
    RA.paused = false;
    if (RA.playing) {
      startReading(idx, 0);
    } else {
      RA.chunkIndex = idx;
      setActivePara(idx);
      setStatus(`Paragraph ${idx + 1} of ${RA.chunks.length}`);
    }
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  function activate(silent = false) {
    if (RA.active) {
      teardown();
      return;
    }

    const article = extractArticle();
    if (!article) {
      if (!silent) alert('ReadAloud: Could not extract article content from this page.');
      return;
    }

    const paragraphs = getParagraphs(article);
    if (paragraphs.length === 0) {
      if (!silent) alert('ReadAloud: No readable content found on this page.');
      return;
    }

    RA.chunks = paragraphs;
    RA.chunkIndex = 0;
    RA.active = true;
    buildUI(article, paragraphs);
    // Defer the heavy DOM rewrite so the panel paints first
    setTimeout(() => markPageElements(paragraphs), 0);
  }

  function teardown() {
    RA.synth.cancel();
    stopKeepAlive();
    clearWordTimers();
    const panel = document.getElementById('rta-panel');
    if (panel) panel.remove();
    restorePageElements();
    RA.active = false;
    RA.playing = false;
    RA.paused = false;
    RA.chunkIndex = 0;
  }

  // ─── Entry points ─────────────────────────────────────────────────────────

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'activate') activate();
  });

  activate(true);
}
