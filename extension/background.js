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
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'openOptions') chrome.runtime.openOptionsPage();
});
