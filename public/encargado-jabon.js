'use strict';
(() => {
  const ROLE = { id: 'jabon', icon: '🧼', label: 'Jabón' };
  const selected = { assembly: '', projection: '' };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function students() {
    return Array.isArray(window.ROSA?.students) ? window.ROSA.students : [];
  }

  function dutySpeech() {
    return 'Del jabón se encargará.';
  }

  function patchDutySpeech() {
    const scenes = window.ROSA_SCENES;
    if (!scenes || scenes.__rosaJabonPatched) return;
    const original = typeof scenes.dutySpeech === 'function' ? scenes.dutySpeech.bind(scenes) : null;
    scenes.dutySpeech = (role, name) => role === ROLE.id ? dutySpeech(name) : original?.(role, name);
    scenes.__rosaJabonPatched = true;
  }

  function roleCard(mode) {
    const value = selected[mode] || '';
    const selectAttr = mode === 'assembly' ? 'data-assembly-duty-role' : 'data-duty-role';
    const action = mode === 'assembly' ? 'assembly-duty-random' : 'duty-random';
    const options = students().map(name =>
      `<option value="${esc(name)}"${value === name ? ' selected' : ''}>${esc(name)}</option>`
    ).join('');

    const card = document.createElement('section');
    card.className = 'duty-card duty-card-jabon';
    card.dataset.jabonMode = mode;
    card.innerHTML = `
      <span aria-hidden="true">${ROLE.icon}</span>
      <h3>${ROLE.label}</h3>
      <label>
        <span class="sr-only">Encargado de ${ROLE.label}</span>
        <select ${selectAttr}="${ROLE.id}">
          <option value="">Elegir nombre</option>${options}
        </select>
      </label>
      <button type="button" class="secondary" data-action="${action}" data-value="${ROLE.id}">Elegir al azar</button>
      ${value ? `<strong class="duty-result">${esc(value)}</strong>` : ''}`;
    return card;
  }

  function ensureGrid(grid, mode) {
    if (!grid || grid.querySelector('.duty-card-jabon')) return;
    grid.appendChild(roleCard(mode));
  }

  function mount() {
    patchDutySpeech();
    document.querySelectorAll('.assembly-duties .duty-grid').forEach(grid => ensureGrid(grid, 'assembly'));
    document.querySelectorAll('#projector .projection-main[data-game="encargado"] .duty-grid').forEach(grid => ensureGrid(grid, 'projection'));
  }

  function updateCard(mode, value) {
    selected[mode] = value || '';
    const selector = mode === 'assembly'
      ? '.assembly-duties .duty-card-jabon'
      : '#projector .projection-main[data-game="encargado"] .duty-card-jabon';
    const card = document.querySelector(selector);
    if (!card) return;
    const select = card.querySelector('select');
    if (select) select.value = selected[mode];
    let result = card.querySelector('.duty-result');
    if (selected[mode]) {
      if (!result) {
        result = document.createElement('strong');
        result.className = 'duty-result';
        card.appendChild(result);
      }
      result.textContent = selected[mode];
    } else {
      result?.remove();
    }
  }

  function announce(mode) {
    const aula = window.ROSA_AULA;
    const text = dutySpeech();
    if (mode === 'assembly') aula?.announce?.(text);
    else aula?.feedbackVoice?.(text);
  }

  function randomName(mode) {
    const names = students();
    if (!names.length) return '';
    const current = selected[mode];
    const pool = names.filter(name => name !== current);
    return pool[Math.floor(Math.random() * pool.length)] || names[0];
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-action][data-value="jabon"]');
    if (!button) return;
    const action = button.dataset.action;
    if (action !== 'assembly-duty-random' && action !== 'duty-random') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const mode = action === 'assembly-duty-random' ? 'assembly' : 'projection';
    const name = randomName(mode);
    if (!name) return;
    updateCard(mode, name);
    announce(mode);
  }, true);

  document.addEventListener('change', event => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;
    const isAssembly = target.dataset.assemblyDutyRole === ROLE.id;
    const isProjection = target.dataset.dutyRole === ROLE.id;
    if (!isAssembly && !isProjection) return;
    event.stopImmediatePropagation();
    const mode = isAssembly ? 'assembly' : 'projection';
    updateCard(mode, target.value);
    if (target.value) announce(mode);
  }, true);

  const observer = new MutationObserver(mount);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
