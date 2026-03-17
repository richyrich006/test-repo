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
    document.getElementById('rta-close').addEventListener('click', teardown);

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
      // event.charIndex is relative to the utterance text (which may be sliced),
      // so add charOffset to map back to the original span data-s positions.
      highlightWord(idx, event.charIndex + charOffset);
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
    markPageElements(paragraphs);
    buildUI(article, paragraphs);
  }

  function teardown() {
    RA.synth.cancel();
    stopKeepAlive();
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

  activate();
}
