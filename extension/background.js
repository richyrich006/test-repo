// background.js — service worker

// Draw a waveform icon on canvas and return ImageData for chrome.action.setIcon
function makeIconImageData(size) {
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Indigo → purple gradient rounded background
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#6366f1');
  grad.addColorStop(1, '#8b5cf6');

  const r = size * 0.22;
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.arcTo(size, 0, size, r, r);
  ctx.lineTo(size, size - r);
  ctx.arcTo(size, size, size - r, size, r);
  ctx.lineTo(r, size);
  ctx.arcTo(0, size, 0, size - r, r);
  ctx.lineTo(0, r);
  ctx.arcTo(0, 0, r, 0, r);
  ctx.closePath();
  ctx.fill();

  // White waveform bars
  ctx.fillStyle = '#ffffff';
  const heights = [0.38, 0.68, 0.48, 0.88, 0.58];
  const bw = size * 0.1;
  const gap = size * 0.06;
  const totalW = heights.length * bw + (heights.length - 1) * gap;
  let x = (size - totalW) / 2;
  for (const h of heights) {
    const bh = h * size * 0.58;
    const y = (size - bh) / 2;
    const br = bw / 2;
    ctx.beginPath();
    ctx.moveTo(x + br, y);
    ctx.lineTo(x + bw - br, y);
    ctx.arcTo(x + bw, y, x + bw, y + br, br);
    ctx.lineTo(x + bw, y + bh - br);
    ctx.arcTo(x + bw, y + bh, x + bw - br, y + bh, br);
    ctx.lineTo(x + br, y + bh);
    ctx.arcTo(x, y + bh, x, y + bh - br, br);
    ctx.lineTo(x, y + br);
    ctx.arcTo(x, y, x + br, y, br);
    ctx.closePath();
    ctx.fill();
    x += bw + gap;
  }

  return ctx.getImageData(0, 0, size, size);
}

function setActionIcon() {
  try {
    chrome.action.setIcon({
      imageData: {
        16: makeIconImageData(16),
        48: makeIconImageData(48),
        128: makeIconImageData(128),
      },
    });
  } catch (e) {
    // Silently ignore — icon will fall back to default
  }
}

// Set icon whenever the service worker wakes up
setActionIcon();
chrome.runtime.onInstalled.addListener(setActionIcon);
chrome.runtime.onStartup.addListener(setActionIcon);

// Activation is handled by popup.js.
// Background only needs to handle messages that require privileged APIs
// unavailable in content scripts.
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.action === 'openOptions') {
    chrome.runtime.openOptionsPage();
    return;
  }

  if (msg.action === 'anthropicFetch') {
    fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { ...msg.headers, 'anthropic-dangerous-direct-browser-access': 'true' },
      body: msg.body,
    })
      .then(async (resp) => {
        const data = await resp.json().catch(() => ({}));
        sendResponse({ ok: resp.ok, status: resp.status, data });
      })
      .catch((err) => sendResponse({ ok: false, error: err.message }));
    return true;
  }

  if (msg.action === 'elevenLabsVoices') {
    fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': msg.apiKey },
    })
      .then(async (resp) => {
        const data = await resp.json().catch(() => ({}));
        sendResponse({ ok: resp.ok, status: resp.status, data });
      })
      .catch((err) => sendResponse({ ok: false, error: err.message }));
    return true;
  }

  if (msg.action === 'elevenLabsFetch') {
    fetch(`https://api.elevenlabs.io/v1/text-to-speech/${msg.voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': msg.apiKey,
        'Content-Type': 'application/json',
      },
      body: msg.body,
    })
      .then(async (resp) => {
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          sendResponse({ ok: false, status: resp.status, error: err?.detail?.message || `ElevenLabs error ${resp.status}` });
          return;
        }
        const buffer = await resp.arrayBuffer();
        // Convert binary to base64 for message passing
        const bytes = new Uint8Array(buffer);
        let binary = '';
        const chunkSize = 8192;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }
        sendResponse({ ok: true, audio: btoa(binary) });
      })
      .catch((err) => sendResponse({ ok: false, error: err.message }));
    return true;
  }
});
