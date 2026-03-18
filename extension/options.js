'use strict';

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Stats ──────────────────────────────────────────────────────────────────

chrome.storage.local.get({ stats: { wordsRead: 0, weekStart: 0 } }, ({ stats }) => {
  const words = stats.wordsRead || 0;
  // Rough estimate: average TTS rate ≈ 160 wpm at 1× speed
  const minutes = Math.round(words / 160);

  document.getElementById('stat-words').textContent = words.toLocaleString();
  document.getElementById('stat-minutes').textContent = minutes.toLocaleString();

  if (words > 0) {
    // Time saved vs silent reading (avg 238 wpm) at the user's speed
    // Just show an encouraging note
    const books = (words / 80000).toFixed(2);   // avg novel ≈ 80k words
    document.getElementById('stat-note').textContent =
      words >= 80000
        ? `That's about ${Math.floor(words / 80000)} book${words >= 160000 ? 's' : ''} worth of content.`
        : `Keep going — ${(80000 - words).toLocaleString()} words until your first book equivalent.`;
  }
});

// ── Settings ───────────────────────────────────────────────────────────────

chrome.storage.sync.get({ rate: 1.5, voiceName: '' }, ({ rate, voiceName }) => {

  // Speed buttons
  const group = document.getElementById('speed-group');
  group.querySelectorAll('.speed-btn').forEach((btn) => {
    if (parseFloat(btn.dataset.speed) === rate) btn.classList.add('active');
    btn.addEventListener('click', () => {
      group.querySelectorAll('.speed-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      chrome.storage.sync.set({ rate: parseFloat(btn.dataset.speed) });
    });
  });

  // Voice picker — voices load async in some browsers
  const select = document.getElementById('voice-select');

  function populateVoices(voices) {
    const english = voices.filter((v) => v.lang.startsWith('en'));
    // Group: online first, then local
    const online = english.filter((v) => !v.localService);
    const local  = english.filter((v) => v.localService);

    if (online.length) {
      const og = document.createElement('optgroup');
      og.label = 'Online voices';
      online.forEach((v) => {
        const opt = document.createElement('option');
        opt.value = v.name;
        opt.textContent = `${v.name} (${v.lang})`;
        opt.selected = v.name === voiceName;
        og.appendChild(opt);
      });
      select.appendChild(og);
    }

    if (local.length) {
      const lg = document.createElement('optgroup');
      lg.label = 'On-device voices';
      local.forEach((v) => {
        const opt = document.createElement('option');
        opt.value = v.name;
        opt.textContent = `${v.name} (${v.lang})`;
        opt.selected = v.name === voiceName;
        lg.appendChild(opt);
      });
      select.appendChild(lg);
    }
  }

  const voices = window.speechSynthesis.getVoices();
  if (voices.length) {
    populateVoices(voices);
  } else {
    window.speechSynthesis.onvoiceschanged = () =>
      populateVoices(window.speechSynthesis.getVoices());
  }

  select.addEventListener('change', () => {
    chrome.storage.sync.set({ voiceName: select.value });
  });
});

// ── Reading list ───────────────────────────────────────────────────────────

chrome.storage.local.get({ readingList: [] }, ({ readingList }) => {
  const container = document.getElementById('reading-list');
  const badge = document.getElementById('list-count');

  if (readingList.length === 0) return;

  badge.textContent = readingList.length;
  container.innerHTML = '';

  readingList.forEach((item, idx) => {
    const date = new Date(item.ts).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric',
    });
    // Estimated listen time at 1.5× speed (~240 wpm)
    const mins = Math.max(1, Math.ceil((item.wordCount || 0) / 240));

    const card = document.createElement('div');
    card.className = 'list-item';
    card.innerHTML = `
      <div class="list-item-body">
        <div class="list-item-title">${escHtml(item.title)}</div>
        <div class="list-item-meta">${escHtml(date)} &middot; ${(item.wordCount || 0).toLocaleString()} words &middot; ~${mins} min</div>
        <div class="list-item-url">${escHtml(item.url)}</div>
      </div>
      <div class="list-item-actions">
        <a class="btn-open" href="${escHtml(item.url)}" target="_blank" rel="noopener">Open</a>
        <button class="btn-remove" data-idx="${idx}" title="Remove">✕</button>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.btn-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.idx, 10);
      readingList.splice(i, 1);
      chrome.storage.local.set({ readingList }, () => location.reload());
    });
  });
});
