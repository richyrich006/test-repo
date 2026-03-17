// background.js — service worker
// On icon click: inject scripts on first use, toggle on subsequent clicks.

chrome.action.onClicked.addListener(async (tab) => {
  try {
    // If already injected, send toggle message
    await chrome.tabs.sendMessage(tab.id, { action: 'activate' });
  } catch {
    // Not injected yet — inject Readability, then our content script + styles.
    // content.js auto-activates after injection.
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['player.css'],
    });
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['Readability.js'],
    });
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js'],
    });
  }
});
