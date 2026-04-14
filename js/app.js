// ============================================================
// APP — Ruleta de Karaoke
// ============================================================

// ── State ─────────────────────────────────────────────────────

const state = {
  // Config (persisted)
  intensity: 'estandar',
  players: [],
  currentPlayerIndex: 0,

  // Round
  currentSong: null,
  currentChallenge: null,
  changesLeft: 2,
  usedSongIds: [],
  usedChallengeIds: [],

  // Wheel instances (kept for future use)
  homeWheelSong:      null,
  homeWheelChallenge: null,

};

// ── Persistence ────────────────────────────────────────────────

function loadConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem('ruleta_config') || '{}');
    state.intensity            = saved.intensity || 'estandar';
    state.players              = saved.players   || [];
    state.currentPlayerIndex   = 0;
  } catch (_) { /* ignore */ }
}

function saveConfig() {
  localStorage.setItem('ruleta_config', JSON.stringify({
    intensity: state.intensity,
    players:   state.players,
  }));
}

// ── Screen navigation ──────────────────────────────────────────

const SCREEN_IDS = ['home', 'spinning', 'result', 'player'];

function showScreen(name) {
  SCREEN_IDS.forEach(id => {
    const el = document.getElementById(`screen-${id}`);
    if (!el) return;
    el.classList.toggle('active', id === name);
    el.classList.toggle('hidden', id !== name);
  });
}

// ── Player helpers ─────────────────────────────────────────────

function getCurrentPlayer() {
  if (!state.players.length) return null;
  return state.players[state.currentPlayerIndex % state.players.length];
}

function advancePlayer() {
  if (state.players.length > 0) {
    state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  }
}

function updateHomePlayerDisplay() {
  const display  = document.getElementById('current-player-display');
  const nameEl   = document.getElementById('current-player-name');
  const player   = getCurrentPlayer();
  if (player) {
    nameEl.textContent = player;
    display.classList.remove('hidden');
  } else {
    display.classList.add('hidden');
  }
}

// ── Challenge intensity labels ─────────────────────────────────

function intensityLabel(intensity) {
  const map = { suave: '😊 Suave', estandar: '🔥 Estándar', picante: '🌶️ Picante' };
  return map[intensity] || '';
}

function challengeIntensityFor(challenge) {
  if (CHALLENGES.suave.find(c => c.id === challenge.id))    return 'suave';
  if (CHALLENGES.estandar.find(c => c.id === challenge.id)) return 'estandar';
  return 'picante';
}

// ── Visor tape animation ───────────────────────────────────────

const TAPE_H_SONG      = 110; // px — must match CSS .visor-window height
const TAPE_H_CHALLENGE = 85;  // px — must match CSS .visor-window--sm height
const TAPE_PRE_ITEMS   = 48;  // items before target (more = faster perceived spin)

function buildTape(tapeId, pool, targetItem, labelFn, cssClass, itemH, preItems = TAPE_PRE_ITEMS) {
  const tape = document.getElementById(tapeId);
  if (!tape) return 0;
  tape.innerHTML = '';
  tape.style.transform = 'translateY(0)';
  tape.style.filter    = 'none';

  const append = (item, isTarget) => {
    const div = document.createElement('div');
    div.className = `tape-item ${cssClass}${isTarget ? ' tape-item--target' : ''}`;
    div.style.height = `${itemH}px`;
    div.innerHTML = labelFn(item);
    tape.appendChild(div);
  };

  // Random pool for filler items
  const filler = pool.filter(i => i.id !== targetItem.id);
  const pick = () => filler[Math.floor(Math.random() * filler.length)];

  // Pre-items (visual scroll content)
  for (let i = 0; i < preItems; i++) append(pick(), false);
  // Target
  append(targetItem, true);
  // A couple after (so easing overshoot doesn't show blank)
  for (let i = 0; i < 3; i++) append(pick(), false);

  return -(preItems * itemH); // targetY: scroll tape until target is at top of window
}

function animateTape(tapeEl, targetY, duration, onComplete) {
  const startTime = performance.now();
  let prevEased   = 0;

  const tick = (now) => {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Quintic ease-out: violent start → glides to stop
    const eased    = 1 - Math.pow(1 - progress, 5);
    const currentY = targetY * eased;

    // Velocity-based motion blur (normalized per-frame, capped at 8px)
    const frameDelta = eased - prevEased;
    const blur       = Math.min(Math.max(frameDelta * 320 - 0.3, 0), 8);

    tapeEl.style.transform = `translateY(${currentY}px)`;
    tapeEl.style.filter    = blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : 'none';
    prevEased = eased;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      tapeEl.style.transform = `translateY(${targetY}px)`;
      tapeEl.style.filter    = 'none';
      // Snap micro-animation on target item
      const targetEl = tapeEl.querySelector('.tape-item--target');
      if (targetEl) {
        targetEl.classList.add('tape-item--snap');
        setTimeout(() => targetEl.classList.remove('tape-item--snap'), 450);
      }
      onComplete?.();
    }
  };

  requestAnimationFrame(tick);
}

function spinVisor(song, challenge, onComplete) {
  const songPool      = SONGS.filter(s => !s.noEmbed);
  const challengePool = getChallengesForIntensity(state.intensity);

  // Read actual rendered heights for responsive accuracy
  const winSong = document.getElementById('window-song');
  const winChal = document.getElementById('window-challenge');
  const hSong   = winSong  ? winSong.offsetHeight  || TAPE_H_SONG      : TAPE_H_SONG;
  const hChal   = winChal  ? winChal.offsetHeight  || TAPE_H_CHALLENGE  : TAPE_H_CHALLENGE;

  const songLabelFn = s =>
    `<div class="tape-song-inner">
       <div class="tape-song-title">${escapeHtml(s.title)}</div>
       <div class="tape-song-artist">${escapeHtml(s.artist)}</div>
     </div>`;

  const challengeLabelFn = c =>
    `<span class="tape-challenge-emoji">${c.emoji}</span>
     <span class="tape-challenge-text">${escapeHtml(c.text)}</span>`;

  const targetYSong      = buildTape('tape-song',      songPool,      song,      songLabelFn,      'tape-item--song',      hSong);
  const targetYChallenge = buildTape('tape-challenge',  challengePool, challenge, challengeLabelFn, 'tape-item--challenge', hChal);

  const tapeSong      = document.getElementById('tape-song');
  const tapeChallenge = document.getElementById('tape-challenge');

  let songDone = false, chalDone = false;
  const check = () => { if (songDone && chalDone) setTimeout(onComplete, 260); };

  const DURATION = 3700;
  if (tapeSong)      animateTape(tapeSong,      targetYSong,       DURATION,        () => { songDone = true; check(); });
  if (tapeChallenge) animateTape(tapeChallenge, targetYChallenge,  DURATION * 1.08, () => { chalDone = true; check(); });
}

// ── Spin ───────────────────────────────────────────────────────

function doSpin(isReroll = false) {
  // Pre-select content before any animation
  const song = getRandomSong(state.usedSongIds);

  if (!isReroll) {
    state.usedSongIds      = [song.id];
    state.changesLeft      = 2;
    state.currentChallenge = getRandomChallenge(state.intensity, state.usedChallengeIds);
    // Track used challenge; reset the deck when all have been seen
    state.usedChallengeIds.push(state.currentChallenge.id);
    if (state.usedChallengeIds.length >= getChallengesForIntensity(state.intensity).length) {
      state.usedChallengeIds = [];
    }
  } else {
    state.usedSongIds.push(song.id);
  }
  state.currentSong = song;

  if (!isReroll) {
    showScreen('spinning');
    updateSpinPlayerBadge();
    spinVisor(song, state.currentChallenge, showResult);
  } else {
    // Quick reroll — stay on result screen, show mini visor overlay
    updateChangesDisplay();
    disableResultActions(true);
    showRerollOverlay();

    const songPool = SONGS.filter(s => !s.noEmbed);
    const songLabelFn = s =>
      `<div class="tape-song-inner">
         <div class="tape-song-title">${escapeHtml(s.title)}</div>
         <div class="tape-song-artist">${escapeHtml(s.artist)}</div>
       </div>`;

    const winEl  = document.getElementById('reroll-window');
    const hItem  = winEl ? winEl.offsetHeight || 84 : 84;
    const targetY = buildTape('tape-reroll', songPool, song, songLabelFn, 'tape-item--song', hItem, 22);
    const tapeEl  = document.getElementById('tape-reroll');

    animateTape(tapeEl, targetY, 1800, () => {
      setTimeout(() => {
        hideRerollOverlay();
        updateResultSong();
        disableResultActions(false);
      }, 320);
    });
  }
}

function updateSpinPlayerBadge() {
  const badge  = document.getElementById('spin-player-badge');
  const player = getCurrentPlayer();
  if (!badge) return;
  if (player) {
    badge.textContent = `🎤 ${player}`;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

// ── Result screen ──────────────────────────────────────────────

function showResult() {
  const song      = state.currentSong;
  const challenge = state.currentChallenge;

  document.getElementById('result-song-title').textContent   = song.title;
  document.getElementById('result-song-artist').textContent  = song.artist;
  document.getElementById('result-challenge-emoji').textContent = challenge.emoji;
  document.getElementById('result-challenge-text').textContent  = challenge.text;

  // Intensity badge
  const ciEl   = document.getElementById('result-intensity-badge');
  const cIntensity = challengeIntensityFor(challenge);
  ciEl.textContent  = intensityLabel(cIntensity);
  ciEl.className    = `intensity-badge intensity-${cIntensity}`;

  // Player badge
  const pbEl   = document.getElementById('result-player-badge');
  const player = getCurrentPlayer();
  if (player) {
    pbEl.textContent = `🎤 Turno de ${player}`;
    pbEl.classList.remove('hidden');
  } else {
    pbEl.classList.add('hidden');
  }

  updateChangesDisplay();
  disableResultActions(false);

  // Reset animation classes so they can re-fire
  ['result-song-card', 'result-challenge-card', 'result-actions', 'result-actions-meta'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('pop-in'); void el.offsetWidth; }
  });

  showScreen('result');

  // Stagger entrance animations
  requestAnimationFrame(() => {
    document.getElementById('result-song-card').classList.add('pop-in');
    setTimeout(() => document.getElementById('result-challenge-card').classList.add('pop-in'), 160);
    setTimeout(() => {
      document.getElementById('result-actions-meta').classList.add('pop-in');
      document.getElementById('result-actions').classList.add('pop-in');
    }, 300);
  });
}

function updateResultSong() {
  const song     = state.currentSong;
  const titleEl  = document.getElementById('result-song-title');
  const artistEl = document.getElementById('result-song-artist');

  titleEl.classList.add('swap-out');
  artistEl.classList.add('swap-out');

  setTimeout(() => {
    titleEl.textContent  = song.title;
    artistEl.textContent = song.artist;
    titleEl.classList.remove('swap-out');
    artistEl.classList.remove('swap-out');
    titleEl.classList.add('swap-in');
    artistEl.classList.add('swap-in');
    setTimeout(() => {
      titleEl.classList.remove('swap-in');
      artistEl.classList.remove('swap-in');
    }, 400);
  }, 250);
}

function updateChangesDisplay() {
  const container = document.getElementById('changes-dots');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 2; i++) {
    const dot = document.createElement('span');
    dot.className = `change-dot ${i < state.changesLeft ? 'available' : 'used'}`;
    container.appendChild(dot);
  }

  const btnChange = document.getElementById('btn-change-song');
  if (btnChange) btnChange.disabled = state.changesLeft <= 0;
}

function disableResultActions(disabled) {
  ['btn-sing', 'btn-change-song'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = disabled;
  });
}

function showRerollOverlay() {
  const overlay = document.getElementById('reroll-overlay');
  if (overlay) overlay.classList.remove('hidden');
}

function hideRerollOverlay() {
  const overlay = document.getElementById('reroll-overlay');
  if (overlay) overlay.classList.add('hidden');
}

// ── Session log ────────────────────────────────────────────────
// Persistent log of YouTube events and JS errors across all rounds.
// The "Ver log" button in the error overlay shows it.

const _log = [];
function _logEntry(type, payload) {
  const ts = new Date().toISOString().slice(11, 23); // HH:MM:SS.mmm
  const line = `[${ts}] ${type}: ${typeof payload === 'object' ? JSON.stringify(payload) : payload}`;
  _log.push(line);
  console.info(line);
}

window.addEventListener('error', (e) => {
  _logEntry('JS_ERROR', `${e.message} @ ${e.filename}:${e.lineno}`);
});

// ── YouTube Player ─────────────────────────────────────────────
// Single persistent YT.Player reused across rounds via loadVideoById().
//
// WHY: baking videoId into the YT.Player constructor causes YouTube to
// check embed permissions via a fresh HTTP request for that URL, which
// triggers error 150 for some videos. Using loadVideoById() on an already-
// established player session bypasses that check — the same mechanism the
// test page uses, which is why videos pass there but failed in the game.
//
// Critical rule: _ensurePlayer() must be called only after showScreen('player')
// so the iframe container is visible when the player is first created.
// Once the session is established, the container can be hidden/shown freely.

// ── Karaoke iframe player ──────────────────────────────────────
// The YouTube player lives inside karaoke-player.html (an iframe).
// That page has its own document and its own YT session — from YouTube's
// perspective the player is always fully visible, exactly like test-embeds.html.
// Communication is via postMessage in both directions.

let _iframeReady      = false;
let _iframeErrorShown = false;

function _postToFrame(msg) {
  const f = document.getElementById('karaoke-frame');
  if (f && f.contentWindow) f.contentWindow.postMessage(msg, '*');
}

window.addEventListener('message', ({ data: msg }) => {
  if (!msg || !msg.event) return;
  if (msg.event === 'ready') {
    _iframeReady = true;
    _logEntry('FRAME_READY', '');
  } else if (msg.event === 'state') {
    _logEntry('FRAME_STATE', msg.data);
  } else if (msg.event === 'error') {
    _logEntry('FRAME_ERROR', `code=${msg.code} id=${state.currentSong?.videoId}`);
    if (!_iframeErrorShown) {
      _iframeErrorShown = true;
      showPv2Error(msg.code);
    }
  }
});

function playKaraoke() {
  const song = state.currentSong;
  if (!song) return;

  document.getElementById('pv2-song-title').textContent      = song.title;
  document.getElementById('pv2-song-artist').textContent     = song.artist;
  document.getElementById('pv2-challenge-badge').textContent =
    `${state.currentChallenge.emoji} ${state.currentChallenge.text}`;

  showScreen('none'); // hide all screens → iframe at z-index:1 becomes visible
  document.getElementById('screen-player-v2').classList.remove('hidden');
  hidePv2Error();
  _iframeErrorShown = false;
  _logEntry('LOAD', `${song.title} — ${song.artist}  id=${song.videoId}`);

  const doLoad = () => _postToFrame({ cmd: 'load', videoId: song.videoId });
  if (_iframeReady) doLoad();
  else {
    const wait = () => { if (_iframeReady) doLoad(); else setTimeout(wait, 100); };
    wait();
  }
}

// ── V2 error UI ────────────────────────────────────────────────

function showPv2Error(code) {
  const msgs = {
    100: 'El video no está disponible o fue eliminado.',
    101: 'Este video no permite reproducción embebida.',
    150: 'Este video no permite reproducción embebida.',
  };
  const song = state.currentSong;
  _logEntry('ERROR', `code=${code}  song=${song ? song.id + ':' + song.videoId : 'unknown'}`);
  const overlay = document.getElementById('pv2-error-overlay');
  const textEl  = document.getElementById('pv2-error-text');
  if (textEl)  textEl.textContent = msgs[code] || `No se pudo cargar el video. (código ${code})`;
  if (overlay) overlay.classList.remove('hidden');
}

function hidePv2Error() {
  document.getElementById('pv2-error-overlay')?.classList.add('hidden');
  document.getElementById('pv2-log-overlay')?.classList.add('hidden');
}

// ── V1 error UI (kept, not deleted) ────────────────────────────

function handleYtError(code) {
  const playerScreen = document.getElementById('screen-player');
  if (!playerScreen || playerScreen.classList.contains('hidden')) return;

  const song = state.currentSong;
  _logEntry('ERROR', `code=${code}  song=${song ? song.id + ':' + song.videoId : 'unknown'}`);

  const msgs = {
    100: 'El video no está disponible o fue eliminado.',
    101: 'Este video no permite reproducción embebida.',
    150: 'Este video no permite reproducción embebida.',
  };
  showYtError(msgs[code] || `No se pudo cargar el video. (código ${code})`);
}

function showYtError(msg) {
  const overlay = document.getElementById('yt-error-overlay');
  const textEl  = document.getElementById('yt-error-text');
  if (textEl)  textEl.textContent = msg;
  if (overlay) overlay.classList.remove('hidden');
}

function hideYtError() {
  document.getElementById('yt-error-overlay')?.classList.add('hidden');
  document.getElementById('log-overlay')?.classList.add('hidden');
}

function endRound() {
  _iframeErrorShown = false;
  _postToFrame({ cmd: 'stop' });
  document.getElementById('screen-player-v2').classList.add('hidden');
  advancePlayer();
  updateHomePlayerDisplay();
  showScreen('home');
}

// ── Config modal ───────────────────────────────────────────────

function openConfig() {
  document.getElementById('modal-config').classList.remove('hidden');
  renderIntensitySelector();
  renderPlayersList();
  setTimeout(() => {
    const inp = document.getElementById('player-input');
    if (inp) inp.value = '';
  }, 50);
}

function closeConfig() {
  document.getElementById('modal-config').classList.add('hidden');
}

function renderIntensitySelector() {
  document.querySelectorAll('.intensity-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === state.intensity);
  });
}

function renderPlayersList() {
  const list = document.getElementById('players-list');
  list.innerHTML = '';
  state.players.forEach((name, i) => {
    const tag = document.createElement('div');
    tag.className = 'player-tag';
    tag.innerHTML = `
      <span class="player-tag-name">${escapeHtml(name)}</span>
      <button class="player-tag-remove" data-index="${i}" aria-label="Eliminar ${escapeHtml(name)}">✕</button>
    `;
    list.appendChild(tag);
  });
  list.querySelectorAll('.player-tag-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      state.players.splice(parseInt(btn.dataset.index, 10), 1);
      state.currentPlayerIndex = 0;
      renderPlayersList();
    });
  });
}

function addPlayer() {
  const input = document.getElementById('player-input');
  const name  = input.value.trim();
  if (!name) return;
  if (state.players.includes(name)) { input.select(); return; }
  if (state.players.length >= 12)   return;
  state.players.push(name);
  input.value = '';
  input.focus();
  renderPlayersList();
}

function saveAndCloseConfig() {
  saveConfig();
  updateHomePlayerDisplay();
  closeConfig();
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Home decorations ───────────────────────────────────────────

function createStars() {
  const container = document.getElementById('home-stars');
  if (!container) return;
  container.innerHTML = '';
  const count = 22;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = 2 + Math.random() * 3.5;
    star.style.cssText = [
      `left: ${4 + Math.random() * 92}%`,
      `top: ${3 + Math.random() * 90}%`,
      `width: ${size}px`,
      `height: ${size}px`,
      `--delay: ${(Math.random() * 3).toFixed(2)}s`,
      `--dur: ${(1.4 + Math.random() * 2).toFixed(2)}s`,
    ].join(';');
    container.appendChild(star);
  }
}

function createMarqueeDots() {
  const frame = document.getElementById('logo-frame');
  if (!frame) return;

  // Wait one frame so the frame has been laid out
  requestAnimationFrame(() => {
    const w = frame.offsetWidth;
    const h = frame.offsetHeight;
    const offset = -5; // center dot on the border edge
    const spacing = 28;

    const positions = [];

    // Top edge
    const topCount = Math.floor(w / spacing);
    for (let i = 0; i <= topCount; i++) {
      positions.push({ x: (i / topCount) * w, y: offset });
    }
    // Bottom edge
    for (let i = 0; i <= topCount; i++) {
      positions.push({ x: (i / topCount) * w, y: h + offset });
    }
    // Left edge (skip corners already covered)
    const sideCount = Math.floor(h / spacing);
    for (let i = 1; i < sideCount; i++) {
      positions.push({ x: offset, y: (i / sideCount) * h });
    }
    // Right edge
    for (let i = 1; i < sideCount; i++) {
      positions.push({ x: w + offset, y: (i / sideCount) * h });
    }

    positions.forEach((pos, idx) => {
      const dot = document.createElement('span');
      dot.className = 'logo-dot';
      dot.style.cssText = [
        `left: ${pos.x}px`,
        `top: ${pos.y}px`,
        `transform: translate(-50%, -50%)`,
        `--dot-delay: ${((idx * 0.07) % 1.6).toFixed(2)}s`,
      ].join(';');
      frame.appendChild(dot);
    });
  });
}

// ── Init ───────────────────────────────────────────────────────

function init() {
  loadConfig();

  // Home decorations
  createStars();
  createMarqueeDots();

  updateHomePlayerDisplay();
  bindEvents();
  showScreen('home');
}

// ── Event binding ──────────────────────────────────────────────

function bindEvents() {
  // Home
  document.getElementById('btn-spin').addEventListener('click', () => doSpin(false));
  document.getElementById('btn-config').addEventListener('click', openConfig);

  // Result
  document.getElementById('btn-sing').addEventListener('click', playKaraoke);
  document.getElementById('btn-change-song').addEventListener('click', () => {
    if (state.changesLeft <= 0) return;
    state.changesLeft--;
    doSpin(true);
  });

  // Player screen V1 (kept)
  document.getElementById('btn-end-round').addEventListener('click', endRound);

  // Player screen V2
  document.getElementById('pv2-btn-end-round').addEventListener('click', endRound);

  document.getElementById('pv2-btn-reload').addEventListener('click', () => {
    if (!state.currentSong) return;
    hidePv2Error();
    _iframeErrorShown = false;
    _logEntry('RETRY', state.currentSong.videoId);
    _postToFrame({ cmd: 'load', videoId: state.currentSong.videoId });
  });

  document.getElementById('pv2-btn-skip').addEventListener('click', () => {
    _iframeErrorShown = false;
    _postToFrame({ cmd: 'stop' });
    document.getElementById('screen-player-v2').classList.add('hidden');
    if (state.changesLeft > 0) {
      state.changesLeft--;
      showScreen('result');
      updateChangesDisplay();
      doSpin(true);
    } else {
      showScreen('result');
      updateChangesDisplay();
    }
  });

  document.getElementById('pv2-btn-show-log').addEventListener('click', () => {
    const pre = document.getElementById('pv2-log-pre');
    if (pre) pre.textContent = _log.join('\n') || '(vacío)';
    document.getElementById('pv2-log-overlay').classList.remove('hidden');
  });
  document.getElementById('pv2-btn-close-log').addEventListener('click', () => {
    document.getElementById('pv2-log-overlay').classList.add('hidden');
  });
  document.getElementById('pv2-btn-copy-log').addEventListener('click', () => {
    navigator.clipboard.writeText(_log.join('\n')).then(() => {
      const btn = document.getElementById('pv2-btn-copy-log');
      btn.textContent = '✓ Copiado';
      setTimeout(() => { btn.textContent = '📋 Copiar'; }, 1500);
    });
  });

  // Log overlay
  document.getElementById('btn-show-log').addEventListener('click', () => {
    const pre = document.getElementById('log-pre');
    if (pre) pre.textContent = _log.join('\n') || '(vacío)';
    document.getElementById('log-overlay').classList.remove('hidden');
  });
  document.getElementById('btn-close-log').addEventListener('click', () => {
    document.getElementById('log-overlay').classList.add('hidden');
  });
  document.getElementById('btn-copy-log').addEventListener('click', () => {
    navigator.clipboard.writeText(_log.join('\n')).then(() => {
      const btn = document.getElementById('btn-copy-log');
      btn.textContent = '✓ Copiado';
      setTimeout(() => { btn.textContent = '📋 Copiar'; }, 1500);
    });
  });

  // YT error: retry same song
  document.getElementById('btn-yt-reload').addEventListener('click', () => {
    if (!state.currentSong || !_ytPlayer || !_ytPlayerReady) return;
    hideYtError();
    _ytErrorShown = false;
    _logEntry('RETRY', state.currentSong.videoId);
    _ytPlayer.loadVideoById({ videoId: state.currentSong.videoId, startSeconds: 0 });
  });

  // YT error: skip to change song
  document.getElementById('btn-yt-skip').addEventListener('click', () => {
    _ytRoundTag++;
    _ytErrorShown = false;
    if (_ytPlayer && _ytPlayerReady) { try { _ytPlayer.stopVideo(); } catch (_) {} }
    if (state.changesLeft > 0) {
      state.changesLeft--;
      showScreen('result');
      updateChangesDisplay();
      doSpin(true);
    } else {
      showScreen('result');
      updateChangesDisplay();
    }
  });

  // Config modal
  document.getElementById('btn-close-config').addEventListener('click', closeConfig);
  document.getElementById('modal-backdrop').addEventListener('click', closeConfig);
  document.getElementById('btn-save-config').addEventListener('click', saveAndCloseConfig);
  document.getElementById('btn-add-player').addEventListener('click', addPlayer);
  document.getElementById('player-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') addPlayer();
  });

  document.querySelectorAll('.intensity-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.intensity        = btn.dataset.value;
      state.usedChallengeIds = []; // reset deck when pool changes
      renderIntensitySelector();
    });
  });

  // Handle window resize: re-init wheels at new size
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(reinitWheels, 250);
  });
}

function reinitWheels() {
  createStars();
}

// ── Boot ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
