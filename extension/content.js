'use strict';

// Guard: only initialize once per page load.
if (!window.__readAloud) {

  const RA = {
    synth: window.speechSynthesis,
    utterance: null,
    chunks: [],         // array of paragraph strings
    chunkIndex: 0,      // which paragraph we're on
    rate: 1.25,
    pitch: 1,           // SpeechSynthesisUtterance pitch 0.8–1.3
    voiceName: '',      // preferred voice name ('' = auto-select)
    playing: false,
    paused: false,
    active: false,
    keepAliveTimer: null,
    noStartTimer: null, // watchdog for silent Chrome TTS failures
    markedEls: [],      // page DOM elements we've modified
    wordTimers: [],     // setTimeout IDs for timer-based word highlighting
    uttStartTime: 0,    // Date.now() when current utterance began
    uttCharOffset: 0,   // charOffset passed to startReading for current utterance
    pauseChunk: 0,      // chunk index saved on pause
    pauseOffset: 0,     // char offset saved on pause
  };

  // Kick off async voice loading immediately so voices are ready before the
  // first play button click.  Chrome loads voices lazily on the first getVoices()
  // call; doing it here gives the browser time to populate them.
  RA.synth.getVoices();

  window.__readAloud = RA;

  // ─── Article extraction via Readability.js ────────────────────────────────

  const JUNK_SELECTORS = [
    // Forms / opt-ins
    'form', '[class*="newsletter"]', '[class*="signup"]', '[class*="sign-up"]',
    '[class*="subscribe"]', '[id*="newsletter"]', '[id*="signup"]', '[id*="subscribe"]',
    // Legal / tracking
    '[class*="cookie"]', '[class*="consent"]', '[class*="gdpr"]',
    // Ads / promotions
    '[class*="promo"]', '[class*="banner"]', '[class*="advert"]', '[class*="sponsor"]',
    // Related content
    '[class*="related"]', '[class*="recommended"]', '[class*="more-stories"]',
    // Social / sharing
    '[class*="social-share"]', '[class*="share-bar"]', '[class*="share-btn"]',
    '[class*="sharing"]', '[id*="share"]',
    // Navigation junk above/below the article
    '[class*="breadcrumb"]', '[id*="breadcrumb"]', 'nav[aria-label*="breadcrumb"]',
    '[class*="site-nav"]', '[class*="nav-bar"]', '[class*="top-bar"]',
    // Author / byline / metadata blocks
    '[class*="byline"]', '[class*="author-bio"]', '[class*="author-box"]',
    '[class*="author-info"]', '[class*="article-meta"]', '[class*="post-meta"]',
    '[class*="entry-meta"]', '[class*="story-meta"]',
    // Tags / categories sidebar-style blocks
    '[class*="tag-list"]', '[class*="tags-list"]', '[class*="topic-list"]',
    '[class*="label-list"]',
    // Comments
    '[class*="comment"]', '[id*="comment"]', '[id="disqus_thread"]',
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
    '[class*="article-content"]',
    '[class*="article-text"]',
    '[class*="article__body"]',
    '[class*="article__content"]',
    '[class*="story-body"]',
    '[class*="story-content"]',
    '[class*="story__body"]',
    '[class*="post-content"]',
    '[class*="post-body"]',
    '[class*="entry-content"]',
    '[class*="content-body"]',
    '[class*="body-copy"]',
    '[class*="body-text"]',
    '[class*="news-article"]',
    '[class*="main-content"]',
    '[data-testid*="article-body"]',
    '[data-testid*="story-body"]',
    '[data-testid*="article-content"]',
    '[data-testid*="article"]',
    '[data-component*="ArticleBody"]',
    '[data-module*="ArticleBody"]',
    '[data-qa*="article-body"]',
    'main',
    '[role="main"]',
  ];

  // Fallback when Readability returns nothing: pull <p> tags directly from the
  // first recognisable article container we can find in the live DOM.
  function extractFallback() {
    for (const sel of ARTICLE_BODY_SELECTORS) {
      const container = document.querySelector(sel);
      if (!container) continue;
      const paras = Array.from(container.querySelectorAll('p, li, div, blockquote'))
        .filter((el) => isLeafDiv(el))
        .map((el) => el.textContent.replace(/\s+/g, ' ').trim())
        .filter((t) => t.length > 20 && !(t.length < 120 && BOILERPLATE_RE.test(t)));
      if (paras.length >= 3) return paras;
    }
    return null;
  }

  // Last-resort extractor: grab every <p> in the page body, skipping known
  // non-content regions (nav, header, footer, sidebar, dialogs, ads).
  // Works on sites with hashed CSS class names or non-standard article markup
  // where selector-based approaches fail.
  function extractLastResort() {
    const SKIP = [
      'header', 'footer', 'nav', 'aside',
      '[role="navigation"]', '[role="banner"]', '[role="complementary"]',
      '[role="dialog"]', '[role="alertdialog"]',
      '[class*="sidebar"]', '[id*="sidebar"]',
      '[class*="related"]', '[class*="recommended"]',
      '[class*="newsletter"]', '[class*="subscribe"]',
      '[class*="comment"]', '[id*="comment"]',
      '[class*="ad-"]', '[class*="-ad"]', '[class*="advert"]',
      '[class*="promo"]', '[class*="banner"]',
      '#rta-panel',
    ].join(', ');

    const paras = Array.from(document.querySelectorAll('p'))
      .filter((el) => !el.closest(SKIP) && !el.closest('#rta-panel'))
      .map((el) => el.textContent.replace(/\s+/g, ' ').trim())
      .filter((t) => t.length > 40 && !(t.length < 150 && BOILERPLATE_RE.test(t)));

    return paras.length >= 3 ? paras : null;
  }

  const BOILERPLATE_RE = new RegExp(
    'sign[\\s-]?up|newsletter|subscribe|email address|your info will be' +
    '|privacy policy|cookie|follow us|advertisement|sponsored|terms of (use|service)' +
    // Author / date lines that slip through Readability
    '|^by [a-z]|^written by|^published (by|on)|^posted (by|on)|^updated (by|on)' +
    // Read-time / word-count badges
    '|\\d+\\s*min(ute)?s?\\s*read|\\d+\\s*min(ute)?s?\\s*to read|reading time' +
    // Tag / category labels
    '|^(tags?|categor|topics?|labels?)\\s*:|filed under' +
    // Share prompts
    '|share (this|on|via)|copy link',
    'i'
  );

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

  // Readability normalizes Unicode punctuation when processing the document
  // clone.  Normalize both sides before comparing so smart quotes / em-dashes
  // in the live DOM still match the ASCII versions in the extracted chunks.
  // IMPORTANT: every replacement must be 1-for-1 so string lengths are
  // preserved — the offsets stored in data-s/data-e span attributes must
  // still align with the raw chunk text used by startReading.
  function normForMatch(s) {
    return s
      .replace(/\s+/g, ' ')
      .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")   // smart single quotes → '
      .replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"')   // smart double quotes → "
      .replace(/[\u2013\u2014\u2015]/g, '-')               // en/em-dash → -
      .replace(/\u2026/g, '.')                             // ellipsis → . (1-for-1)
      .replace(/\u00A0/g, ' ')                             // non-breaking space → space
      .trim();
  }

  // Block-level tags that disqualify a <div> from being a leaf content node.
  const BLOCK_TAGS = new Set(['P','H1','H2','H3','H4','H5','H6','LI','DIV','BLOCKQUOTE','TABLE','UL','OL','FIGURE']);

  function isLeafDiv(el) {
    if (el.tagName !== 'DIV' && el.tagName !== 'BLOCKQUOTE') return true;
    for (const child of el.children) {
      if (BLOCK_TAGS.has(child.tagName)) return false;
    }
    return el.textContent.trim().length >= 20;
  }

  function markPageElements(paragraphs) {
    const candidates = Array.from(
      document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, div, blockquote')
    ).filter((el) => !el.closest('#rta-panel') && isLeafDiv(el));

    const used = new Set();

    paragraphs.forEach((text, idx) => {
      const normText = normForMatch(text);
      let bestEl = null, bestScore = 0;

      for (const el of candidates) {
        if (used.has(el)) continue;
        const elText = normForMatch(el.textContent);
        if (elText === normText) { bestEl = el; bestScore = 1; break; }
        if (normText.includes(elText) && elText.length > 15) {
          const score = elText.length / normText.length;
          if (score > 0.6 && score > bestScore) { bestScore = score; bestEl = el; }
        }
      }

      if (bestEl) {
        used.add(bestEl);
        bestEl._rtaOrigHTML = bestEl.innerHTML;
        bestEl.setAttribute('data-rta-chunk', idx);
        // Render using the original chunk text so data-s/data-e offsets
        // stay aligned with RA.chunks[idx] used by startReading.
        bestEl.innerHTML = renderParagraph(text);
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

  // ─── Persistent storage helpers ───────────────────────────────────────────

  // Show a temporary toast notification anchored to the bottom of the screen.
  // Used for errors that occur before the player panel is built.
  function showToast(msg) {
    let toast = document.getElementById('rta-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'rta-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('rta-toast-show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('rta-toast-show'), 3500);
  }

  // Persist the current paragraph index keyed by page URL.
  // Entries older than 7 days are pruned on next write (max 200 stored).
  function savePosition(idx) {
    chrome.storage.local.get({ positions: {} }).then(({ positions }) => {
      const WEEK = 7 * 24 * 60 * 60 * 1000;
      const pruned = Object.fromEntries(
        Object.entries(positions)
          .filter(([, v]) => Date.now() - v.ts < WEEK)
          .sort(([, a], [, b]) => b.ts - a.ts)
          .slice(0, 199)
      );
      pruned[location.href] = { idx, ts: Date.now() };
      chrome.storage.local.set({ positions: pruned });
    }).catch(() => {});
  }

  async function loadPosition() {
    try {
      const { positions = {} } = await chrome.storage.local.get('positions');
      const entry = positions[location.href];
      if (!entry || Date.now() - entry.ts > 7 * 24 * 60 * 60 * 1000) return 0;
      return entry.idx || 0;
    } catch (_) { return 0; }
  }

  // Load rate + voiceName from sync storage and apply to RA state.
  async function loadSettings() {
    try {
      const { rate = 1.25, pitch = 1, voiceName = '' } =
        await chrome.storage.sync.get(['rate', 'pitch', 'voiceName']);
      RA.rate = rate;
      RA.pitch = pitch;
      RA.voiceName = voiceName;
    } catch (_) {}
  }

  function saveSetting(key, value) {
    chrome.storage.sync.set({ [key]: value }).catch(() => {});
  }

  // Increment the running word count in local storage (used by the options page).
  function trackWords(text) {
    const n = text.trim().split(/\s+/).filter(Boolean).length;
    chrome.storage.local.get({ stats: { wordsRead: 0, weekStart: 0 } }).then(({ stats }) => {
      const WEEK = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - (stats.weekStart || 0) > WEEK) {
        stats.wordsRead = 0;
        stats.weekStart = Date.now();
      }
      stats.wordsRead = (stats.wordsRead || 0) + n;
      chrome.storage.local.set({ stats });
    }).catch(() => {});
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

    const pitches = [{ v: 0.8, label: 'Low' }, { v: 1, label: 'Mid' }, { v: 1.2, label: 'High' }];
    const pitchBtns = pitches
      .map((p) => `<button class="rta-pitch${p.v === RA.pitch ? ' rta-pitch-active' : ''}" data-pitch="${p.v}">${p.label}</button>`)
      .join('');

    const panel = document.createElement('div');
    panel.id = 'rta-panel';
    panel.innerHTML = `
      <div id="rta-player">
        <div id="rta-progress"><div id="rta-progress-fill"></div></div>
        <div id="rta-logo" title="Drag to move">${LOGO_SVG}</div>
        <button class="rta-btn rta-play-btn" id="rta-playpause" title="Play">▶</button>
        <button id="rta-speed-badge" title="Click to cycle speed">${RA.rate}x</button>
        <div id="rta-controls">
          <div class="rta-player-group">
            <button class="rta-btn" id="rta-prev" title="Previous paragraph">⏮</button>
            <button class="rta-btn rta-icon-btn" id="rta-skip-back" title="Back 10s">↺<span class="rta-skip-label">10</span></button>
            <button class="rta-btn rta-icon-btn" id="rta-skip-fwd" title="Forward 10s"><span class="rta-skip-label">10</span>↻</button>
            <button class="rta-btn" id="rta-next" title="Next paragraph">⏭</button>
          </div>
          <div id="rta-status">Ready</div>
          <div class="rta-player-group">
            <span class="rta-label">Voice</span>
            <select id="rta-voice" title="Select voice (✦ = cloud/natural)"></select>
          </div>
          <div class="rta-player-group">
            <span class="rta-label">Pitch</span>
            ${pitchBtns}
          </div>
          <div class="rta-player-group">
            <span class="rta-label">Speed</span>
            ${speedBtns}
          </div>
        </div>
        <div id="rta-actions">
          <button id="rta-save" title="Save to reading list">🔖</button>
          <button id="rta-options" title="Settings">⚙</button>
          <button id="rta-collapse" title="Expand">+</button>
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
    const dragAbort = new AbortController();
    const { signal } = dragAbort;

    // Store so teardown can cancel all document-level drag listeners at once
    RA._dragAbort = dragAbort;

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
    }, { signal });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const x = Math.max(0, Math.min(e.clientX - startX, window.innerWidth - panel.offsetWidth));
      const y = Math.max(0, Math.min(e.clientY - startY, window.innerHeight - panel.offsetHeight));
      panel.style.left = x + 'px';
      panel.style.top = y + 'px';
    }, { signal });

    document.addEventListener('mouseup', () => {
      if (dragging) { dragging = false; handle.style.cursor = 'grab'; }
    }, { signal });
  }

  function attachEvents(paragraphs) {
    document.getElementById('rta-close').addEventListener('click', teardown);

    document.getElementById('rta-options').addEventListener('click', () => {
      // openOptionsPage() is unavailable in content scripts — delegate to background
      chrome.runtime.sendMessage({ action: 'openOptions' });
    });

    document.getElementById('rta-save').addEventListener('click', () => {
      const url = location.href;
      const title = document.title || url;
      const wordCount = RA.chunks.reduce((n, c) => n + c.trim().split(/\s+/).length, 0);
      chrome.storage.local.get({ readingList: [] }).then(({ readingList }) => {
        if (readingList.find((item) => item.url === url)) {
          setStatus('Already saved ✓');
        } else {
          readingList.unshift({ url, title, wordCount, ts: Date.now() });
          if (readingList.length > 100) readingList.pop();
          chrome.storage.local.set({ readingList });
          setStatus('Saved to reading list ✓');
        }
        setTimeout(() => { if (!RA.playing) setStatus('Ready'); }, 2000);
      }).catch(() => {});
    });

    document.getElementById('rta-collapse').addEventListener('click', () => {
      const panel = document.getElementById('rta-panel');
      const expanded = panel.classList.toggle('rta-expanded');
      document.getElementById('rta-collapse').title = expanded ? 'Collapse' : 'Expand';
      document.getElementById('rta-collapse').textContent = expanded ? '−' : '+';
    });

    const togglePlay = () => {
      if (!RA.playing && !RA.paused) {
        startReading(RA.chunkIndex);
      } else if (RA.playing) {
        // Estimate current char position before canceling so we can resume later.
        // RA.synth.pause() is unreliable in Chrome — queued sentences keep playing.
        // cancel() reliably clears the queue.
        const elapsed = Date.now() - RA.uttStartTime;
        const charsPerMs = (12.5 * RA.rate) / 1000;
        RA.pauseChunk = RA.chunkIndex;
        RA.pauseOffset = Math.min(
          Math.round(RA.uttCharOffset + elapsed * charsPerMs),
          RA.chunks[RA.chunkIndex].length - 1
        );
        RA.synth.cancel();
        RA.paused = true;
        RA.playing = false;
        setPlayBtn(false);
        stopKeepAlive();
        clearWordTimers();
      } else {
        // Resume from the position saved at pause time
        RA.paused = false;
        RA.playing = true;
        setPlayBtn(true);
        startReading(RA.pauseChunk, RA.pauseOffset);
      }
    };
    document.getElementById('rta-playpause').addEventListener('click', togglePlay);

    document.getElementById('rta-prev').addEventListener('click', () => jump(Math.max(0, RA.chunkIndex - 1)));
    document.getElementById('rta-next').addEventListener('click', () => jump(Math.min(paragraphs.length - 1, RA.chunkIndex + 1)));
    document.getElementById('rta-skip-back').addEventListener('click', () => skip(-10));
    document.getElementById('rta-skip-fwd').addEventListener('click', () => skip(10));

    const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

    function applySpeed(newRate) {
      RA.rate = newRate;
      saveSetting('rate', RA.rate);
      const badge = document.getElementById('rta-speed-badge');
      if (badge) badge.textContent = RA.rate + 'x';
      document.querySelectorAll('.rta-speed').forEach((b) => {
        b.classList.toggle('rta-speed-active', parseFloat(b.dataset.speed) === RA.rate);
      });
      if (RA.playing) {
        RA.synth.cancel();
        RA.paused = false;
        startReading(RA.chunkIndex);
      }
    }

    // Speed badge: click cycles through speed steps
    document.getElementById('rta-speed-badge').addEventListener('click', () => {
      const idx = SPEEDS.indexOf(RA.rate);
      applySpeed(SPEEDS[(idx + 1) % SPEEDS.length]);
    });

    document.querySelectorAll('.rta-speed').forEach((btn) => {
      btn.addEventListener('click', () => applySpeed(parseFloat(btn.dataset.speed)));
    });

    document.querySelectorAll('.rta-pitch').forEach((btn) => {
      btn.addEventListener('click', () => {
        RA.pitch = parseFloat(btn.dataset.pitch);
        saveSetting('pitch', RA.pitch);
        document.querySelectorAll('.rta-pitch').forEach((b) => b.classList.remove('rta-pitch-active'));
        btn.classList.add('rta-pitch-active');
        if (RA.playing) {
          RA.synth.cancel();
          RA.paused = false;
          startReading(RA.chunkIndex);
        }
      });
    });

    // Voice picker
    populateVoiceSelect();
    // Voices load asynchronously in Chrome — repopulate when they arrive
    RA.synth.addEventListener('voiceschanged', populateVoiceSelect);

    document.getElementById('rta-voice').addEventListener('change', (e) => {
      RA.voiceName = e.target.value;
      saveSetting('voiceName', RA.voiceName);
      if (RA.playing) {
        RA.synth.cancel();
        RA.paused = false;
        startReading(RA.chunkIndex);
      }
    });
  }

  function setPlayBtn(playing) {
    const icon = playing ? '⏸' : '▶';
    const btn = document.getElementById('rta-playpause');
    if (btn) btn.textContent = icon;
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

  // Score a voice for quality. Higher = better.
  // Cloud-streamed voices (!localService) sound much more natural than local ones.
  function voiceScore(v) {
    if (!v.lang.startsWith('en')) return -1;
    let s = 0;
    if (!v.localService) s += 20;
    if (v.name.includes('Google')) s += 8;
    if (v.name.includes('Neural') || v.name.includes('Natural') ||
        v.name.includes('Premium') || v.name.includes('Enhanced')) s += 5;
    if (v.lang === 'en-US') s += 2;
    if (v.lang === 'en-GB') s += 1;
    return s;
  }

  function getBestVoice() {
    const voices = RA.synth.getVoices();
    if (RA.voiceName) {
      const preferred = voices.find((v) => v.name === RA.voiceName);
      if (preferred) return preferred;
    }
    // Pick highest-scoring English voice
    return voices
      .filter((v) => v.lang.startsWith('en'))
      .sort((a, b) => voiceScore(b) - voiceScore(a))[0] || voices[0];
  }

  function populateVoiceSelect() {
    const sel = document.getElementById('rta-voice');
    if (!sel) return;
    const voices = RA.synth.getVoices().filter((v) => v.lang.startsWith('en'));
    voices.sort((a, b) => voiceScore(b) - voiceScore(a));
    sel.innerHTML = '';
    voices.forEach((v) => {
      const opt = document.createElement('option');
      opt.value = v.name;
      opt.textContent = v.name.replace(/^Microsoft /, '').replace(/^Google /, 'Google ');
      if (!v.localService) opt.textContent += ' ✦';
      opt.selected = v.name === RA.voiceName || (!RA.voiceName && v === voices[0]);
      sel.appendChild(opt);
    });
    // Sync RA.voiceName to whichever option ended up selected
    if (!RA.voiceName && voices.length) RA.voiceName = voices[0].name;
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

  // Chrome fires onstart when it begins *processing* the utterance, not when
  // audio actually reaches the speakers.  This constant compensates for that gap
  // so timer-based highlights don't run ahead of the audio.
  const AUDIO_STARTUP_MS = 120;

  // Schedule per-word highlight timeouts, anchored to the moment a sentence
  // utterance actually starts (called from onstart, not before speak()).
  // maxOffset limits scheduling to the current sentence's words only — this
  // prevents stale timers from carrying over into subsequent sentences.
  // onboundary events cancel these and take over with exact positions when fired.
  function scheduleWordHighlights(chunkIdx, charOffset, maxOffset = Infinity) {
    clearWordTimers();
    const para = document.querySelector(`[data-rta-chunk="${chunkIdx}"]`);
    if (!para) return;

    const words = Array.from(para.querySelectorAll('.rta-word'));
    const startIdx = charOffset > 0
      ? words.findIndex((w) => parseInt(w.dataset.e, 10) > charOffset)
      : 0;
    if (startIdx < 0) return;

    // ~13 chars/sec at 1× (≈ 156 wpm); scales linearly with rate
    const msPerChar = 1000 / (13 * RA.rate);
    let elapsed = 0;

    for (let i = startIdx; i < words.length; i++) {
      const word = words[i];
      const wordStart = parseInt(word.dataset.s, 10);
      if (wordStart >= maxOffset) break;

      // Use span from this word's start to the next word's start — this
      // includes the word characters AND the whitespace gap that follows,
      // avoiding cumulative drift caused by omitting inter-word pauses.
      const nextWordStart = i + 1 < words.length
        ? parseInt(words[i + 1].dataset.s, 10)
        : wordStart + word.textContent.trim().length;
      const charSpan = nextWordStart - wordStart;

      const delay = elapsed + AUDIO_STARTUP_MS;
      elapsed += Math.max(charSpan * msPerChar, 60 / RA.rate);

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

    // Some Chrome voices report charIndex pointing to the whitespace *before*
    // the word (e.g. charIndex=5 for "world" in "hello world" where world
    // starts at s=6).  If no span contains charIndex exactly, snap forward
    // to the first span whose start is closest to charIndex.
    let matched = null;
    for (const span of para.querySelectorAll('.rta-word')) {
      const s = parseInt(span.dataset.s, 10);
      const e = parseInt(span.dataset.e, 10);
      if (charIndex >= s && charIndex < e) {
        matched = span;
        break;
      }
      if (s > charIndex && !matched) {
        // charIndex fell in the whitespace gap before this span — snap to it
        matched = span;
        break;
      }
    }

    if (matched) {
      matched.classList.add('rta-hl');
      // Auto-scroll word into view if it's scrolled off-screen.
      // Use 80px margins to keep it clear of the fixed player bar at the bottom.
      const rect = matched.getBoundingClientRect();
      if (rect.top < 80 || rect.bottom > window.innerHeight - 80) {
        matched.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  // ─── TTS text normalisation ───────────────────────────────────────────────

  // Convert a 4-digit year integer (1000–2099) to its natural spoken form.
  // e.g. 1776 → "seventeen seventy-six", 2024 → "twenty twenty-four"
  function yearToWords(y) {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
                  'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen',
                  'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tensWords = ['', '', 'twenty', 'thirty', 'forty', 'fifty',
                       'sixty', 'seventy', 'eighty', 'ninety'];

    function twoDigits(n) {
      if (n === 0) return 'hundred';
      if (n < 20) return ones[n];
      const t = Math.floor(n / 10), o = n % 10;
      return o === 0 ? tensWords[t] : tensWords[t] + '-' + ones[o];
    }

    if (y >= 2010) return 'twenty ' + twoDigits(y - 2000);
    if (y === 2000) return 'two thousand';
    if (y >= 2001) return 'two thousand ' + ones[y - 2000];

    // 1000–1999: split into two 2-digit halves ("nineteen seventy-six")
    const high = Math.floor(y / 100);   // 10–19
    const low  = y % 100;               // 0–99
    if (low === 0) return ones[high] + ' hundred';
    if (low < 10)  return ones[high] + ' oh ' + ones[low];
    return ones[high] + ' ' + twoDigits(low);
  }

  // Normalise text before it is handed to the TTS engine.
  // Only the spoken string is changed — displayed chunk text is untouched,
  // so word-highlight char offsets remain valid.
  function normalizeTTSText(text) {
    // Replace year-range integers (1000–2099) with their spoken form
    return text.replace(/\b(1\d{3}|20\d{2})\b/g, (m) => yearToWords(parseInt(m, 10)));
  }

  // ─── Sentence splitting ───────────────────────────────────────────────────


  // Split text into short utterance strings for TTS.
  // Two-pass: first split at sentence boundaries, then further split any
  // segment longer than MAX_CHARS at comma/semicolon/colon clause boundaries.
  // Shorter utterances give the TTS engine a smaller prosody window, which
  // eliminates slurring at 1.5× and 2× even on slower local voices.
  function sentenceSplit(text) {
    const MAX_CHARS = 120;

    // Pass 1 — sentence boundaries
    const sentences = text
      .split(/(?<!\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|vs|etc|e\.g|i\.e))(?<=[.!?])\s+(?=[A-Z"'\u201C])/u)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Pass 2 — clause boundaries for long sentences
    const result = [];
    for (const sent of (sentences.length ? sentences : [text])) {
      if (sent.length <= MAX_CHARS) { result.push(sent); continue; }

      // Split on comma/semicolon/colon + space, keeping the punctuation attached
      const clauses = sent.split(/(?<=[,;:])\s+/);
      let cur = '';
      for (const clause of clauses) {
        if (!cur) { cur = clause; continue; }
        // Keep joining until adding the next clause would exceed the limit
        if ((cur + ' ' + clause).length <= MAX_CHARS) {
          cur += ' ' + clause;
        } else {
          result.push(cur);
          cur = clause;
        }
      }
      if (cur.trim()) result.push(cur.trim());
    }

    return result.length > 0 ? result : [text];
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

      const utt = new SpeechSynthesisUtterance(normalizeTTSText(sentence));
      utt.rate = RA.rate;
      utt.pitch = RA.pitch;
      utt.voice = getBestVoice();

      utt.onstart = () => {
        RA.chunkIndex = idx;
        RA.uttStartTime = Date.now();
        RA.uttCharOffset = sOffset;
        // Anchor highlights to actual speech start, bounded to this sentence only
        scheduleWordHighlights(idx, sOffset, sOffset + sentence.length);
        if (isFirst) {
          setActivePara(idx);
          setStatus(timeRemainingStr(idx));
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
        if (isLast) {
          trackWords(fullText);
          if (!RA.paused && idx + 1 >= RA.chunks.length) {
            setStatus('Done');
            setPlayBtn(false);
            RA.playing = false;
            stopKeepAlive();
          }
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

    const utterance = new SpeechSynthesisUtterance(normalizeTTSText(firstText));
    utterance.rate = RA.rate;
    utterance.pitch = RA.pitch;
    utterance.voice = getBestVoice();

    utterance.onstart = () => {
      // Speech actually started — cancel the silent-failure watchdog.
      clearTimeout(RA.noStartTimer);
      scheduleWordHighlights(idx, firstGlobalOffset, firstGlobalOffset + firstText.length);
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

      const utt = new SpeechSynthesisUtterance(normalizeTTSText(sentences[i]));
      utt.rate = RA.rate;
      utt.pitch = RA.pitch;
      utt.voice = getBestVoice();

      utt.onstart = () => {
        RA.uttStartTime = Date.now();
        RA.uttCharOffset = sOffset;
        scheduleWordHighlights(idx, sOffset, sOffset + sentences[i].length);
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

    // Load persisted speed + voice before doing anything else
    await loadSettings();

    let paragraphs = [];

    if (window.__rtaPdfMode) {
      try {
        paragraphs = await extractPdfChunks();
      } catch (e) {
        console.warn('ReadAloud PDF extraction error:', e);
        if (!silent) showToast('ReadAloud: Could not extract text from this PDF.');
        return;
      }
    } else {
      const tryExtract = () => {
        const article = extractArticle();
        let result = article ? getParagraphs(article) : [];
        // Readability didn't get enough — try live DOM selectors
        if (result.length < 3) result = extractFallback() || [];
        // Still nothing — brute-force grab every <p> outside nav/footer/ads
        if (result.length < 3) result = extractLastResort() || [];
        return result;
      };

      paragraphs = tryExtract();

      // JS-heavy / SPA sites may not have rendered the article yet at script
      // injection time.  If we got nothing, wait 1.5 s and try once more.
      if (paragraphs.length < 3) {
        await new Promise((r) => setTimeout(r, 1500));
        paragraphs = tryExtract();
      }
    }

    if (paragraphs.length === 0) {
      if (!silent) showToast('ReadAloud: No readable content found on this page.');
      return;
    }

    RA.chunks = paragraphs;
    // Load persisted position for this URL; clamp in case article shrank
    RA.chunkIndex = Math.min(await loadPosition(), Math.max(0, paragraphs.length - 1));
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
    if (RA._dragAbort) { RA._dragAbort.abort(); RA._dragAbort = null; }
    const panel = document.getElementById('rta-panel');
    if (panel) panel.remove();
    restorePageElements();
    RA.active = false;
    RA.playing = false;
    RA.paused = false;
    RA.chunkIndex = 0;
    RA.pauseChunk = 0;
    RA.pauseOffset = 0;
  }

  // ─── Entry points ─────────────────────────────────────────────────────────

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'activate') activate();
  });

  activate(true);
}
