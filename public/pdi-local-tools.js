'use strict';

(() => {
  const BOARD_HASH = 'pdi-pizarra';
  const AUTUMN_HASH = 'pdi-otono-vocabulario';
  const FALLBACK_CLASS = 'pdi-mode-fallback';
  const BOARD_LETTERS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  const BOARD_SHAPES = [
    ['circle', 'CÍRCULO', '<circle cx="24" cy="24" r="16"/>'],
    ['square', 'CUADRADO', '<rect x="8" y="8" width="32" height="32" rx="1"/>'],
    ['triangle', 'TRIÁNGULO', '<path d="M24 7 L42 40 H6 Z"/>'],
    ['star', 'ESTRELLA', '<path d="M24 5 L29 18 L43 18 L32 27 L36 41 L24 33 L12 41 L16 27 L5 18 L19 18 Z"/>'],
    ['line', 'LÍNEA', '<path d="M5 24 H43" fill="none"/>'],
    ['plus', 'SUMAR (+)', '<path d="M24 6 V42 M6 24 H42" fill="none"/>'],
    ['equals', 'IGUAL (=)', '<path d="M7 17 H41 M7 31 H41" fill="none"/>']
  ];
  const stampLabel = value => BOARD_SHAPES.find(shape => shape[0] === value)?.[1] || value;
  let boardMounted = false;
  let syncQueued = false;
  let canvasState = null;
  const autumnState = {
    screen: 'intro',
    slide: 0,
    revealed: {}
  };

  const route = () => location.hash.slice(1).split('?')[0];
  const isBoardRoute = () => route() === BOARD_HASH;
  const isAutumnRoute = () => route() === AUTUMN_HASH;
  const content = () => document.querySelector('#contenido');

  function pdiNav() {
    return window.ROSA_AULA?.pdiNav?.('') || '';
  }

  function boardPage() {
    return `
      <div id="pdi-board-page" class="pdi-board-page">
        <div class="page-head pdi-board-head">
          <div>
            <span class="eyebrow">PIZARRA DIGITAL</span>
            <h1>Pizarra libre</h1>
            <p>Dibuja, escribe, coloca números y formas o usa una cuadrícula para explicar en gran grupo.</p>
          </div>
        </div>

        ${pdiNav()}

        <section class="panel pdi-board-shell" aria-label="Pizarra libre">
          <div class="pdi-board-toolbar" role="toolbar" aria-label="Herramientas de la pizarra">
            <div class="pdi-board-toolgroup" aria-label="Herramienta">
              <button type="button" class="pdi-board-tool is-active" data-board-tool="draw" aria-pressed="true">✏️ Lápiz</button>
              <button type="button" class="pdi-board-tool" data-board-tool="eraser" aria-pressed="false">🧽 Goma</button>
            </div>

            <div class="pdi-board-toolgroup pdi-board-colors" aria-label="Color">
              ${[
                ['#242424', 'Negro'],
                ['#c83269', 'Rosa'],
                ['#d42c2c', 'Rojo'],
                ['#f5ca22', 'Amarillo'],
                ['#2368c4', 'Azul'],
                ['#21865b', 'Verde'],
                ['#e27719', 'Naranja'],
                ['#7a4bb7', 'Morado']
              ].map(([value, label], i) => `
                <button type="button"
                  class="pdi-board-color${i === 0 ? ' is-active' : ''}"
                  data-board-color="${value}"
                  aria-label="${label}"
                  aria-pressed="${i === 0 ? 'true' : 'false'}"
                  style="--swatch:${value}"></button>`).join('')}
            </div>

            <label class="pdi-board-size">
              <span>Grosor</span>
              <input type="range" min="3" max="28" value="8" step="1" data-board-size>
            </label>

            <div class="pdi-board-toolgroup">
              <button type="button" class="secondary" data-board-bg="white" aria-pressed="true">▢ Blanco</button>
              <button type="button" class="secondary" data-board-bg="grid" aria-pressed="false"># Cuadrícula</button>
              <button type="button" class="secondary" data-board-bg="guides" aria-pressed="false">☷ Dos líneas</button>
            </div>

            <label class="pdi-board-guides-control" data-board-guides-control hidden>
              Separación
              <select data-board-guide-width aria-label="Separación de las líneas">
                <option value="narrow">Estrecha</option>
                <option value="medium" selected>Media</option>
                <option value="wide">Ancha</option>
              </select>
            </label>

            <button type="button" class="secondary pdi-board-undo" data-board-undo disabled>↶ Deshacer</button>
            <button type="button" class="quiet pdi-board-clear" data-board-clear>🗑 Borrar todo</button>
          </div>

          <div class="pdi-board-stamps" aria-label="Elementos rápidos">
            <span class="pdi-board-stamps-label">PONER:</span>
            <details class="pdi-board-palette">
              <summary>Números 1–10</summary>
              <div class="pdi-board-palette-items pdi-board-palette-numbers" aria-label="Elige un número">
                ${Array.from({length: 10}, (_, i) => String(i + 1)).map(value =>
                  `<button type="button" class="secondary" data-board-stamp="${value}" aria-pressed="false">${value}</button>`
                ).join('')}
              </div>
            </details>
            <details class="pdi-board-palette">
              <summary>Letras A–Z · Ñ</summary>
              <div class="pdi-board-palette-items pdi-board-palette-letters" aria-label="Elige una letra mayúscula">
                ${[...BOARD_LETTERS].map(value =>
                  `<button type="button" class="secondary" data-board-stamp="${value}" aria-pressed="false">${value}</button>`
                ).join('')}
              </div>
            </details>
            <details class="pdi-board-palette">
              <summary>Formas</summary>
              <div class="pdi-board-palette-items pdi-board-palette-shapes" aria-label="Elige una forma">
                ${BOARD_SHAPES.map(([value, label, svg]) =>
                  `<button type="button" class="secondary" data-board-stamp="${value}" aria-label="${label}" aria-pressed="false"><svg viewBox="0 0 48 48" aria-hidden="true">${svg}</svg><span>${label}</span></button>`
                ).join('')}
              </div>
            </details>
            <label class="pdi-board-text-size">
              Tamaño de letras y números
              <select data-board-text-size aria-label="Tamaño de letras y números">
                <option value="small">Pequeño</option>
                <option value="medium" selected>Mediano</option>
                <option value="large">Grande</option>
              </select>
            </label>
            <span class="pdi-board-stamp-status" data-board-stamp-status aria-live="polite"></span>
            <button type="button" class="secondary pdi-board-back-to-pencil" data-board-stamp-cancel hidden>✏️ Volver al lápiz</button>
          </div>

          <div class="pdi-board-stage" data-board-background="white" data-board-guide-width="medium">
            <canvas id="pdi-board-canvas" aria-label="Zona de dibujo de la pizarra"></canvas>
            <canvas id="pdi-board-preview" aria-hidden="true"></canvas>
            <div class="pdi-board-hint" aria-live="polite">DIBUJA CON EL DEDO, EL LÁPIZ DE LA PDI O EL RATÓN</div>
          </div>
        </section>
      </div>`;
  }

  function activateGlobalPdiNav() {
    for (const selector of ['#navigation a[href="#pdi"]', '#top-navigation a[href="#pdi"]']) {
      const link = document.querySelector(selector);
      if (link) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    }
  }


  function autumnSlides() {
    return [
      {
        id: 'ropa-basica',
        title: 'ROPA Y ACCESORIOS DE OTOÑO',
        subtitle: 'TOCA CADA FOTO PARA DESCUBRIR LA PRENDA.',
        layout: 'eight',
        items: [
          { id: 'abrigo', label: 'ABRIGO', query: 'child,autumn,coat', lock: 41 },
          { id: 'chubasquero', label: 'CHUBASQUERO', query: 'child,yellow,raincoat', lock: 42 },
          { id: 'jersey', label: 'JERSEY', query: 'child,autumn,sweater', lock: 43 },
          { id: 'bufanda', label: 'BUFANDA', query: 'child,scarf,autumn', lock: 44 },
          { id: 'gorro', label: 'GORRO', query: 'child,wool,hat', lock: 45 },
          { id: 'botas', label: 'BOTAS', query: 'boots,autumn,child', lock: 46 },
          { id: 'calcetines', label: 'CALCETINES', query: 'wool,socks', lock: 47 },
          { id: 'pantalon-largo', label: 'PANTALÓN LARGO', query: 'child,pants,autumn', lock: 48 }
        ]
      },
      {
        id: 'mas-prendas',
        title: 'MÁS VESTIMENTA DE OTOÑO',
        subtitle: 'SEGUIMOS JUGANDO: PULSA Y LEE EN MAYÚSCULAS.',
        layout: 'five',
        items: [
          { id: 'chaqueta', label: 'CHAQUETA', query: 'child,jacket,autumn', lock: 49 },
          { id: 'paraguas', label: 'PARAGUAS', query: 'child,umbrella,rain', lock: 50 },
          { id: 'botas-agua', label: 'BOTAS DE AGUA', query: 'rain,boots,yellow', lock: 51 },
          { id: 'camiseta-manga-larga', label: 'CAMISETA DE MANGA LARGA', query: 'child,long,sleeve,shirt', lock: 52 },
          { id: 'zapatos', label: 'ZAPATOS', query: 'child,shoes,autumn', lock: 53 }
        ]
      }
    ].map(slide => ({
      ...slide,
      items: slide.items.map(item => ({
        ...item,
        image: `assets/autumn-vocab/${({ 'botas-agua': 'botas-de-agua', 'camiseta-manga-larga': 'camiseta-de-manga-larga' })[item.id] || item.id}.webp`
      }))
    }));
  }

  function autumnCardKey(slideIndex, itemId) {
    return `${slideIndex}:${itemId}`;
  }

  function autumnCardMarkup(item, slideIndex) {
    const key = autumnCardKey(slideIndex, item.id);
    const revealed = !!autumnState.revealed[key];
    return `
      <button type="button"
        class="autumn-card${revealed ? ' is-revealed' : ''}"
        data-autumn-card="${key}"
        aria-pressed="${revealed ? 'true' : 'false'}"
        aria-label="${revealed ? item.label : `Mostrar ${item.label}`}">
        <span class="autumn-card-photo">
          <img src="${item.image}" alt="${item.label}" loading="eager" referrerpolicy="no-referrer">
        </span>
        <span class="autumn-card-label">${revealed ? item.label : 'PULSA'}</span>
      </button>`;
  }

  function autumnPage() {
    const slides = autumnSlides();

    if (autumnState.screen === 'intro') {
      return `
        <div id="pdi-autumn-page" class="autumn-page">
          <div class="page-head autumn-page-head">
            <div>
              <span class="eyebrow">PIZARRA DIGITAL</span>
              <h1>Conocemos el otoño</h1>
              <p>Un recorrido con fotografías reales para descubrir la ropa y los accesorios típicos de esta estación.</p>
            </div>
          </div>

          ${pdiNav()}

          <section class="panel autumn-shell autumn-shell--intro" aria-label="Presentación de otoño">
            <div class="autumn-hero">
              <span class="autumn-hero-kicker">🍂 VOCABULARIO DE OTOÑO</span>
              <h2>OBSERVAMOS · NOMBRAMOS · DESCUBRIMOS</h2>
              <p>Cada foto oculta su palabra. Primero miramos la prenda, hablamos entre todos y después pulsamos para descubrirla en MAYÚSCULAS.</p>
              <ul class="autumn-hero-list">
                <li>4 imágenes arriba y 4 abajo en la primera lámina.</li>
                <li>Segunda lámina con más ropa y accesorios de otoño.</li>
                <li>Sin sonido, lista para usar directamente en la PDI.</li>
              </ul>
              <div class="autumn-actions">
                <button type="button" data-autumn-action="start">EMPEZAR RECORRIDO</button>
              </div>
            </div>
            <div class="autumn-preview">
              <div class="autumn-preview-badge">ROPA DE OTOÑO</div>
              <div class="autumn-preview-grid">
                <span>ABRIGO</span>
                <span>CHUBASQUERO</span>
                <span>JERSEY</span>
                <span>BUFANDA</span>
                <span>GORRO</span>
                <span>BOTAS</span>
                <span>CALCETINES</span>
                <span>PANTALÓN LARGO</span>
              </div>
            </div>
          </section>
        </div>`;
    }

    const slide = slides[autumnState.slide];
    return `
      <div id="pdi-autumn-page" class="autumn-page">
        <div class="page-head autumn-page-head">
          <div>
            <span class="eyebrow">PIZARRA DIGITAL</span>
            <h1>Conocemos el otoño</h1>
            <p>Fotografías reales para trabajar el vocabulario de otoño.</p>
          </div>
        </div>

        ${pdiNav()}

        <section class="panel autumn-shell" aria-label="Vocabulario de otoño">
          <div class="autumn-shell-head">
            <div>
              <span class="eyebrow">🍁 LÁMINA ${autumnState.slide + 1} DE ${slides.length}</span>
              <h2>${slide.title}</h2>
              <p>${slide.subtitle}</p>
            </div>
            <div class="autumn-actions autumn-actions--top">
              <button type="button" class="secondary" data-autumn-action="cover">PORTADA</button>
              <button type="button" class="secondary" data-autumn-action="hide-slide">OCULTAR OTRA VEZ</button>
            </div>
          </div>

          <div class="autumn-grid autumn-grid--${slide.layout}">
            ${slide.items.map(item => autumnCardMarkup(item, autumnState.slide)).join('')}
          </div>

          <div class="autumn-actions autumn-actions--footer">
            <button type="button" class="secondary" data-autumn-action="prev"${autumnState.slide === 0 ? ' disabled' : ''}>← ANTERIOR</button>
            <button type="button" data-autumn-action="${autumnState.slide === slides.length - 1 ? 'restart' : 'next'}">${autumnState.slide === slides.length - 1 ? 'TERMINAR RECORRIDO' : 'SIGUIENTE →'}</button>
          </div>
        </section>
      </div>`;
  }

  function addAutumnNavLink() {
    document.querySelectorAll('.pdi-section-nav').forEach(nav => {
      let link = nav.querySelector('a[href="#pdi-otono-vocabulario"]');
      if (!link) {
        link = document.createElement('a');
        link.href = '#pdi-otono-vocabulario';
        link.innerHTML = '🍂 Otoño';

        const board = nav.querySelector('a[href="#pdi-pizarra"]');
        const calendar = nav.querySelector('a[href="#pdi-calendario"]');
        const timer = nav.querySelector('a[href="#pdi-cronometro"]');
        const songs = nav.querySelector('a[href="#canciones"]');
        const anchor = board || calendar || timer;

        if (anchor) anchor.insertAdjacentElement('afterend', link);
        else nav.insertBefore(link, songs || null);
      }

      const active = isAutumnRoute();
      link.classList.toggle('active', active);
      if (active) {
        link.setAttribute('aria-current', 'page');
        nav.querySelectorAll('a').forEach(other => {
          if (other !== link) {
            other.classList.remove('active');
            other.removeAttribute('aria-current');
          }
        });
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function handleAutumnAction(action) {
    const slides = autumnSlides();

    if (action === 'start') {
      autumnState.screen = 'slides';
      autumnState.slide = 0;
    } else if (action === 'cover') {
      autumnState.screen = 'intro';
    } else if (action === 'prev') {
      autumnState.screen = 'slides';
      autumnState.slide = Math.max(0, autumnState.slide - 1);
    } else if (action === 'next') {
      autumnState.screen = 'slides';
      autumnState.slide = Math.min(slides.length - 1, autumnState.slide + 1);
    } else if (action === 'restart') {
      autumnState.screen = 'intro';
      autumnState.slide = 0;
      autumnState.revealed = {};
    } else if (action === 'hide-slide') {
      const slide = slides[autumnState.slide];
      slide.items.forEach(item => { delete autumnState.revealed[autumnCardKey(autumnState.slide, item.id)]; });
    }
  }

  function addBoardNavLink() {
    document.querySelectorAll('.pdi-section-nav').forEach(nav => {
      let link = nav.querySelector('a[href="#pdi-pizarra"]');
      if (!link) {
        link = document.createElement('a');
        link.href = '#pdi-pizarra';
        link.innerHTML = '✏️ Pizarra libre';

        const calendar = nav.querySelector('a[href="#pdi-calendario"]');
        const timer = nav.querySelector('a[href="#pdi-cronometro"]');
        const songs = nav.querySelector('a[href="#canciones"]');
        const anchor = calendar || timer;

        if (anchor) anchor.insertAdjacentElement('afterend', link);
        else nav.insertBefore(link, songs || null);
      }

      const active = isBoardRoute();
      link.classList.toggle('active', active);
      if (active) {
        link.setAttribute('aria-current', 'page');
        nav.querySelectorAll('a').forEach(other => {
          if (other !== link) {
            other.classList.remove('active');
            other.removeAttribute('aria-current');
          }
        });
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function resizeCanvas(canvas, ctx) {
    const stage = canvas.closest('.pdi-board-stage');
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const nextW = Math.max(1, Math.round(rect.width * dpr));
    const nextH = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width === nextW && canvas.height === nextH) return;

    const old = document.createElement('canvas');
    old.width = canvas.width;
    old.height = canvas.height;
    if (old.width && old.height) old.getContext('2d').drawImage(canvas, 0, 0);

    canvas.width = nextW;
    canvas.height = nextH;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (old.width && old.height) {
      ctx.drawImage(old, 0, 0, old.width, old.height, 0, 0, nextW, nextH);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function mountBoard() {
    const canvas = document.querySelector('#pdi-board-canvas');
    if (!canvas || canvas.dataset.ready === '1') return;
    canvas.dataset.ready = '1';

    const ctx = canvas.getContext('2d', { alpha: true });
    const preview = document.querySelector('#pdi-board-preview');
    const previewCtx = preview.getContext('2d');
    const state = {
      tool: 'draw',
      color: '#242424',
      size: 8,
      drawing: false,
      pointerId: null,
      lastX: 0,
      lastY: 0,
      stamp: '',
      stampPointerId: null,
      textSize: 'medium',
      undo: null,
      ctx,
      canvas
    };
    canvasState = state;

    const hint = document.querySelector('.pdi-board-hint');

    const point = event => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    };

    const configureBrush = () => {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = state.tool === 'eraser' ? Math.max(18, state.size * 2.6) : state.size;
      ctx.strokeStyle = state.color;
      ctx.fillStyle = state.color;
      ctx.globalCompositeOperation = state.tool === 'eraser' ? 'destination-out' : 'source-over';
    };

    const rememberBoard = () => {
      const snapshot = document.createElement('canvas');
      snapshot.width = canvas.width;
      snapshot.height = canvas.height;
      snapshot.getContext('2d').drawImage(canvas, 0, 0);
      state.undo = snapshot;
      const button = document.querySelector('[data-board-undo]');
      if (button) button.disabled = false;
    };
    state.rememberBoard = rememberBoard;

    const drawStamp = (target, x, y) => {
      target.save();
      target.globalCompositeOperation = 'source-over';
      target.fillStyle = state.color;
      const shape = state.stamp;
      if (BOARD_SHAPES.some(item => item[0] === shape)) {
        target.beginPath();
        if (shape === 'circle') target.arc(x, y, 36, 0, Math.PI * 2);
        if (shape === 'square') target.rect(x - 36, y - 36, 72, 72);
        if (shape === 'triangle') {
          target.moveTo(x, y - 39);
          target.lineTo(x + 41, y + 34);
          target.lineTo(x - 41, y + 34);
          target.closePath();
        }
        if (shape === 'star') {
          for (let i = 0; i < 10; i++) {
            const angle = -Math.PI / 2 + i * Math.PI / 5;
            const radius = i % 2 ? 18 : 42;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            if (i === 0) target.moveTo(px, py);
            else target.lineTo(px, py);
          }
          target.closePath();
        }
        if (shape === 'line') {
          target.moveTo(x - 45, y);
          target.lineTo(x + 45, y);
        }
        if (shape === 'plus') {
          target.moveTo(x - 34, y);
          target.lineTo(x + 34, y);
          target.moveTo(x, y - 34);
          target.lineTo(x, y + 34);
        }
        if (shape === 'equals') {
          target.moveTo(x - 34, y - 13);
          target.lineTo(x + 34, y - 13);
          target.moveTo(x - 34, y + 13);
          target.lineTo(x + 34, y + 13);
        }
        target.lineWidth = 5;
        target.strokeStyle = state.color === '#f5ca22' ? '#9a6a00' : state.color;
        if (!['line', 'plus', 'equals'].includes(shape)) target.fill();
        target.stroke();
      } else {
        target.textAlign = 'center';
        target.textBaseline = 'middle';
        target.font = `900 ${{ small: 46, medium: 64, large: 82 }[state.textSize]}px Nunito, Arial, sans-serif`;
        target.fillText(shape, x, y);
      }
      target.restore();
    };

    const hidePreview = () => {
      previewCtx.save();
      previewCtx.setTransform(1, 0, 0, 1, 0, 0);
      previewCtx.clearRect(0, 0, preview.width, preview.height);
      previewCtx.restore();
    };
    state.hidePreview = hidePreview;

    const showPreview = (x, y) => {
      hidePreview();
      if (!state.stamp) return;
      previewCtx.save();
      previewCtx.globalAlpha = .5;
      drawStamp(previewCtx, x, y);
      previewCtx.restore();
    };

    const placeStamp = (x, y) => {
      drawStamp(ctx, x, y);
      hidePreview();
      if (hint) hint.textContent = `COLOCADO ${stampLabel(state.stamp)} · TOCA OTRA ZONA O VUELVE A DIBUJAR`;
    };

    canvas.addEventListener('pointerdown', event => {
      if (event.button !== undefined && event.button !== 0) return;
      event.preventDefault();
      canvas.setPointerCapture?.(event.pointerId);

      const p = point(event);
      if (state.stamp) {
        if (event.pointerType === 'touch' || event.pointerType === 'pen') {
          state.stampPointerId = event.pointerId;
          showPreview(p.x, p.y);
        } else {
          rememberBoard();
          placeStamp(p.x, p.y);
        }
        return;
      }

      rememberBoard();
      state.drawing = true;
      state.pointerId = event.pointerId;
      state.lastX = p.x;
      state.lastY = p.y;
      configureBrush();

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + 0.01, p.y + 0.01);
      ctx.stroke();
    });

    canvas.addEventListener('pointermove', event => {
      if (state.stamp) {
        if (state.stampPointerId === null && event.pointerType !== 'mouse') return;
        if (state.stampPointerId !== null && event.pointerId !== state.stampPointerId) return;
        showPreview(point(event).x, point(event).y);
        return;
      }
      if (!state.drawing || event.pointerId !== state.pointerId) return;
      event.preventDefault();

      const p = point(event);
      configureBrush();
      ctx.beginPath();
      ctx.moveTo(state.lastX, state.lastY);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      state.lastX = p.x;
      state.lastY = p.y;
    });

    const stop = event => {
      if (state.stampPointerId === event.pointerId) {
        if (event.type === 'pointerup' && state.stamp) {
          const p = point(event);
          rememberBoard();
          placeStamp(p.x, p.y);
        }
        state.stampPointerId = null;
        hidePreview();
        return;
      }
      if (state.pointerId !== null && event.pointerId !== state.pointerId) return;
      state.drawing = false;
      state.pointerId = null;
    };
    canvas.addEventListener('pointerup', stop);
    canvas.addEventListener('pointercancel', stop);

    canvas.addEventListener('pointerleave', () => {
      if (state.stampPointerId === null) hidePreview();
    });

    const resizeBoard = () => {
      resizeCanvas(canvas, ctx);
      preview.width = canvas.width;
      preview.height = canvas.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      previewCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    state.resizeBoard = resizeBoard;
    const observer = new ResizeObserver(resizeBoard);
    observer.observe(canvas.closest('.pdi-board-stage'));
    requestAnimationFrame(resizeBoard);
    boardMounted = true;
  }

  function setBoardTool(tool) {
    if (!canvasState) return;
    canvasState.tool = tool;
    canvasState.stamp = '';
    canvasState.stampPointerId = null;
    canvasState.hidePreview();

    document.querySelectorAll('[data-board-tool]').forEach(button => {
      const active = button.dataset.boardTool === tool;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-board-stamp]').forEach(button => {
      button.classList.remove('is-active');
      button.setAttribute('aria-pressed', 'false');
    });

    const cancel = document.querySelector('[data-board-stamp-cancel]');
    if (cancel) cancel.hidden = true;
    const status = document.querySelector('[data-board-stamp-status]');
    if (status) status.textContent = tool === 'eraser'
      ? 'Goma activa · borra en la pizarra'
      : 'Lápiz activo · dibuja en la pizarra';

    const hint = document.querySelector('.pdi-board-hint');
    if (hint) hint.textContent = tool === 'eraser'
      ? 'GOMA ACTIVADA · PASA EL DEDO SOBRE LO QUE QUIERAS BORRAR'
      : 'DIBUJA CON EL DEDO, EL LÁPIZ DE LA PDI O EL RATÓN';
  }

  function selectStamp(value) {
    if (!canvasState) return;
    canvasState.stamp = value;
    canvasState.tool = 'draw';
    canvasState.stampPointerId = null;
    canvasState.hidePreview();

    document.querySelectorAll('[data-board-tool]').forEach(button => {
      button.classList.remove('is-active');
      button.setAttribute('aria-pressed', 'false');
    });
    document.querySelectorAll('[data-board-stamp]').forEach(button => {
      const active = button.dataset.boardStamp === value;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    const cancel = document.querySelector('[data-board-stamp-cancel]');
    if (cancel) cancel.hidden = false;
    document.querySelectorAll('.pdi-board-palette[open]').forEach(palette => { palette.open = false; });
    const status = document.querySelector('[data-board-stamp-status]');
    if (status) status.textContent = `Elegido: ${stampLabel(value)}`;

    const hint = document.querySelector('.pdi-board-hint');
    if (hint) hint.textContent = `TOCA LA PIZARRA PARA COLOCAR ${stampLabel(value)}`;
  }

  function clearBoard() {
    if (!canvasState) return;
    const { canvas, ctx } = canvasState;
    canvasState.rememberBoard();
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    const hint = document.querySelector('.pdi-board-hint');
    if (hint) hint.textContent = 'PIZARRA LIMPIA · LISTA PARA EMPEZAR';
  }

  function undoBoard() {
    if (!canvasState?.undo) return;
    const { canvas, ctx, undo } = canvasState;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(undo, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    canvasState.undo = null;
    const button = document.querySelector('[data-board-undo]');
    if (button) button.disabled = true;
    const hint = document.querySelector('.pdi-board-hint');
    if (hint) hint.textContent = 'ÚLTIMA ACCIÓN DESHECHA';
  }

  function pdiContextAvailable() {
    return isBoardRoute() || !!document.querySelector('#contenido .pdi-section-nav');
  }

  function fallbackTarget() {
    return document.querySelector('.pdi-mode-target');
  }

  function leaveFallback() {
    document.documentElement.classList.remove(FALLBACK_CLASS);
    document.body.classList.remove(FALLBACK_CLASS);
    document.querySelectorAll('.pdi-mode-target').forEach(el => el.classList.remove('pdi-mode-target'));
    syncFullscreenButtons();
  }

  async function toggleFullscreen(target) {
    if (!target) return;

    if (document.fullscreenElement || document.webkitFullscreenElement) {
      try {
        if (document.exitFullscreen) await document.exitFullscreen();
        else document.webkitExitFullscreen?.();
      } catch {}
      return;
    }

    if (fallbackTarget()) {
      leaveFallback();
      return;
    }

    const request = target.requestFullscreen || target.webkitRequestFullscreen;
    if (request) {
      try {
        await request.call(target);
        return;
      } catch {}
    }

    target.classList.add('pdi-mode-target');
    document.documentElement.classList.add(FALLBACK_CLASS);
    document.body.classList.add(FALLBACK_CLASS);
    syncFullscreenButtons();
  }

  function isFullscreenFor(target) {
    return document.fullscreenElement === target ||
      document.webkitFullscreenElement === target ||
      (target?.classList.contains('pdi-mode-target') && document.documentElement.classList.contains(FALLBACK_CLASS));
  }

  function normalizeUiText(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function markInternalFullscreenControls(root = document) {
    let buttons = [];
    try {
      buttons = [...root.querySelectorAll('button, [role="button"]')];
    } catch {
      return;
    }

    buttons.forEach(button => {
      if (button.matches?.('[data-pdi-mode-toggle]')) return;
      const text = normalizeUiText(button.textContent || button.getAttribute?.('aria-label'));
      const explicit =
        button.matches?.('.pdi-timer-fullscreen, [data-timer-action="fullscreen"], [data-action="fullscreen"], [data-action="toggle-fullscreen"], [data-fullscreen]');
      const byText = text === 'pantalla completa' || text === '⛶ pantalla completa' || text === 'fullscreen';

      if (explicit || byText) button.classList.add('pdi-internal-fullscreen');
    });

    try {
      root.querySelectorAll('iframe').forEach(frame => {
        const scanFrame = () => {
          try {
            if (frame.contentDocument) markInternalFullscreenControls(frame.contentDocument);
          } catch {}
        };
        scanFrame();
        if (frame.dataset.pdiFullscreenWatch !== '1') {
          frame.dataset.pdiFullscreenWatch = '1';
          frame.addEventListener('load', scanFrame);
        }
      });
    } catch {}
  }

  function syncPdiModeState() {
    const active = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      fallbackTarget()
    );

    document.documentElement.classList.toggle('pdi-mode-active', active);
    document.body.classList.toggle('pdi-mode-active', active);

    markInternalFullscreenControls(document);

    try {
      document.querySelectorAll('iframe').forEach(frame => {
        try {
          if (frame.contentDocument) {
            frame.contentDocument.documentElement.classList.toggle('pdi-mode-active', active);
            frame.contentDocument.body?.classList.toggle('pdi-mode-active', active);
            markInternalFullscreenControls(frame.contentDocument);
          }
        } catch {}
      });
    } catch {}

    return active;
  }

  function syncFullscreenButtons() {
    syncPdiModeState();

    document.querySelectorAll('[data-pdi-mode-toggle]').forEach(button => {
      const selector = button.dataset.pdiModeTarget;
      const target = selector ? document.querySelector(selector) : content();
      const active = isFullscreenFor(target);
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
      button.innerHTML = active ? '← SALIR DEL MODO PDI' : '⛶ MODO PDI';
      button.setAttribute('aria-label', active ? 'Salir del modo PDI' : 'Abrir modo PDI a pantalla completa');
    });
  }

  function mountPagePdiButton() {
    const main = content();
    if (!main || !pdiContextAvailable()) {
      document.querySelector('.pdi-mode-floating')?.remove();
      return;
    }

    let button = main.querySelector(':scope > .pdi-mode-floating');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'pdi-mode-floating';
      button.dataset.pdiModeToggle = '1';
      button.dataset.pdiModeTarget = '#contenido';
      button.innerHTML = '⛶ MODO PDI';
      button.setAttribute('aria-pressed', 'false');
      main.appendChild(button);
    }
    syncFullscreenButtons();
  }

  function mountProjectorPdiButton() {
    const projector = document.querySelector('#projector');
    if (!projector || !projector.open) return;

    const toolbar = projector.querySelector('.projection-toolbar');
    if (!toolbar || toolbar.querySelector('[data-pdi-mode-toggle]')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary pdi-projector-mode';
    button.dataset.pdiModeToggle = '1';
    button.dataset.pdiModeTarget = '#projector';
    button.innerHTML = '⛶ MODO PDI';

    const close = toolbar.querySelector('[data-action="close-projection"], [data-aula-action="close"], button:last-child');
    if (close) toolbar.insertBefore(button, close);
    else toolbar.appendChild(button);

    syncFullscreenButtons();
  }

  function syncRoute() {
    syncQueued = false;
    const main = content();
    if (!main) return;

    if (isBoardRoute()) {
      if (!main.querySelector('#pdi-board-page')) {
        main.innerHTML = boardPage();
        boardMounted = false;
        canvasState = null;
      }
      activateGlobalPdiNav();
      addBoardNavLink();
      addAutumnNavLink();
      mountBoard();
    } else if (isAutumnRoute()) {
      if (!main.querySelector('#pdi-autumn-page')) {
        main.innerHTML = autumnPage();
      }
      activateGlobalPdiNav();
      addBoardNavLink();
      addAutumnNavLink();
    } else {
      addBoardNavLink();
      addAutumnNavLink();
    }

    mountPagePdiButton();
    mountProjectorPdiButton();
    syncPdiModeState();
  }

  function queueSync() {
    if (syncQueued) return;
    syncQueued = true;
    requestAnimationFrame(syncRoute);
  }

  document.addEventListener('click', event => {
    const summary = event.target.closest('.pdi-board-palette > summary');
    if (summary) {
      document.querySelectorAll('.pdi-board-palette[open]').forEach(palette => {
        if (palette !== summary.parentElement) palette.open = false;
      });
      return;
    }

    const tool = event.target.closest('[data-board-tool]');
    if (tool) {
      setBoardTool(tool.dataset.boardTool);
      return;
    }

    const color = event.target.closest('[data-board-color]');
    if (color && canvasState) {
      canvasState.color = color.dataset.boardColor;
      document.querySelectorAll('[data-board-color]').forEach(button => {
        const active = button === color;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      if (!canvasState.stamp) setBoardTool('draw');
      return;
    }

    const bg = event.target.closest('[data-board-bg]');
    if (bg) {
      const stage = document.querySelector('.pdi-board-stage');
      if (stage) stage.dataset.boardBackground = bg.dataset.boardBg;
      const guidesControl = document.querySelector('[data-board-guides-control]');
      if (guidesControl) guidesControl.hidden = bg.dataset.boardBg !== 'guides';
      if (bg.dataset.boardBg === 'guides' && canvasState) {
        const guide = document.querySelector('[data-board-guide-width]');
        const textSize = document.querySelector('[data-board-text-size]');
        const choice = { narrow: 'small', medium: 'medium', wide: 'large' }[guide?.value] || 'medium';
        canvasState.textSize = choice;
        if (textSize) textSize.value = choice;
      }
      document.querySelectorAll('[data-board-bg]').forEach(button => {
        button.setAttribute('aria-pressed', String(button === bg));
      });
      return;
    }

    const stamp = event.target.closest('[data-board-stamp]');
    if (stamp) {
      selectStamp(stamp.dataset.boardStamp);
      return;
    }

    if (event.target.closest('[data-board-stamp-cancel]')) {
      setBoardTool('draw');
      return;
    }

    if (event.target.closest('[data-board-clear]')) {
      clearBoard();
      return;
    }

    if (event.target.closest('[data-board-undo]')) {
      undoBoard();
      return;
    }

    const autumnAction = event.target.closest('[data-autumn-action]');
    if (autumnAction) {
      handleAutumnAction(autumnAction.dataset.autumnAction);
      if (isAutumnRoute()) {
        const main = content();
        if (main) main.innerHTML = autumnPage();
        activateGlobalPdiNav();
        addBoardNavLink();
        addAutumnNavLink();
        mountPagePdiButton();
        syncPdiModeState();
      }
      return;
    }

    const autumnCard = event.target.closest('[data-autumn-card]');
    if (autumnCard && isAutumnRoute()) {
      const key = autumnCard.dataset.autumnCard;
      autumnState.revealed[key] = !autumnState.revealed[key];
      const main = content();
      if (main) main.innerHTML = autumnPage();
      activateGlobalPdiNav();
      addBoardNavLink();
      addAutumnNavLink();
      mountPagePdiButton();
      syncPdiModeState();
      return;
    }

    const mode = event.target.closest('[data-pdi-mode-toggle]');
    if (mode) {
      const target = document.querySelector(mode.dataset.pdiModeTarget);
      toggleFullscreen(target);
    }
  });

  document.addEventListener('input', event => {
    if (event.target.matches('[data-board-size]') && canvasState) {
      canvasState.size = Number(event.target.value) || 8;
    }
    if (event.target.matches('[data-board-guide-width]')) {
      const stage = document.querySelector('.pdi-board-stage');
      if (stage) stage.dataset.boardGuideWidth = event.target.value;
      const choice = { narrow: 'small', medium: 'medium', wide: 'large' }[event.target.value] || 'medium';
      if (canvasState) canvasState.textSize = choice;
      const textSize = document.querySelector('[data-board-text-size]');
      if (textSize) textSize.value = choice;
    }
    if (event.target.matches('[data-board-text-size]') && canvasState) {
      canvasState.textSize = event.target.value;
    }
  });

  document.addEventListener('fullscreenchange', syncFullscreenButtons);
  document.addEventListener('webkitfullscreenchange', syncFullscreenButtons);
  window.addEventListener('hashchange', () => setTimeout(queueSync, 0));
  window.addEventListener('resize', () => {
    canvasState?.resizeBoard();
  });

  const start = () => {
    const main = content();
    if (main) {
      new MutationObserver(queueSync).observe(main, { childList: true, subtree: true });
    }
    const projector = document.querySelector('#projector');
    if (projector) {
      new MutationObserver(queueSync).observe(projector, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['open']
      });
    }
    queueSync();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
