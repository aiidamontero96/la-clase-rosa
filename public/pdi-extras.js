'use strict';
(() => {
  const LOGIN_KEY = 'rosa-login-session-v1';
  const LOGIN_USERS = [
    { user: 'rosamve', password: '2121' },
    { user: 'veronicajb', password: '1234' }
  ];
  const root = document.documentElement;

  function loginIsOpen() {
    try { return sessionStorage.getItem(LOGIN_KEY) === 'ok'; } catch { return false; }
  }

  function unlock() {
    root.classList.remove('rosa-login-pending');
    const layer = document.querySelector('.rosa-login-overlay');
    if (layer) {
      layer.classList.add('is-leaving');
      setTimeout(() => layer.remove(), 220);
    }
  }

  function mountLogin() {
    if (loginIsOpen()) { unlock(); window.ROSA_STARTUP?.loginReady(); return; }
    if (document.querySelector('.rosa-login-overlay')) return;
    const layer = document.createElement('section');
    layer.className = 'rosa-login-overlay';
    layer.setAttribute('aria-label', 'Acceso a La Clase Rosa');
    layer.innerHTML = `
      <div class="rosa-login-card">
        <div class="rosa-login-sparkles" aria-hidden="true"><i>✦</i><i>●</i><i>✿</i></div>
        <img class="rosa-login-sticker" src="assets/brand/seno-rosa-sticker.webp" alt="Sticker de la seño Rosa" width="320" height="320">
        <span class="rosa-login-kicker">BIENVENIDA A TU AULA</span>
        <h1>La Clase Rosa</h1>
        <p>Introduce tus datos para abrir tus recursos.</p>
        <form class="rosa-login-form" autocomplete="on">
          <label>Usuario<input id="rosa-login-user" name="username" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" required></label>
          <label>Contraseña<input id="rosa-login-password" name="password" type="password" inputmode="numeric" autocomplete="current-password" required></label>
          <button type="submit">Entrar a La Clase Rosa →</button>
          <p class="rosa-login-error" role="alert" aria-live="polite"></p>
        </form>
      </div>`;
    document.body.prepend(layer);
    window.ROSA_STARTUP?.loginReady();
    const form = layer.querySelector('form');
    const user = layer.querySelector('#rosa-login-user');
    const password = layer.querySelector('#rosa-login-password');
    form.addEventListener('submit', event => {
      event.preventDefault();
      const username = user.value.trim().toLocaleLowerCase('es-ES');
      const ok = LOGIN_USERS.some(account => account.user === username && account.password === password.value);
      if (ok) {
        try { sessionStorage.setItem(LOGIN_KEY, 'ok'); } catch {}
        unlock();
        return;
      }
      layer.querySelector('.rosa-login-error').textContent = 'Usuario o contraseña incorrectos.';
      password.value = '';
      password.focus();
      layer.querySelector('.rosa-login-card').classList.remove('login-shake');
      requestAnimationFrame(() => layer.querySelector('.rosa-login-card').classList.add('login-shake'));
    });
    setTimeout(() => user.focus(), 40);
  }

  const timer = {
    minutes: 10,
    totalMs: 10 * 60 * 1000,
    remainingMs: 10 * 60 * 1000,
    running: false,
    started: false,
    endAt: 0,
    halfWarned: false,
    lastCountdown: null,
    finished: false,
    message: 'ELIGE EL TIEMPO Y PULSA EMPEZAR'
  };
  let ticker = 0;
  let finishResetTimer = 0;
  let recordedAlert = null;
  let audioContext = null;
  let calendarOpened = false;

  const clampMinutes = value => Math.max(.5, Math.min(60, Number(value) || .5));
  const durationLabel = value => value === .5 ? '30 SEG' : value + ' MIN';
  const timerRoute = () => location.hash.slice(1).split('?')[0] === 'pdi-cronometro';
  const calendarRoute = () => location.hash.slice(1).split('?')[0] === 'pdi-calendario';

  function navWithTimer() {
    const html = window.ROSA_AULA?.pdiNav?.('') || '';
    return html;
  }

  function timerPage() {
    const popcorn = Array.from({ length: 42 }, (_, i) => `<i style="--i:${i};--col:${i % 7};--row:${Math.floor(i / 7)};--d:${(i % 7) * -.11}s"></i>`).join('');
    const confetti = Array.from({ length: 240 }, (_, i) => `<i style="--i:${i};--col:${i % 20};--row:${Math.floor(i / 20)};--r:${(i % 9) * 17}deg;--d:${(i % 24) * .075 + Math.floor(i / 24) * .06}s"></i>`).join('');
    return `
      <div id="pdi-timer-page">
        <div class="page-head pdi-timer-page-head">
          <div><span class="eyebrow">PIZARRA DIGITAL</span><h1>Cronómetro</h1><p>Un reloj visual para trabajar, recoger, crear o terminar un reto sin prisas.</p></div>
        </div>
        ${navWithTimer()}
        <section id="pdi-timer-stage" class="panel pdi-timer-stage" aria-label="Cronómetro de La Clase Rosa">
          <div class="pdi-timer-title">
            <div><span class="eyebrow">TIEMPO PARA NUESTRO RETO</span><h2>El reloj de la clase</h2></div>
            <button type="button" class="secondary pdi-timer-fullscreen" data-timer-action="fullscreen">⛶ Pantalla completa</button>
          </div>
          <div class="pdi-timer-layout">
            <div class="pdi-timer-visual">
              <div class="pdi-timer-clock" id="pdi-timer-clock" style="--timer-angle:360deg;--pop-progress:0">
                <div class="pdi-pop-time-panel">
                  <span class="pdi-timer-mini">NOS QUEDA</span>
                  <output id="pdi-timer-time" aria-live="off">10:00</output>
                </div>
                <div class="pdi-pop-machine" aria-hidden="true"><img class="pdi-pop-machine-body" src="assets/pdi-timer/palomitero.png" width="1024" height="1024" alt=""><img class="pdi-pop-machine-lid" src="assets/pdi-timer/palomitero.png" width="1024" height="1024" alt=""><div class="pdi-pop-window">${popcorn}</div><div class="pdi-pop-steam"><i></i><i></i><i></i></div><div class="pdi-pop-mouth-burst">${Array.from({length:18},(_,i)=>`<i style="--i:${i};--a:${-82 + i * 9.6}deg;--d:${(i%6)*.07}s"></i>`).join('')}</div></div>
                <strong id="pdi-timer-status">¡PREPARADOS!</strong>
                <div id="pdi-timer-countdown" class="pdi-timer-countdown" aria-live="assertive" hidden></div>
              </div>
              <div class="pdi-timer-teacher-controls" aria-label="Controles del cronómetro"><button type="button" data-timer-action="start">▶ CONTINUAR</button><button type="button" class="secondary" data-timer-action="pause">Ⅱ PAUSAR</button><button type="button" class="quiet" data-timer-action="reset">⚙ CAMBIAR TIEMPO</button></div>
              <div id="pdi-timer-message" class="pdi-timer-message" role="status" aria-live="polite">ELIGE EL TIEMPO Y PULSA EMPEZAR</div>
              <div class="pdi-timer-confetti" aria-hidden="true">${confetti}</div>
            </div>
            <div class="pdi-timer-controls">
              <section class="pdi-timer-config">
                <span class="eyebrow">1 · ELIGE LOS MINUTOS</span>
                <div class="pdi-timer-stepper">
                  <button type="button" class="secondary" data-timer-action="minus" aria-label="Quitar un minuto">−</button>
                  <output id="pdi-timer-minutes">10 MIN</output>
                  <button type="button" class="secondary" data-timer-action="plus" aria-label="Añadir un minuto">+</button>
                </div>
                <input id="pdi-timer-range" class="pdi-timer-range" type="range" min="0.5" max="60" step="0.5" value="10" aria-label="Duración del cronómetro">
                <div class="pdi-timer-presets" aria-label="Tiempos rápidos">
                  ${[.5, 1, 5, 10, 15, 20, 30, 45, 60].map(m => `<button type="button" class="secondary small" data-timer-minutes="${m}">${durationLabel(m)}</button>`).join('')}
                </div>
              </section>
              <section class="pdi-timer-actions">
                <span class="eyebrow">2 · EMPEZAMOS</span>
                <div>
                  <button type="button" data-timer-action="start">▶ Empezar</button>
                  <button type="button" class="secondary" data-timer-action="pause">Ⅱ Pausar</button>
                  <button type="button" class="quiet" data-timer-action="reset">↻ Reiniciar</button>
                </div>
              </section>
              <div class="pdi-timer-note">
                <span aria-hidden="true">🔔</span>
                <p><strong>El cronómetro avisa solo.</strong> Al llegar a la mitad lo anuncia y los últimos cinco segundos hacen una cuenta atrás.</p>
              </div>
            </div>
          </div>
        </section>
      </div>`;
  }

  function addTimerNavLink() {
    document.querySelectorAll('.pdi-section-nav').forEach(nav => {
      let link = nav.querySelector('a[href="#pdi-cronometro"]');
      if (!link) {
        link = document.createElement('a');
        link.href = '#pdi-cronometro';
        link.innerHTML = '⏱ Cronómetro';
        const songs = nav.querySelector('a[href="#canciones"]');
        nav.insertBefore(link, songs || null);
      }
      const active = timerRoute();
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
      if (active) nav.querySelectorAll('a:not([href="#pdi-cronometro"])').forEach(a => { a.classList.remove('active'); a.removeAttribute('aria-current'); });
    });
  }

  function addCalendarNavLink() {
    document.querySelectorAll('.pdi-section-nav').forEach(nav => {
      let link = nav.querySelector('a[href="#pdi-calendario"]');
      if (!link) {
        link = document.createElement('a');
        link.href = '#pdi-calendario';
        link.innerHTML = '📅 Calendario';
        const timer = nav.querySelector('a[href="#pdi-cronometro"]');
        if (timer) timer.insertAdjacentElement('afterend', link); else nav.appendChild(link);
      }
      const active = calendarRoute();
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    });
  }

  function activateGlobalPdiNav() {
    if (!timerRoute()) return;
    for (const selector of ['#navigation a[href="#pdi"]', '#top-navigation a[href="#pdi"]']) {
      const link = document.querySelector(selector);
      if (link) { link.classList.add('active'); link.setAttribute('aria-current', 'page'); }
    }
  }

  function routeSync() {
    const content = document.querySelector('#contenido');
    if (!content) return;
    if (calendarRoute()) { location.hash = 'pdi'; return; }
    if (timerRoute()) {
      if (!content.querySelector('#pdi-timer-page')) content.innerHTML = timerPage();
      activateGlobalPdiNav();
      addTimerNavLink();
      updateTimerDom();
    } else { calendarOpened = false; addTimerNavLink(); }
  }

  function setMinutes(value) {
    if (timer.running) return;
    if (finishResetTimer) { clearTimeout(finishResetTimer); finishResetTimer = 0; }
    timer.minutes = clampMinutes(value);
    timer.totalMs = timer.minutes * 60 * 1000;
    timer.remainingMs = timer.totalMs;
    timer.halfWarned = false;
    timer.lastCountdown = null;
    timer.finished = false;
    timer.started = false;
    timer.message = 'ELIGE EL TIEMPO Y PULSA EMPEZAR';
    updateTimerDom();
  }

  function ensureAudioContext() {
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume();
    } catch {}
  }

  function chime(kind = 'half') {
    ensureAudioContext();
    if (!audioContext) return;
    const notes = kind === 'finish' ? [523.25, 659.25, 783.99] : [659.25, 783.99];
    const now = audioContext.currentTime;
    notes.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now + i * .16);
      gain.gain.exponentialRampToValueAtTime(.14, now + i * .16 + .02);
      gain.gain.exponentialRampToValueAtTime(.0001, now + i * .16 + .28);
      osc.connect(gain).connect(audioContext.destination);
      osc.start(now + i * .16); osc.stop(now + i * .16 + .3);
    });
  }

  function playRecorded(text) {
    const clips = window.ROSA_VOICE?.resolve?.(text) || [];
    const clip = clips.length === 1 && clips[0]?.url ? clips[0] : null;
    if (!clip || !window.Audio) return false;
    try {
      if (recordedAlert) { recordedAlert.pause(); recordedAlert.removeAttribute('src'); }
      recordedAlert = new Audio(clip.url);
      window.ROSA_VOICE?.configureAudio?.(recordedAlert);
      recordedAlert.volume = 1;
      recordedAlert.play().catch(() => {});
      return true;
    } catch { return false; }
  }

  function browserVoice(text) {
    if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) return;
    try {
      speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'es-ES';
      utter.rate = .93;
      utter.pitch = 1.12;
      const voices = speechSynthesis.getVoices();
      utter.voice = voices.find(v => /^es(-|_)/i.test(v.lang) && /elvira|helena|lucia|maria|sabina|dalia|marina|paulina/i.test(v.name)) || voices.find(v => /^es(-|_)/i.test(v.lang)) || null;
      speechSynthesis.speak(utter);
    } catch {}
  }

  function announce(text, recorded = false) {
    if (recorded && playRecorded(text)) return;
    browserVoice(text);
  }

  function startTimer() {
    ensureAudioContext();
    if (timer.running) return;
    if (timer.remainingMs <= 0 || timer.finished) setMinutes(timer.minutes);
    timer.running = true;
    timer.started = true;
    timer.finished = false;
    timer.endAt = Date.now() + timer.remainingMs;
    timer.message = '¡A TRABAJAR! EL RELOJ YA ESTÁ EN MARCHA';
    if (!ticker) ticker = window.setInterval(tick, 120);
    updateTimerDom();
  }

  function pauseTimer() {
    if (!timer.running) return;
    timer.remainingMs = Math.max(0, timer.endAt - Date.now());
    timer.running = false;
    timer.message = 'PAUSA · EL TIEMPO SE HA QUEDADO QUIETO';
    updateTimerDom();
  }

  function resetTimer() {
    if (finishResetTimer) { clearTimeout(finishResetTimer); finishResetTimer = 0; }
    timer.running = false;
    timer.finished = false;
    timer.started = false;
    timer.remainingMs = timer.totalMs;
    timer.halfWarned = false;
    timer.lastCountdown = null;
    timer.message = 'LISTOS PARA EMPEZAR DE NUEVO';
    try { speechSynthesis?.cancel?.(); } catch {}
    updateTimerDom();
  }

  function finishTimer() {
    timer.running = false;
    timer.remainingMs = 0;
    timer.finished = true;
    timer.message = '¡SE ACABÓ! GUARDAMOS, TERMINAMOS O COMPARTIMOS';
    updateTimerDom();
    chime('finish');
    setTimeout(() => announce('¡Se acabó!'), 720);
    if (finishResetTimer) clearTimeout(finishResetTimer);
    finishResetTimer = window.setTimeout(() => {
      finishResetTimer = 0;
      if (timer.finished) resetTimer();
    }, 8400);
  }

  function tick() {
    if (!timer.running) return;
    timer.remainingMs = Math.max(0, timer.endAt - Date.now());
    if (!timer.halfWarned && timer.remainingMs <= timer.totalMs / 2) {
      timer.halfWarned = true;
      timer.message = '¡QUEDA LA MITAD DEL TIEMPO!';
      chime('half');
      setTimeout(() => announce('Queda la mitad del tiempo.'), 140);
    }
    const seconds = Math.ceil(timer.remainingMs / 1000);
    if (seconds > 0 && seconds <= 5 && seconds !== timer.lastCountdown) {
      timer.lastCountdown = seconds;
      timer.message = '¡ÚLTIMOS SEGUNDOS!';
      announce(String(seconds), true);
    }
    if (timer.remainingMs <= 0) { finishTimer(); return; }
    updateTimerDom();
  }

  function formatTime(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  }

  function updateTimerDom() {
    const stage = document.querySelector('#pdi-timer-stage');
    if (!stage) return;
    const ratio = timer.totalMs ? Math.max(0, Math.min(1, timer.remainingMs / timer.totalMs)) : 0;
    const seconds = Math.ceil(timer.remainingMs / 1000);
    const finalCount = timer.running && seconds > 0 && seconds <= 5 ? seconds : '';
    const clock = stage.querySelector('#pdi-timer-clock');
    clock?.style.setProperty('--timer-angle', (ratio * 360) + 'deg');
    clock?.style.setProperty('--pop-progress', String(1 - ratio));
    clock?.classList.toggle('is-half', timer.halfWarned && ratio > 0 && ratio <= .5);
    clock?.classList.toggle('is-final', timer.running && seconds <= 5);
    clock?.classList.toggle('is-done', timer.finished);
    const visibleKernels = Math.round((1 - ratio) * 42);
    stage.querySelectorAll('.pdi-pop-window>i').forEach((kernel, index) => kernel.classList.toggle('is-popped', index < visibleKernels || timer.finished));
    const time = stage.querySelector('#pdi-timer-time'); if (time) time.textContent = formatTime(timer.remainingMs);
    const status = stage.querySelector('#pdi-timer-status');
    if (status) status.textContent = timer.finished ? '¡TIEMPO!' : timer.running ? (seconds <= 5 ? '¡CUENTA ATRÁS!' : '¡EN MARCHA!') : timer.remainingMs < timer.totalMs ? 'EN PAUSA' : '¡PREPARADOS!';
    const message = stage.querySelector('#pdi-timer-message'); if (message) message.textContent = timer.message;
    const countdown = stage.querySelector('#pdi-timer-countdown');
    if (countdown) { countdown.hidden = !finalCount; countdown.textContent = finalCount; }
    const mins = stage.querySelector('#pdi-timer-minutes'); if (mins) mins.textContent = durationLabel(timer.minutes);
    const range = stage.querySelector('#pdi-timer-range'); if (range) { range.value = String(timer.minutes); range.disabled = timer.running; }
    stage.querySelectorAll('[data-timer-minutes]').forEach(button => { button.classList.toggle('is-selected', Number(button.dataset.timerMinutes) === timer.minutes); button.disabled = timer.running; });
    stage.querySelectorAll('[data-timer-action="minus"],[data-timer-action="plus"]').forEach(button => button.disabled = timer.running);
    const start = stage.querySelector('[data-timer-action="start"]'); if (start) { start.disabled = timer.running; start.innerHTML = timer.remainingMs < timer.totalMs && !timer.finished ? '▶ Continuar' : '▶ Empezar'; }
    const pause = stage.querySelector('[data-timer-action="pause"]'); if (pause) pause.disabled = !timer.running;
    stage.classList.toggle('timer-running', timer.running);
    stage.classList.toggle('timer-started', timer.started);
    stage.classList.toggle('timer-finished', timer.finished);
    const full = document.fullscreenElement === stage;
    const fullButton = stage.querySelector('[data-timer-action="fullscreen"]'); if (fullButton) fullButton.textContent = full ? '⛶ Salir de pantalla completa' : '⛶ Pantalla completa';
  }

  async function toggleTimerFullscreen() {
    const stage = document.querySelector('#pdi-timer-stage');
    if (!stage) return;
    try {
      if (document.fullscreenElement === stage) await document.exitFullscreen();
      else if (stage.requestFullscreen) await stage.requestFullscreen();
      else stage.classList.toggle('timer-expanded');
    } catch { stage.classList.toggle('timer-expanded'); }
    updateTimerDom();
  }

  function fixProjectionExtras() {
    const main = document.querySelector('#projector .projection-main');
    if (!main) return;
    if (main.dataset.game === 'encargado') main.querySelector('.routine-scene-banner')?.remove();

  }

  function install() {
    mountLogin();
    const content = document.querySelector('#contenido');
    if (content) new MutationObserver(() => setTimeout(routeSync, 0)).observe(content, { childList: true });
    const projection = document.querySelector('#projection-content');
    if (projection) new MutationObserver(() => setTimeout(fixProjectionExtras, 0)).observe(projection, { childList: true, subtree: true });
    document.addEventListener('click', event => {
      const preset = event.target.closest('[data-timer-minutes]');
      if (preset) { setMinutes(preset.dataset.timerMinutes); return; }
      const button = event.target.closest('[data-timer-action]');
      if (!button) { setTimeout(fixProjectionExtras, 0); return; }
      const action = button.dataset.timerAction;
      if (action === 'minus') setMinutes(timer.minutes <= 1 ? .5 : timer.minutes - 1);
      else if (action === 'plus') setMinutes(timer.minutes < 1 ? 1 : timer.minutes + 1);
      else if (action === 'start') startTimer();
      else if (action === 'pause') pauseTimer();
      else if (action === 'reset') resetTimer();
      else if (action === 'fullscreen') void toggleTimerFullscreen();
    });
    document.addEventListener('input', event => { if (event.target?.id === 'pdi-timer-range') setMinutes(event.target.value); });
    document.addEventListener('fullscreenchange', updateTimerDom);
    window.addEventListener('hashchange', () => setTimeout(routeSync, 0));
    setTimeout(() => { routeSync(); fixProjectionExtras(); }, 0);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
