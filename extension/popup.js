'use strict';

const MAX_VISIBLE = 6; // reading list items shown before "view all" link

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function isPdfUrl(url) {
  return /\.pdf(\?|#|$)/i.test(url || '');
}

// ── Activate reader on a tab (mirrors the old onClicked logic) ────────────

async function activateTab(tab) {
  try {
    // Player already injected — just toggle it
    await chrome.tabs.sendMessage(tab.id, { action: 'activate' });
  } catch {
    // First use on this tab — inject everything
    await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ['player.css'] });

    if (isPdfUrl(tab.url)) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => { window.__rtaPdfMode = true; },
      });
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['pdf.min.js'] });
    } else {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['Readability.js'] });
    }

    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
  }
}

// ── Auto-activate on popup open ───────────────────────────────────────────
// Clicking the extension icon immediately starts reading — no extra click needed.

document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    await activateTab(tab);
    window.close();
  } catch {
    // Activation failed (e.g. restricted page) — stay open so user sees the UI
    document.getElementById('read-label').textContent = 'Could not read this page';
  }
});

// ── Settings button ───────────────────────────────────────────────────────

document.getElementById('btn-settings').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
  window.close();
});

// ── Reading list ──────────────────────────────────────────────────────────

chrome.storage.local.get({ readingList: [] }, ({ readingList }) => {
  const section = document.getElementById('list-section');
  const emptyEl = document.getElementById('list-empty');
  const itemsEl = document.getElementById('list-items');
  const badge   = document.getElementById('list-badge');
  const viewAll = document.getElementById('btn-view-all');

  if (readingList.length === 0) {
    emptyEl.hidden = false;
    return;
  }

  section.hidden = false;
  badge.textContent = readingList.length;

  const visible = readingList.slice(0, MAX_VISIBLE);

  visible.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'list-item';

    // Estimated read time at 1.5× (~240 wpm)
    const mins = Math.max(1, Math.ceil((item.wordCount || 0) / 240));
    const domain = (() => { try { return new URL(item.url).hostname.replace('www.', ''); } catch { return ''; } })();

    row.innerHTML = `
      <div class="item-body">
        <div class="item-title">${escHtml(item.title)}</div>
        <div class="item-meta">${escHtml(domain)} &middot; ~${mins} min</div>
      </div>
      <button class="btn-open" data-url="${escHtml(item.url)}" title="Open article">▶</button>
    `;
    itemsEl.appendChild(row);
  });

  // Wire up open buttons: navigate to the article and activate the reader
  itemsEl.querySelectorAll('.btn-open').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const url = btn.dataset.url;
      // Open (or reuse) a tab with the saved article
      const [existing] = await chrome.tabs.query({ url, currentWindow: true });
      let tab;
      if (existing) {
        tab = await chrome.tabs.update(existing.id, { active: true });
      } else {
        tab = await chrome.tabs.create({ url });
      }

      // Wait for the tab to finish loading, then activate the reader
      chrome.tabs.onUpdated.addListener(function onUpdated(tabId, info) {
        if (tabId === tab.id && info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(onUpdated);
          activateTab(tab).catch(() => {});
        }
      });

      window.close();
    });
  });

  if (readingList.length > MAX_VISIBLE) {
    viewAll.hidden = false;
    viewAll.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
      window.close();
    });
  }
});
