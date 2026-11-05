'use strict';
window.ROSA_PATITOS_ASISTENCIA=(()=>{
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const heroes=[
    ['#b83f54','#f28c78','#ffda75','★'],['#5a4793','#e294bf','#ffe49a','♥'],
    ['#376c9a','#86cce5','#ffe17b','ϟ'],['#447958','#a4cf93','#ffe192','✿'],
    ['#a24a29','#edaa61','#ffe890','☀'],['#8d3b72','#df9bc9','#ffdc77','✦'],
    ['#286e75','#6fcac0','#ffdb83','◆'],['#4b55a4','#a6b1ed','#ffe78f','☾'],
    ['#a84458','#ef9b9f','#fff0a3','♪'],['#67512c','#d2a962','#ffe286','✚'],
    ['#575389','#b2a0df','#ffe897','❋'],['#387b9f','#a6d6f0','#ffcf6c','❄']
  ];
  function artwork(index){
    const [cape,mask,feathers,badge]=heroes[index%heroes.length];
    const plume=index%3===0?'M58 34 Q46 24 47 15 Q56 15 62 25 Q63 13 71 13 Q75 22 69 32':
      index%3===1?'M58 33 Q50 20 57 15 Q64 15 65 25 Q71 19 77 22 Q76 29 70 34':
      'M56 35 Q53 20 63 18 Q70 21 66 29 Q72 22 79 26 Q77 33 69 35';
    return `<svg class="hatch-art" viewBox="0 0 132 127" aria-hidden="true" focusable="false">
      <ellipse cx="66" cy="115" rx="38" ry="7" fill="#664976" opacity=".13"/>
      <g class="hatch-hero" stroke="#743f3e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M48 66 Q33 77 11 75 Q19 88 11 102 Q31 108 52 92 L87 92 Q101 104 121 99 Q114 86 122 77 Q104 81 87 66Z" fill="${cape}"/>
        <path d="M20 94 Q38 97 49 83 M112 93 Q100 93 88 83" fill="none" stroke="#fff" opacity=".48"/>
        <path d="M52 101 Q42 105 45 110 Q53 116 61 107 M77 103 Q89 105 88 111 Q81 116 73 107" fill="#eaa052"/>
        <ellipse cx="66" cy="86" rx="27" ry="23" fill="${feathers}"/>
        <path d="M43 78 Q29 76 34 88 Q37 95 45 91 M89 78 Q103 76 98 88 Q95 95 87 91" fill="${feathers}"/>
        <path d="${plume}Z" fill="${feathers}"/>
        <ellipse cx="66" cy="51" rx="30" ry="26" fill="${feathers}"/>
        <path d="M40 44 Q51 36 66 45 Q81 36 92 44 L88 56 Q79 64 66 55 Q53 64 44 56Z" fill="${mask}"/>
        <path d="M48 51 Q53 44 58 51 M74 51 Q79 44 84 51" fill="none" stroke="#392841" stroke-width="2.4"/>
        <path d="M57 59 Q66 54 75 59 Q72 67 66 67 Q60 67 57 59Z" fill="#f6a246"/>
        <circle cx="66" cy="85" r="10" fill="#fff7e9" stroke="${cape}"/>
        <text x="66" y="90" text-anchor="middle" fill="${cape}" stroke="none" font-family="system-ui,sans-serif" font-size="14" font-weight="bold">${badge}</text>
      </g>
      <g class="hatch-shell" stroke="#a97363" stroke-width="1.8" stroke-linejoin="round">
        <path class="hatch-closed" d="M35 75 C38 46 51 21 66 21 S94 46 97 75 C100 101 87 115 66 115 S32 101 35 75Z" fill="#fff5d9"/>
        <path class="hatch-top" d="M35 75 C38 46 51 21 66 21 S94 46 97 75 L84 68 74 78 65 69 55 78 45 69Z" fill="#fff5d9"/>
        <path class="hatch-bottom" d="M35 75 L45 69 55 78 65 69 74 78 84 68 97 75 C100 101 87 115 66 115 S32 101 35 75Z" fill="#fae0c3"/>
        <path d="M41 91 Q44 104 54 107" fill="none" stroke="#fff7df" stroke-width="3" stroke-linecap="round"/>
        <g class="hatch-dots" fill="${mask}" stroke="none" opacity=".43"><circle cx="57" cy="47" r="3"/><circle cx="76" cy="52" r="4"/><circle cx="66" cy="34" r="2"/><circle cx="48" cy="62" r="2.4"/><circle cx="82" cy="63" r="2.4"/></g>
      </g>
      <g class="hatch-sparks" fill="${cape}"><path d="M19 42l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM109 31l2 7 7 2-7 2-2 7-2-7-7-2 7-2z"/><circle cx="114" cy="64" r="2.5"/></g>
    </svg>`;
  }
  function label(name,present){
    return name+(present?', EN CLASE. DESHACER':', TOCA PARA MARCAR PRESENTE');
  }
  function render(students,attendance,studentLabel){
    const eggs=students.map((name,index)=>{
      const display=studentLabel(name),present=attendance[name];
      return `<button type="button" class="hatch-egg${present?' is-present':''}" data-action="attendance-toggle" data-value="${esc(name)}" aria-pressed="${Boolean(present)}" aria-label="${esc(label(display,present))}">${artwork(index)}<strong>${esc(display.toLocaleUpperCase('es-ES'))}</strong><small>${present?'EN CLASE':'TOCA TU HUEVO'}</small></button>`;
    }).join('');
    return `<section class="hatch-attendance"><header><span>LA CLASE ROSA · SUPERPATITOS</span><h2>¿QUIÉN HA VENIDO HOY?</h2><p>TOCA EL HUEVO CON TU NOMBRE.</p></header><div class="hatch-grid">${eggs}</div><div class="sr-only" id="hatch-status" role="status" aria-live="polite"></div></section>`;
  }
  function update(button,name,present){
    button.classList.toggle('is-present',present);
    button.setAttribute('aria-pressed',String(present));
    button.setAttribute('aria-label',label(name,present));
    button.querySelector('small').textContent=present?'EN CLASE':'TOCA TU HUEVO';
    document.getElementById('hatch-status').textContent=name+(present?' ESTÁ EN CLASE':' HA VUELTO AL HUEVO');
  }
  return {render,update};
})();
