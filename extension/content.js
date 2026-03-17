'use strict';

// Guard: only initialize once per page load.
if (!window.__readAloud) {

  const RA = {
    synth: window.speechSynthesis,
    utterance: null,
    chunks: [],         // array of paragraph strings
    chunkIndex: 0,      // which paragraph we're on
    rate: 1.5,
    playing: false,
    paused: false,
    active: false,
    keepAliveTimer: null,
    noStartTimer: null, // watchdog for silent Chrome TTS failures
    markedEls: [],      // page DOM elements we've modified
    wordTimers: [],     // setTimeout IDs for timer-based word highlighting
    uttStartTime: 0,    // Date.now() when current utterance began
    uttCharOffset: 0,   // charOffset passed to startReading for current utterance
  };

  // Kick off async voice loading immediately so voices are ready before the
  // first play button click.  Chrome loads voices lazily on the first getVoices()
  // call; doing it here gives the browser time to populate them.
  RA.synth.getVoices();

  window.__readAloud = RA;

  // ─── Article extraction via Readability.js ────────────────────────────────

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
    docClone.querySelectorAll(JUNK_SELECTORS).forEach((el) => el.remove());
    try {
      const article = new Readability(docClone).parse();
      if (!article || !article.content) return null;
      return article;
    } catch (e) {
      return null;
    }
  }

  // Ordered list of article-body selectors used across major news sites.
  // Daily Mail uses [itemprop="articleBody"] + <p class="mol-para-with-font">;
  // many other sites use <article> or role="main".
  const ARTICLE_BODY_SELECTORS = [
    '[itemprop="articleBody"]',
    'article',
    '[role="article"]',
    '[class*="article-body"]',
    '[class*="article-text"]',
    '[class*="story-body"]',
    '[class*="post-content"]',
    '[class*="entry-content"]',
    '[class*="article__body"]',
    'main',
    '[role="main"]',
  ];

  // Fallback when Readability returns nothing: pull <p> tags directly from the
  // first recognisable article container we can find in the live DOM.
  function extractFallback() {
    for (const sel of ARTICLE_BODY_SELECTORS) {
      const container = document.querySelector(sel);
      if (!container) continue;
      const paras = Array.from(container.querySelectorAll('p'))
        .map((p) => p.textContent.replace(/\s+/g, ' ').trim())
        .filter((t) => t.length > 40 && !(t.length < 120 && BOILERPLATE_RE.test(t)));
      if (paras.length >= 3) return paras;
    }
    return null;
  }

  const BOILERPLATE_RE = /sign[\s-]?up|newsletter|subscribe|email address|your info will be|privacy policy|cookie|follow us|advertisement|sponsored|terms of (use|service)/i;

  function getParagraphs(article) {
    const div = document.createElement('div');
    div.innerHTML = article.content;
    div.querySelectorAll('form, input, button[type="submit"], [class*="newsletter"], [class*="signup"]').forEach((el) => el.remove());

    const blocks = div.querySelectorAll('p, h1, h2, h3, h4, h5, li');
    const paras = [];
    blocks.forEach((el) => {
      const text = el.textContent.replace(/\s+/g, ' ').trim();
      if (text.length < 20) return;
      if (text.length < 120 && BOILERPLATE_RE.test(text)) return;
      paras.push(text);
    });

    if (paras.length === 0) {
      return article.textContent
        .split(/\n+/)
        .map((s) => s.replace(/\s+/g, ' ').trim())
        .filter((s) => s.length > 20 && !(s.length < 120 && BOILERPLATE_RE.test(s)));
    }

    return paras;
  }

  // ─── Word-span rendering ──────────────────────────────────────────────────

  function renderParagraph(text) {
    let html = '';
    let pos = 0;
    for (const part of text.split(/(\s+)/)) {
      if (part.trim().length > 0) {
        html += `<span class="rta-word" data-s="${pos}" data-e="${pos + part.length}">${escHtml(part)}</span>`;
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

  function markPageElements(paragraphs) {
    const candidates = Array.from(
      document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li')
    ).filter((el) => !el.closest('#rta-panel'));

    const used = new Set();

    paragraphs.forEach((text, idx) => {
      const normText = text.replace(/\s+/g, ' ').trim();
      let bestEl = null, bestScore = 0;

      for (const el of candidates) {
        if (used.has(el)) continue;
        const elText = el.textContent.replace(/\s+/g, ' ').trim();
        if (elText === normText) { bestEl = el; bestScore = 1; break; }
        if (normText.includes(elText) && elText.length > 15) {
          const score = elText.length / normText.length;
          if (score > 0.7 && score > bestScore) { bestScore = score; bestEl = el; }
        }
      }

      if (bestEl) {
        used.add(bestEl);
        bestEl._rtaOrigHTML = bestEl.innerHTML;
        bestEl.setAttribute('data-rta-chunk', idx);
        bestEl.innerHTML = renderParagraph(normText);
        bestEl.classList.add('rta-para');
        bestEl.querySelectorAll('.rta-word').forEach((span) => span.addEventListener('click', handleWordClick));
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

  // ─── Session position ─────────────────────────────────────────────────────

  function savePosition(idx) {
    try { sessionStorage.setItem('rta-pos:' + location.href, idx); } catch (_) {}
  }

  function loadPosition() {
    try { return parseInt(sessionStorage.getItem('rta-pos:' + location.href)) || 0; } catch (_) { return 0; }
  }

  // ─── Progress & time remaining ────────────────────────────────────────────

  function updateProgress(idx) {
    const fill = document.getElementById('rta-progress-fill');
    if (!fill || RA.chunks.length === 0) return;
    fill.style.width = `${((idx + 1) / RA.chunks.length) * 100}%`;
  }

  function timeRemainingStr(fromIdx) {
    let words = 0;
    for (let i = fromIdx; i < RA.chunks.length; i++) {
      words += RA.chunks[i].split(/\s+/).filter(Boolean).length;
    }
    const minutes = words / (150 * RA.rate);
    if (minutes < 1) return `~${Math.max(1, Math.round(minutes * 60))}s left`;
    return `~${Math.round(minutes)}m left`;
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
        <div id="rta-progress"><div id="rta-progress-fill"></div></div>
        <div id="rta-logo" title="Drag to move">${LOGO_SVG}</div>
        <div id="rta-controls">
          <div class="rta-player-group">
            <button class="rta-btn" id="rta-prev" title="Previous paragraph">⏮</button>
            <button class="rta-btn rta-icon-btn" id="rta-skip-back" title="Back 10s">↺<span class="rta-skip-label">10</span></button>
            <button class="rta-btn rta-play-btn" id="rta-playpause" title="Play">▶</button>
            <button class="rta-btn rta-icon-btn" id="rta-skip-fwd" title="Forward 10s"><span class="rta-skip-label">10</span>↻</button>
            <button class="rta-btn" id="rta-next" title="Next paragraph">⏭</button>
          </div>
          <div id="rta-status">Ready</div>
          <div class="rta-player-group">
            <span class="rta-label">Speed</span>
            ${speedBtns}
          </div>
        </div>
        <div id="rta-mini-controls">
          <button class="rta-btn rta-play-btn" id="rta-mini-playpause" title="Play">▶</button>
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
    let dragging = false, startX, startY;
    const handle = panel.querySelector('#rta-logo');

    handle.addEventListener('mousedown', (e) => {
      dragging = true;
      const rect = panel.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
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
      if (dragging) { dragging = false; handle.style.cursor = 'grab'; }
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

    const togglePlay = () => {
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
    };
    document.getElementById('rta-playpause').addEventListener('click', togglePlay);
    document.getElementById('rta-mini-playpause').addEventListener('click', togglePlay);

    document.getElementById('rta-prev').addEventListener('click', () => jump(Math.max(0, RA.chunkIndex - 1)));
    document.getElementById('rta-next').addEventListener('click', () => jump(Math.min(paragraphs.length - 1, RA.chunkIndex + 1)));
    document.getElementById('rta-skip-back').addEventListener('click', () => skip(-10));
    document.getElementById('rta-skip-fwd').addEventListener('click', () => skip(10));

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
    const icon = playing ? '⏸' : '▶';
    const btn = document.getElementById('rta-playpause');
    const mini = document.getElementById('rta-mini-playpause');
    if (btn) btn.textContent = icon;
    if (mini) mini.textContent = icon;
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
    updateProgress(idx);
    savePosition(idx);
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
      if (RA.synth.speaking && !RA.synth.paused) { RA.synth.pause(); RA.synth.resume(); }
    }, 10000);
  }

  function stopKeepAlive() {
    clearInterval(RA.keepAliveTimer);
  }

  function clearWordTimers() {
    RA.wordTimers.forEach((t) => clearTimeout(t));
    RA.wordTimers = [];
  }

  // Schedule per-word highlight timeouts as fallback when onboundary doesn't fire.
  // onboundary cancels these and takes over if it does fire.
  function scheduleWordHighlights(chunkIdx, charOffset) {
    clearWordTimers();
    const para = document.querySelector(`[data-rta-chunk="${chunkIdx}"]`);
    if (!para) return;

    const words = Array.from(para.querySelectorAll('.rta-word'));
    const startIdx = charOffset > 0
      ? words.findIndex((w) => parseInt(w.dataset.e, 10) > charOffset)
      : 0;
    if (startIdx < 0) return;

    const msPerChar = 60 / RA.rate;
    let elapsed = 0;

    for (let i = startIdx; i < words.length; i++) {
      const word = words[i];
      const delay = elapsed;
      elapsed += Math.max(word.textContent.trim().length * msPerChar, 100);

      RA.wordTimers.push(
        setTimeout(() => {
          const prev = document.querySelector('.rta-word.rta-hl');
          if (prev) prev.classList.remove('rta-hl');
          word.classList.add('rta-hl');
        }, delay)
      );
    }
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
        // Auto-scroll word into view if it's scrolled off-screen.
        // Use 80px margins to keep it clear of the fixed player bar at the bottom.
        const rect = span.getBoundingClientRect();
        if (rect.top < 80 || rect.bottom > window.innerHeight - 80) {
          span.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        break;
      }
    }
  }

  // ─── Sentence splitting ───────────────────────────────────────────────────

  // Split text into sentence-sized strings for TTS.
  // Shorter utterances let the engine plan intonation over a manageable span,
  // which eliminates the slurred/clipped sound at 1.5× and 2× speeds.
  function sentenceSplit(text) {
    // Split after . ! ? that are followed by whitespace + capital letter.
    // Negative lookbehind skips common abbreviations so "Dr. Smith" stays whole.
    const parts = text
      .split(/(?<!\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|vs|etc|e\.g|i\.e))(?<=[.!?])\s+(?=[A-Z"'\u201C])/u)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return parts.length > 0 ? parts : [text];
  }

  // Returns the char offset of each sentence within fullText.
  function sentenceOffsets(fullText, sentences) {
    const offsets = [];
    let pos = 0;
    for (const s of sentences) {
      const i = fullText.indexOf(s, pos);
      offsets.push(i >= 0 ? i : pos);
      pos = (i >= 0 ? i : pos) + s.length;
    }
    return offsets;
  }

  // ─── TTS utterance queue ──────────────────────────────────────────────────

  // Queue all sentences of chunk[idx] as individual utterances.
  // Sentence-level utterances give the TTS engine a natural phrase boundary
  // on every sentence, producing clean audio even at 1.5× / 2× speed.
  // The last sentence's onstart pre-queues the next chunk for seamless flow.
  function _buildAndQueueUtterance(idx) {
    if (idx >= RA.chunks.length) return;

    const fullText = RA.chunks[idx];
    const sentences = sentenceSplit(fullText);
    const offsets = sentenceOffsets(fullText, sentences);

    sentences.forEach((sentence, sIdx) => {
      const isFirst = sIdx === 0;
      const isLast = sIdx === sentences.length - 1;
      const sOffset = offsets[sIdx];

      const utt = new SpeechSynthesisUtterance(sentence);
      utt.rate = RA.rate;
      utt.voice = getBestVoice();

      utt.onstart = () => {
        RA.chunkIndex = idx;
        RA.uttStartTime = Date.now();
        RA.uttCharOffset = sOffset;
        if (isFirst) {
          setActivePara(idx);
          setStatus(timeRemainingStr(idx));
          scheduleWordHighlights(idx, 0);
        }
        // Chain: pre-queue the next chunk while the last sentence of this one plays
        if (isLast) _buildAndQueueUtterance(idx + 1);
      };

      utt.onboundary = (event) => {
        if (event.name !== 'word') return;
        clearWordTimers();
        highlightWord(idx, sOffset + event.charIndex);
      };

      utt.onend = () => {
        clearWordTimers();
        if (!RA.paused && isLast && idx + 1 >= RA.chunks.length) {
          setStatus('Done');
          setPlayBtn(false);
          RA.playing = false;
          stopKeepAlive();
        }
      };

      utt.onerror = (e) => {
        clearWordTimers();
        if (e.error !== 'interrupted') console.warn('ReadAloud TTS error:', e.error);
      };

      RA.synth.speak(utt);
    });
  }

  function startReading(idx, charOffset = 0, _isRetry = false) {
    if (idx >= RA.chunks.length) {
      setStatus('Done');
      setPlayBtn(false);
      RA.playing = false;
      stopKeepAlive();
      return;
    }

    clearWordTimers();
    clearTimeout(RA.noStartTimer);

    // Cancel any previous or stuck utterance before queuing new ones.
    // Chrome silently drops the very first speak() call after page load if the
    // TTS daemon hasn't started yet; canceling first forces it to initialise.
    RA.synth.cancel();

    RA.chunkIndex = idx;
    RA.uttStartTime = Date.now();
    RA.uttCharOffset = charOffset;
    RA.playing = true;
    RA.paused = false;
    setPlayBtn(true);
    setActivePara(idx);
    setStatus(timeRemainingStr(idx));
    startKeepAlive();

    if (charOffset > 0) highlightWord(idx, charOffset);

    const fullText = RA.chunks[idx];
    const sentences = sentenceSplit(fullText);
    const offsets = sentenceOffsets(fullText, sentences);

    // Find which sentence contains charOffset
    let startSentIdx = sentences.length - 1;
    for (let i = 0; i < sentences.length - 1; i++) {
      if (charOffset < offsets[i + 1]) { startSentIdx = i; break; }
    }

    // First utterance: the sentence that contains charOffset, possibly trimmed
    const withinSent = charOffset - offsets[startSentIdx];
    const firstText = sentences[startSentIdx].substring(Math.max(0, withinSent));
    const firstGlobalOffset = offsets[startSentIdx] + withinSent;

    const utterance = new SpeechSynthesisUtterance(firstText);
    utterance.rate = RA.rate;
    utterance.voice = getBestVoice();

    utterance.onstart = () => {
      // Speech actually started — cancel the silent-failure watchdog.
      clearTimeout(RA.noStartTimer);
    };

    utterance.onboundary = (event) => {
      if (event.name !== 'word') return;
      clearWordTimers();
      highlightWord(idx, firstGlobalOffset + event.charIndex);
    };

    utterance.onend = () => {
      clearWordTimers();
      // If no more sentences were queued below (started at the last sentence),
      // we are responsible for chaining the next chunk.
      if (!RA.paused && startSentIdx === sentences.length - 1) {
        _buildAndQueueUtterance(idx + 1);
        if (idx + 1 >= RA.chunks.length) {
          setStatus('Done');
          setPlayBtn(false);
          RA.playing = false;
          stopKeepAlive();
        }
      }
    };

    utterance.onerror = (e) => {
      clearWordTimers();
      if (e.error !== 'interrupted') console.warn('ReadAloud TTS error:', e.error);
    };

    RA.utterance = utterance;
    RA.synth.speak(utterance);
    scheduleWordHighlights(idx, charOffset);

    // Watchdog: if onstart hasn't fired after 700ms the utterance was silently
    // dropped (Chrome bug).  Retry once with a fresh cancel/speak cycle.
    if (!_isRetry) {
      RA.noStartTimer = setTimeout(() => {
        if (RA.playing && !RA.paused) {
          startReading(idx, charOffset, true);
        }
      }, 700);
    }

    // Queue the remaining sentences of this chunk immediately so there is no
    // gap within the paragraph.  The last one's onstart pre-queues the next chunk.
    for (let i = startSentIdx + 1; i < sentences.length; i++) {
      const sOffset = offsets[i];
      const isLast = i === sentences.length - 1;

      const utt = new SpeechSynthesisUtterance(sentences[i]);
      utt.rate = RA.rate;
      utt.voice = getBestVoice();

      utt.onstart = () => {
        RA.uttStartTime = Date.now();
        RA.uttCharOffset = sOffset;
        if (isLast) _buildAndQueueUtterance(idx + 1);
      };

      utt.onboundary = (event) => {
        if (event.name !== 'word') return;
        clearWordTimers();
        highlightWord(idx, sOffset + event.charIndex);
      };

      utt.onend = () => {
        clearWordTimers();
        if (!RA.paused && isLast && idx + 1 >= RA.chunks.length) {
          setStatus('Done');
          setPlayBtn(false);
          RA.playing = false;
          stopKeepAlive();
        }
      };

      utt.onerror = (e) => {
        clearWordTimers();
        if (e.error !== 'interrupted') console.warn('ReadAloud TTS error:', e.error);
      };

      RA.synth.speak(utt);
    }
  }

  // Skip forward or backward by `seconds` seconds using estimated char position.
  function skip(seconds) {
    if (!RA.playing && !RA.paused) return;
    const charsPerMs = (12.5 * RA.rate) / 1000; // ~12.5 chars/sec at 1×
    const elapsed = Date.now() - RA.uttStartTime;
    let targetChar = RA.uttCharOffset + elapsed * charsPerMs + seconds * 1000 * charsPerMs;
    let targetIdx = RA.chunkIndex;

    // Advance or retreat through paragraph boundaries
    while (targetChar >= RA.chunks[targetIdx].length && targetIdx + 1 < RA.chunks.length) {
      targetChar -= RA.chunks[targetIdx].length;
      targetIdx++;
    }
    while (targetChar < 0 && targetIdx > 0) {
      targetIdx--;
      targetChar += RA.chunks[targetIdx].length;
    }
    targetChar = Math.max(0, Math.min(Math.round(targetChar), RA.chunks[targetIdx].length - 1));

    RA.synth.cancel();
    RA.paused = false;
    RA.playing = true;
    startReading(targetIdx, targetChar);
  }

  function jump(idx) {
    RA.synth.cancel();
    RA.paused = false;
    if (RA.playing) {
      startReading(idx, 0);
    } else {
      RA.chunkIndex = idx;
      setActivePara(idx);
      setStatus(timeRemainingStr(idx));
    }
  }

  // ─── PDF extraction ───────────────────────────────────────────────────────

  // Extract readable text chunks from a PDF using PDF.js.
  // Reconstructs paragraphs from text-item Y positions so each chunk is a
  // natural paragraph rather than an entire page dump.
  async function extractPdfChunks() {
    // Point PDF.js at the worker file bundled with the extension
    pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdf.worker.min.js');

    const response = await fetch(document.URL);
    const arrayBuffer = await response.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const allChunks = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const items = textContent.items.filter((item) => item.str && item.str.trim());
      if (items.length === 0) continue;

      // PDF Y-axis is bottom-up; sort top-to-bottom then left-to-right
      items.sort((a, b) => {
        const dy = b.transform[5] - a.transform[5];
        return Math.abs(dy) > 2 ? dy : a.transform[4] - b.transform[4];
      });

      // Estimate typical line height from consecutive Y gaps
      const yGaps = [];
      for (let i = 1; i < items.length; i++) {
        const d = Math.abs(items[i - 1].transform[5] - items[i].transform[5]);
        if (d > 0 && d < 30) yGaps.push(d);
      }
      yGaps.sort((a, b) => a - b);
      const lineH = yGaps.length ? yGaps[Math.floor(yGaps.length / 2)] : 12;
      const paraGap = lineH * 1.6; // gap larger than 1.6× line height = new paragraph

      // Group items into paragraphs
      let cur = '';
      let lastY = items[0].transform[5];

      for (const item of items) {
        const y = item.transform[5];
        if (Math.abs(lastY - y) > paraGap && cur.trim().length > 0) {
          const text = cur.replace(/\s+/g, ' ').trim();
          if (text.length > 20) allChunks.push(text);
          cur = item.str;
        } else {
          cur += (cur && !cur.endsWith(' ') && !item.str.startsWith(' ') ? ' ' : '') + item.str;
        }
        lastY = y;
      }
      if (cur.trim().length > 20) allChunks.push(cur.replace(/\s+/g, ' ').trim());
    }

    return allChunks;
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  async function activate(silent = false) {
    if (RA.active) { teardown(); return; }

    let paragraphs = [];

    if (window.__rtaPdfMode) {
      try {
        paragraphs = await extractPdfChunks();
      } catch (e) {
        console.warn('ReadAloud PDF extraction error:', e);
        if (!silent) alert('ReadAloud: Could not extract text from this PDF.');
        return;
      }
    } else {
      const article = extractArticle();
      paragraphs = article ? getParagraphs(article) : [];

      // Readability couldn't extract enough content — try the live DOM directly
      if (paragraphs.length < 3) {
        paragraphs = extractFallback() || [];
      }
    }

    if (paragraphs.length === 0) {
      if (!silent) alert('ReadAloud: No readable content found on this page.');
      return;
    }

    RA.chunks = paragraphs;
    RA.chunkIndex = loadPosition();
    RA.active = true;
    buildUI(null, paragraphs);
    // PDF pages have no HTML paragraphs to mark; skip for PDF mode
    if (!window.__rtaPdfMode) {
      setTimeout(() => markPageElements(paragraphs), 0);
    }
  }

  function teardown() {
    RA.synth.cancel();
    stopKeepAlive();
    clearWordTimers();
    clearTimeout(RA.noStartTimer);
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
