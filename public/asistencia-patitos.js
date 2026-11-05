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
    const id='pond-hero-'+index;
    const capeShape=index%2===0
      ?'M47 63 Q31 64 10 86 Q13 104 5 107 Q32 117 56 96 L79 95 Q101 112 127 99 Q114 88 122 70 Q98 84 84 64Z'
      :'M47 65 Q30 70 12 64 Q19 84 7 102 Q33 111 53 95 L83 96 Q104 108 125 104 Q117 85 122 78 Q103 78 87 65Z';
    const accessory=index%4===0
      ?`<path d="M87 79 Q99 74 108 79 L106 89 Q103 96 98 99 Q91 96 88 89Z" fill="#ffd778" stroke="${cape}"/><path d="M98 80l1.5 4.5 5 .2-4 2.8 1.5 4.5-4-2.8-4 2.8 1.5-4.5-4-2.8 5-.2Z" fill="#fff5c4" stroke="none"/>`
      :index%4===1
        ?`<path d="M83 34q5-12 14-12q4 5-3 13q8 1 8 7q-9 6-17-3Z" fill="${mask}"/><circle cx="88" cy="36" r="4" fill="#ffdb82"/>`
        :index%4===2
          ?`<path d="M56 26l-3-12 10 6 5-9 5 10 10-4-4 12Z" fill="#f8c968"/><circle cx="68" cy="21" r="2" fill="${mask}"/>`
          :`<path d="M43 75 Q63 87 90 73 L90 79 Q67 93 43 81Z" fill="${mask}"/><path d="M43 77l-11 6 8 2-2 5 15-7Z" fill="${mask}"/>`;
    const fragments=[
      ['M32 66l8 2-5 7-5-3Z',-29,-31,-65],
      ['M92 65l8-6 4 5-3 7Z',29,-27,70],
      ['M47 44l6-7 5 5-2 5Z',-24,-40,38],
      ['M79 43l6-4 5 6-4 5Z',30,-35,-38],
      ['M34 86l7 4-3 6-6-4Z',-32,8,-50],
      ['M98 83l6 3-1 6-7 1Z',26,12,54]
    ].map(([shape,x,y,rotation])=>`<path class="hatch-fragment" d="${shape}" style="--scatter-x:${x}px;--scatter-y:${y}px;--spin:${rotation}deg"/>`).join('');
    return `<svg class="hatch-art" viewBox="0 0 132 127" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="${id}-gold" cx=".34" cy=".25" r=".78">
          <stop stop-color="#fff6bf"/><stop offset=".52" stop-color="${feathers}"/><stop offset="1" stop-color="#edaa56"/>
        </radialGradient>
        <linearGradient id="${id}-shell" x2=".45" y2="1">
          <stop stop-color="#fffdf2"/><stop offset=".55" stop-color="#fff0cc"/><stop offset="1" stop-color="#e8b899"/>
        </linearGradient>
        <linearGradient id="${id}-cape" x2=".6" y2="1">
          <stop stop-color="${mask}"/><stop offset=".58" stop-color="${cape}"/><stop offset="1" stop-color="#58394b"/>
        </linearGradient>
      </defs>
      <g class="hatch-water" fill="none" stroke="#eafff5">
        <ellipse cx="66" cy="111" rx="50" ry="12" stroke-width="1.3" opacity=".83"/>
        <ellipse cx="66" cy="112" rx="58" ry="14" stroke-width=".8" opacity=".56"/>
      </g>
      <g class="hatch-leaf">
        <path d="M68 104 L78 96 C106 97 118 102 116 109 C114 119 82 125 52 121 C27 119 15 113 17 107 C20 100 41 96 64 97Z" fill="#3c7954" stroke="#315d48" stroke-width="1.15"/>
        <path d="M67 102 L77 95 C101 95 119 101 116 107 C112 117 84 121 53 118 C29 117 16 110 19 105 C23 99 42 95 64 96Z" fill="#a2c974"/>
        <path d="M28 106 Q52 107 66 112 Q82 105 106 104 M67 112 L61 117 M66 112 L85 117" fill="none" stroke="#648f59" opacity=".72"/>
        <ellipse cx="66" cy="108" rx="32" ry="7" fill="#587858" opacity=".32"/>
      </g>
      <g class="hatch-hero" stroke="#75484a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <g class="hatch-cape">
          <path d="${capeShape}" fill="url(#${id}-cape)"/>
          <path d="M17 96 Q38 97 49 78 M116 95 Q97 96 85 76" fill="none" stroke="#fff4ea" opacity=".53"/>
        </g>
        <path d="M50 99 Q41 104 43 109 Q50 116 61 107 M78 102 Q90 104 89 109 Q84 116 73 107" fill="#f3a859"/>
        <ellipse cx="66" cy="85" rx="27" ry="24" fill="url(#${id}-gold)"/>
        <path d="M44 74 Q63 80 89 74 Q94 92 81 102 Q64 110 49 100 Q40 93 44 74Z" fill="url(#${id}-cape)"/>
        <path d="M45 77 Q29 73 32 85 Q35 95 46 90 M87 77 Q105 73 101 86 Q96 97 87 90" fill="url(#${id}-gold)"/>
        <path d="M37 82l4 4m58-5-4 5" fill="none" stroke="#cf8a59" opacity=".7"/>
        <circle cx="66" cy="88" r="11" fill="#fff7e9" stroke="#f2c866" stroke-width="2"/>
        <text x="66" y="93" text-anchor="middle" fill="${cape}" stroke="none" font-family="system-ui,sans-serif" font-size="14" font-weight="bold">${badge}</text>
        <path d="${plume}Z" fill="url(#${id}-gold)"/>
        <path d="M35 51 Q35 24 65 25 Q94 24 97 50 Q100 66 87 73 Q77 81 65 79 Q51 80 42 73 Q32 68 35 51Z" fill="url(#${id}-gold)"/>
        <path d="M42 42q5-9 15-10m-9 38 3 2m28 0 4-3" stroke="#fff9cb" stroke-width="2" fill="none"/>
        <path d="M36 44 Q50 34 66 44 Q80 34 96 44 L92 55 Q81 65 66 56 Q52 66 40 56Z" fill="${mask}" stroke="${cape}"/>
        <path d="M40 45 Q52 39 62 45 M71 45 Q84 39 91 45" stroke="#fff5e6" opacity=".62" fill="none"/>
        <g fill="#423049" stroke="none"><ellipse cx="53" cy="50" rx="4.4" ry="6"/><ellipse cx="79" cy="50" rx="4.4" ry="6"/></g>
        <g fill="#fffaf2" stroke="none"><circle cx="54.3" cy="48" r="1.7"/><circle cx="80.3" cy="48" r="1.7"/></g>
        <g fill="#ed9291" opacity=".63" stroke="none"><ellipse cx="43" cy="61" rx="5" ry="2.8"/><ellipse cx="89" cy="61" rx="5" ry="2.8"/></g>
        <path d="M55 62 Q63 53 76 59 Q80 61 76 64 Q69 73 61 68 Q57 67 55 62Z" fill="#ffa54e"/>
        <path d="M58 62 Q66 65 75 61" fill="none" stroke="#a85837"/>
        ${accessory}
      </g>
      <g class="hatch-shell" fill="url(#${id}-shell)" stroke="#aa786a" stroke-width="1.6" stroke-linejoin="round">
        <path class="hatch-closed" d="M29 80 C29 49 48 12 66 12 S103 49 103 80 C103 102 89 115 66 115 S29 102 29 80Z"/>
        <path class="hatch-top" d="M29 80 C29 49 48 12 66 12 S103 49 103 80 L90 74 79 84 68 73 57 82 43 74Z"/>
        <path class="hatch-bottom" d="M36 94 L47 91 56 99 68 92 77 100 87 92 97 95 Q93 115 67 116 Q40 115 36 94Z"/>
        <path class="hatch-shell-shine" d="M42 48 Q48 30 58 24 M39 86 Q44 101 56 105" fill="none" stroke="#fffaf0" stroke-width="3" stroke-linecap="round"/>
        <g class="hatch-dots" fill="${mask}" stroke="none" opacity=".54"><circle cx="57" cy="45" r="3.2"/><circle cx="77" cy="51" r="4.3"/><circle cx="65" cy="31" r="2.3"/><circle cx="46" cy="63" r="2.7"/><circle cx="88" cy="63" r="2.7"/><circle cx="52" cy="88" r="3"/><circle cx="78" cy="97" r="2.8"/></g>
        <path class="hatch-crack" d="M68 27 L62 42 72 49 61 59 69 71 57 82 43 74 29 80 M72 49 L82 44 89 52 M61 59 L48 55 42 61 M69 71 L79 84 90 74 103 80" fill="none" stroke="#986357" stroke-width="2.3" pathLength="1"/>
        <g class="hatch-fragments" fill="#fff2d7">${fragments}</g>
      </g>
      <g class="hatch-sparks" fill="#fff3b4" stroke="#bd824a" stroke-width=".75">
        <path d="M17 38l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM109 23l2 7 7 2-7 2-2 7-2-7-7-2 7-2zM118 57l1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4 4-1.4z"/>
        <circle cx="25" cy="25" r="2.4"/><circle cx="101" cy="46" r="1.7"/>
      </g>
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
    return `<section class="hatch-attendance"><header><h2>¿QUIÉN HA VENIDO HOY?</h2></header><div class="hatch-grid">${eggs}</div><div class="sr-only" id="hatch-status" role="status" aria-live="polite"></div></section>`;
  }
  function update(button,name,present){
    button.classList.toggle('is-present',present);
    button.classList.toggle('is-hatching',present);
    button.setAttribute('aria-pressed',String(present));
    button.setAttribute('aria-label',label(name,present));
    button.querySelector('small').textContent=present?'EN CLASE':'TOCA TU HUEVO';
    document.getElementById('hatch-status').textContent=name+(present?' ESTÁ EN CLASE':' HA VUELTO AL HUEVO');
  }
  // Group membership comes from the Rosa roster, not the hero's outfit or its position.
  const rosaGirls=new Set(['Alma','Abril','Emma']);
  const countLabels={girls:'Cuántas niñas han venido',boys:'Cuántos niños han venido',present:'Total en clase',absent:'Cuántos faltan'};
  function startCount(students,attendance,studentLabel){
    const groups={girls:[],boys:[],absent:[]};
    students.forEach((name,index)=>{
      const display=studentLabel(name);
      const group=!attendance[name]?'absent':rosaGirls.has(display)?'girls':'boys';
      groups[group].push({name,display,index});
    });
    return {groups,limit:students.length,marked:new Set(),answers:{}};
  }
  function countPicker(model,key){
    const current=model.answers[key];
    const options=Array.from({length:model.limit+1},(_,i)=>
      `<option value="${i}"${current===i?' selected':''}>${i}</option>`).join('');
    return `<select class="pond-number" data-pond-answer="${key}" aria-label="${countLabels[key]}">
      <option value=""${current===undefined?' selected':''}>?</option>${options}</select>`;
  }
  function renderCountGroup(model,key,title){
    const group=model.groups[key];
    const tokens=group.map(({name,display,index})=>{
      const marked=model.marked.has(name);
      return `<button type="button" class="pond-token${key==='absent'?'':' is-present'}${marked?' is-counted':''}"
        data-action="pond-count-token" data-value="${esc(name)}" aria-label="${esc(display)}" aria-pressed="${marked}">
        ${artwork(index)}<span>${esc(display.toLocaleUpperCase('es-ES'))}</span><i aria-hidden="true">✓</i></button>`;
    }).join('');
    const empty=key==='absent'?'HAN VENIDO TODOS':'NO HAY PATITOS EN ESTE GRUPO';
    return `<section class="pond-count-group pond-count-${key}">
      <header><h3>${title}</h3>${countPicker(model,key)}</header>
      ${tokens?`<div class="pond-tokens">${tokens}</div>`:`<p class="pond-empty">${empty}</p>`}
    </section>`;
  }
  function renderCount(model){
    return `<section class="hatch-attendance pond-count" aria-labelledby="pond-count-title">
      <header class="pond-count-title"><h2 id="pond-count-title">CONTAMOS LOS PATITOS</h2><p>TOCA CADA PATITO O HUEVO AL CONTAR Y ELIGE EL NÚMERO.</p></header>
      <div class="pond-count-groups">${renderCountGroup(model,'girls','NIÑAS')}${renderCountGroup(model,'boys','NIÑOS')}</div>
      <div class="pond-equation" role="group" aria-label="Suma de niñas y niños">
        <span class="pond-equation-term"><small>NIÑAS</small><output data-pond-operand="girls">${model.answers.girls??'?'}</output></span>
        <b aria-hidden="true">+</b>
        <span class="pond-equation-term"><small>NIÑOS</small><output data-pond-operand="boys">${model.answers.boys??'?'}</output></span>
        <b aria-hidden="true">=</b>
        <span class="pond-equation-term"><small>EN CLASE</small>${countPicker(model,'present')}</span>
      </div>
      ${renderCountGroup(model,'absent','HOY FALTAN')}
      <div class="pond-count-check"><button type="button" class="button" data-action="pond-count-check">COMPROBAR</button>
        <p class="pond-count-feedback" role="status" aria-live="polite"></p></div>
    </section>`;
  }
  function toggleCounted(model,name,button){
    const marked=!model.marked.has(name);
    if(marked)model.marked.add(name);
    else model.marked.delete(name);
    button.classList.toggle('is-counted',marked);
    button.setAttribute('aria-pressed',String(marked));
  }
  function setCountAnswer(model,input,root){
    const key=input.dataset.pondAnswer;
    if(!Object.hasOwn(countLabels,key))return;
    const answer=input.value===''?undefined:Number(input.value);
    if(answer!==undefined&&(!Number.isInteger(answer)||answer<0||answer>model.limit))return;
    model.answers[key]=answer;
    const operand=root.querySelector('[data-pond-operand="'+key+'"]');
    if(operand)operand.textContent=answer??'?';
    root.querySelectorAll('.pond-number[aria-invalid]').forEach(field=>field.removeAttribute('aria-invalid'));
    const feedback=root.querySelector('.pond-count-feedback');
    feedback.textContent='';
    feedback.removeAttribute('data-result');
  }
  function checkCount(model,root){
    const {girls,boys,absent}=model.groups;
    const expected={girls:girls.length,boys:boys.length,present:girls.length+boys.length,absent:absent.length};
    const keys=Object.keys(expected);
    const empty=keys.filter(key=>model.answers[key]===undefined);
    const wrong=keys.filter(key=>model.answers[key]!==expected[key]);
    const review=empty.length?empty:wrong;
    for(const key of keys){
      const field=root.querySelector('[data-pond-answer="'+key+'"]');
      if(review.includes(key))field.setAttribute('aria-invalid','true');
      else field.removeAttribute('aria-invalid');
    }
    const feedback=root.querySelector('.pond-count-feedback');
    feedback.dataset.result=review.length?'retry':'success';
    feedback.textContent=empty.length?'ELIGE UN NÚMERO EN CADA CASILLA.':
      wrong.length?'REVISA LAS CASILLAS MARCADAS Y VUELVE A CONTAR.':'¡MUY BIEN! HABÉIS CONTADO A TODA LA CLASE.';
    return review.length===0;
  }
  return {render,update,startCount,renderCount,toggleCounted,setCountAnswer,checkCount};
})();
