'use strict';
(() => {
  const ROLE = { id: 'jabon', icon: '🧼', label: 'Jabón' };
  const selected = { assembly: '', projection: '' };
  const absent = new Set();

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function students() {
    return Array.isArray(window.ROSA?.students) ? window.ROSA.students : [];
  }

  function presentStudents() {
    return students().filter(name => !absent.has(name));
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

  function optionsMarkup(value = '') {
    return '<option value="">Elegir nombre</option>' + presentStudents().map(name =>
      `<option value="${esc(name)}"${value === name ? ' selected' : ''}>${esc(name)}</option>`
    ).join('');
  }

  function roleCard(mode) {
    const value = selected[mode] || '';
    const selectAttr = mode === 'assembly' ? 'data-assembly-duty-role' : 'data-duty-role';
    const action = mode === 'assembly' ? 'assembly-duty-random' : 'duty-random';
    const card = document.createElement('section');
    card.className = 'duty-card duty-card-jabon';
    card.dataset.jabonMode = mode;
    card.innerHTML = `
      <span aria-hidden="true">${ROLE.icon}</span>
      <h3>${ROLE.label}</h3>
      <label>
        <span class="sr-only">Encargado de ${ROLE.label}</span>
        <select ${selectAttr}="${ROLE.id}">${optionsMarkup(value)}</select>
      </label>
      <button type="button" class="secondary" data-action="${action}" data-value="${ROLE.id}">Elegir al azar</button>
      ${value ? `<strong class="duty-result">${esc(value)}</strong>` : ''}`;
    return card;
  }

  function ensureGrid(grid, mode) {
    if (!grid || grid.querySelector('.duty-card-jabon')) return;
    grid.appendChild(roleCard(mode));
  }

  function updateCard(mode, value) {
    selected[mode] = value || '';
    const selector = mode === 'assembly'
      ? '.assembly-duties .duty-card-jabon'
      : '#projector .projection-main[data-game="encargado"] .duty-card-jabon';
    const card = document.querySelector(selector);
    if (!card) return;
    const select = card.querySelector('select');
    if (select) select.innerHTML = optionsMarkup(selected[mode]);
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

  function clearAbsentAssignments(name) {
    for (const mode of ['assembly', 'projection']) {
      if (selected[mode] === name) updateCard(mode, '');
    }
  }

  function refreshDutySelect(select) {
    const role = select.dataset.assemblyDutyRole || select.dataset.dutyRole;
    if (!role) return;
    const current = absent.has(select.value) ? '' : select.value;

    if (role === ROLE.id) {
      select.innerHTML = optionsMarkup(current);
      return;
    }

    select.innerHTML = optionsMarkup(current);
    if (!current) select.value = '';
  }

  function refreshAllDutySelects() {
    document.querySelectorAll('[data-assembly-duty-role], [data-duty-role]').forEach(refreshDutySelect);
  }

  function mount() {
    patchDutySpeech();
    document.querySelectorAll('.assembly-duties .duty-grid').forEach(grid => ensureGrid(grid, 'assembly'));
    document.querySelectorAll('#projector .projection-main[data-game="encargado"] .duty-grid').forEach(grid => ensureGrid(grid, 'projection'));
    refreshAllDutySelects();
  }

  function choosePresent(select) {
    const names = presentStudents();
    if (!names.length) return '';
    const current = select?.value || '';
    const pool = names.filter(name => name !== current);
    return pool[Math.floor(Math.random() * pool.length)] || names[0];
  }

  document.addEventListener('click', event => {
    const attendanceStart = event.target.closest('[data-action="routine"][data-value="asistencia"]');
    if (attendanceStart) absent.clear();

    const attendance = event.target.closest('[data-action="attendance-toggle"]');
    if (attendance) {
      const name = attendance.dataset.value;
      if (name) {
        if (attendance.classList.contains('absent')) absent.delete(name);
        else {
          absent.add(name);
          clearAbsentAssignments(name);
        }
      }
      return;
    }

    const button = event.target.closest('[data-action="assembly-duty-random"], [data-action="duty-random"]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();

    const card = button.closest('.duty-card');
    const select = card?.querySelector('select');
    if (!select) return;
    const name = choosePresent(select);
    if (!name) return;
    select.value = name;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }, true);

  document.addEventListener('change', event => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;
    const isAssemblyJabon = target.dataset.assemblyDutyRole === ROLE.id;
    const isProjectionJabon = target.dataset.dutyRole === ROLE.id;
    if (!isAssemblyJabon && !isProjectionJabon) return;

    event.stopImmediatePropagation();
    const mode = isAssemblyJabon ? 'assembly' : 'projection';
    const value = absent.has(target.value) ? '' : target.value;
    updateCard(mode, value);
    if (value) announce(mode);
  }, true);

  const observer = new MutationObserver(mount);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
