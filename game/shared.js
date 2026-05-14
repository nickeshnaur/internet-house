/* /game/shared.js — utilities + GAMES registry + global wiring. */

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function fmtTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Per-game timer. Counts up by default; pass {countdown:N} for a count-down.
function createTimer(displayEl, opts = {}) {
  const countdown = opts.countdown || 0;
  let started = false, stopped = false, t0 = 0, raf = null;
  let onExpire = null;
  function tick() {
    const sec = Math.floor((performance.now() - t0) / 1000);
    const remaining = countdown ? Math.max(0, countdown - sec) : null;
    const shown = countdown ? remaining : sec;
    displayEl.textContent = fmtTime(shown);
    if (countdown && remaining === 0) {
      stopped = true;
      if (onExpire) onExpire();
      return;
    }
    if (!stopped) raf = requestAnimationFrame(tick);
  }
  return {
    start() {
      if (started) return;
      started = true; stopped = false;
      t0 = performance.now();
      tick();
    },
    stop() {
      stopped = true;
      if (raf) cancelAnimationFrame(raf);
    },
    reset() {
      started = false; stopped = true;
      if (raf) cancelAnimationFrame(raf);
      displayEl.textContent = fmtTime(countdown || 0);
    },
    elapsed() {
      if (!started) return 0;
      return Math.floor((performance.now() - t0) / 1000);
    },
    formatted() {
      return displayEl.textContent;
    },
    onExpire(fn) { onExpire = fn; },
    isStarted() { return started; },
    isStopped() { return stopped; },
  };
}

let _toastEl = null;
let _toastTimer = null;
function showToast(msg) {
  if (!_toastEl) _toastEl = $('#toast');
  if (!_toastEl) return;
  _toastEl.textContent = msg;
  _toastEl.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => _toastEl.classList.remove('show'), 1600);
}

async function copyShare(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard');
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    ta.remove();
    showToast('Copied to clipboard');
  }
}

function shake(el) {
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 360);
}

function haptic(ms = 10) {
  if (navigator.vibrate) try { navigator.vibrate(ms); } catch(e) {}
}

function rafThrottle(fn) {
  let pending = false, lastArgs = null;
  return (...args) => {
    lastArgs = args;
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      fn.apply(null, lastArgs);
    });
  };
}

function flashReveal(stageEl) {
  if (!stageEl) return;
  stageEl.classList.remove('revealing');
  void stageEl.offsetWidth;
  stageEl.classList.add('revealing');
  setTimeout(() => stageEl.classList.remove('revealing'), 800);
}

// Populate header date stamp if present.
(function setToday() {
  const el = document.getElementById('today');
  if (!el) return;
  const d = new Date();
  el.textContent = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
})();

// Game registry — each game's IIFE registers as GAMES[slug] = { reset, share, reveal?, load?, onShow? }.
const GAMES = {};

// Global click handler: picker, reset, reveal, share.
document.addEventListener('click', e => {
  const pick = e.target.closest('.puzzle-pick');
  if (pick) {
    const game = pick.dataset.game;
    const idx = +pick.dataset.idx;
    const mod = GAMES[game];
    if (mod && mod.load) {
      mod.load(idx);
      document.querySelectorAll(`.puzzle-pick[data-game="${game}"]`).forEach(b => {
        if (+b.dataset.idx === idx) b.setAttribute('aria-current', 'true');
        else b.removeAttribute('aria-current');
      });
    }
    return;
  }
  const btn = e.target.closest('.tool-btn');
  if (!btn) return;
  const game = btn.dataset.game;
  const action = btn.dataset.action;
  const mod = GAMES[game];
  if (!mod) return;
  if (action === 'reset')  mod.reset();
  if (action === 'share')  mod.share  && mod.share();
  if (action === 'reveal') mod.reveal && mod.reveal();
});
