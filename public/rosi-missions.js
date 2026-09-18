'use strict';
window.ROSA_MISSIONS=(()=>{
  const d=window.ROSA.dinosaurs;
  const task=(type,round=0,level=3)=>({type,round,level});
  const weeks=[
    {week:1,title:'Primeras pistas',focus:'Observamos, comparamos y recordamos antes de elegir.',steps:[task('rasgos',1),task('rasgos',5),task('faltan',0),task('faltan',4),task('orden',1),task('orden',5)]},
    {week:2,title:'Somos investigadores',focus:'Relacionamos varias pistas y reconstruimos lo que hemos observado.',steps:[task('rasgos',3),task('rasgos',8),task('silueta',2),task('silueta',7),task('faltan',2),task('puzzle',1,2)]},
    {week:3,title:'Cuerpos diferentes',focus:'Distinguimos cuernos, placas, crestas y colas.',steps:[task('rasgos',2),task('rasgos',7),task('silueta',1),task('silueta',5),task('puzzle',2,2),task('orden',3)]},
    {week:4,title:'Seguimos el rastro',focus:'Usamos el contorno y la posición para recordar un recorrido.',steps:[task('silueta',4),task('silueta',6),task('orden',4),task('orden',7),task('faltan',5),task('puzzle',5,2)]},
    {week:5,title:'Huevos en los nidos',focus:'Contamos colecciones y averiguamos cuántos huevos faltan.',steps:[task('contar',4),task('contar',6),task('nido',0),task('nido',2),task('colecciones',0),task('colecciones',2)]},
    {week:6,title:'Juntamos colecciones',focus:'Combinamos dos grupos y completamos cantidades hasta diez.',steps:[task('colecciones',1),task('colecciones',3),task('nido',3),task('nido',4),task('contar',7),task('contar',8)]},
    {week:7,title:'El menú de los dinosaurios',focus:'Clasificamos varios dinosaurios y explicamos nuestras decisiones.',steps:[task('rasgos',3),task('rasgos',8),task('menu',0),task('menu',3),task('serie',0),task('serie',1)]},
    {week:8,title:'Ordenamos el campamento',focus:'Clasificamos y completamos dos huecos de patrones AAB, ABB y ABC.',steps:[task('menu',1),task('serie',1),task('serie',2),task('serie',3),task('orden',6),task('colecciones',2)]},
    {week:9,title:'Reconstruimos dinosaurios',focus:'Relacionamos las partes con el todo y ordenamos dibujos por tamaño.',steps:[task('puzzle',0,2),task('puzzle',5,2),task('ordenar-piezas',2,3),task('silueta',8),task('serie',2),task('orden',0)]},
    {week:10,title:'Recorridos y secuencias',focus:'Recordamos el orden de una expedición y completamos sus patrones.',steps:[task('orden',2),task('serie',3),task('ordenar-piezas',6,3),task('faltan',7),task('orden',8),task('puzzle',6,2)]},
    {week:11,title:'Preparamos el museo',focus:'Identificamos, agrupamos y reconstruimos nuestros descubrimientos.',steps:[task('rasgos',6),task('silueta',3),task('menu',2),task('colecciones',3),task('puzzle',7,2),task('orden',4)]},
    {week:12,title:'Pequeños expertos',focus:'Reunimos lo aprendido: pistas, memoria, cantidades y clasificación.',steps:[task('rasgos',8),task('faltan',8),task('nido',4),task('menu',4),task('serie',4),task('puzzle',8,2)]}
  ];
  const labels={rasgos:'Relacionar pistas',faltan:'Recordar dos ausentes',orden:'Reconstruir el orden',silueta:'Reconocer contornos',contar:'Contar dinosaurios',nido:'Completar el nido',colecciones:'Juntar colecciones',menu:'Clasificar el grupo',serie:'Completar dos huecos',puzzle:'Reconstruir seis piezas','ordenar-piezas':'Ordenar por tamaño'};
  const speech={rasgos:'Escucha las pistas. ¿Qué dinosaurio es?',silueta:'Observa la silueta. ¿A qué dinosaurio pertenece?',lookMissing:'Mira los cuatro dinosaurios. Después se esconderán dos.',missing:'Elige los dos dinosaurios que se han escondido.',lookOrder:'Mira los cuatro dinosaurios y recuerda su orden.',order:'Coloca los cuatro dinosaurios en el mismo orden.',nido:'Fíjate en el número. ¿Cuántos huevos faltan para completar el nido?',collections:'Junta los dos grupos de huevos. ¿Cuántos hay en total?',menu:'Elige un dinosaurio y después su grupo de alimentación. Hay que colocar a los seis.',series:'Observa el grupo que se repite. Completa los dos huecos de la serie.',complete:'¡Lo habéis conseguido!'};
  let selectedWeek=1;
  try{selectedWeek=Math.min(12,Math.max(1,Number(localStorage.getItem('rosa-project-week'))||1));}catch{}
  const getWeek=n=>weeks.find(w=>w.week===Number(n))||weeks[0];
  const kindFor=t=>['puzzle','ordenar-piezas','contar'].includes(t)?t:'falta';
  const art=id=>'<img src="assets/dinos-pdi/'+d[id].id+'.webp" alt="'+E(d[id].short)+'" draggable="false">';
  const egg=()=>'<img src="assets/symbols/1f95a.png" alt="Huevo" draggable="false">';
  const eggs=n=>'<div class="mission-eggs">'+Array.from({length:n},egg).join('')+'</div>';
  const context=p=>p?.payload?.missionWeek?getWeek(p.payload.missionWeek):null;
  const solved=p=>!!p?.answered||(p?.drop&&Object.keys(p.drop.placed).length>=p.drop.goal);
  function page(){const w=getWeek(selectedWeek);return '<section class="panel mission-picker" aria-labelledby="mission-picker-title"><div class="heading-row"><div><span class="eyebrow">JUEGOS DE LA SEMANA</span><h2 id="mission-picker-title">La misión del proyecto</h2></div><label class="field" for="mission-week">Semana del proyecto<select id="mission-week">'+weeks.map(x=>'<option value="'+x.week+'"'+(x.week===selectedWeek?' selected':'')+'>Semana '+x.week+' · '+E(x.title)+'</option>').join('')+'</select></label></div><h3>'+E(w.title)+'</h3><p>'+E(w.focus)+'</p><div class="mission-outline">'+[...new Set(w.steps.map(s=>s.type))].map(t=>'<span>'+E(labels[t])+'</span>').join('')+'</div><div class="resource-actions">'+btn('Empezar los 6 retos →','mission-start',w.week)+'<span class="hint">Sin reloj. Podéis volver a mirar las pistas.</span></div></section>';}
  async function start(week,index=0){const w=getWeek(week),s=w.steps[index];if(!s)return;await window.ROSA_AULA.launch(kindFor(s.type),{round:s.round,payload:{missionWeek:w.week,missionIndex:index,missionType:s.type,missionLevel:s.level}});}
  function data(p){if(p.missionData)return p.missionData;const n=p.round,ids=Array.from({length:4},(_,i)=>(n+i*2)%9);return p.missionData={ids,options:shuffle(ids),selected:[],placed:[],missing:[ids[n%4],ids[(n+2)%4]],hidden:false,picked:null,groups:{}};}
  function header(p){const w=context(p);return w?'<div class="mission-progress"><strong>Semana '+w.week+' · '+E(w.title)+'</strong><span>Reto '+Math.min(p.payload.missionIndex+1,6)+' de 6</span><div aria-label="'+p.payload.missionIndex+' retos completados">'+w.steps.map((_,i)=>'<span class="'+(i<p.payload.missionIndex?'done':i===p.payload.missionIndex?'current':'')+'">'+(i<p.payload.missionIndex?'✓':i+1)+'</span>').join('')+'</div></div>':'';}
  function footer(p){if(!context(p))return null;if(p.payload.missionDone)return btn('Volver a las misiones','mission-exit','','secondary')+btn('Repetir esta misión','mission-start',p.payload.missionWeek);return '<button type="button" id="mission-next" data-action="mission-next"'+(!solved(p)?' disabled':'')+'>'+(p.payload.missionIndex===5?'Terminar misión ✓':'Siguiente reto →')+'</button><span class="hint">'+(solved(p)?'Podemos contar cómo lo hemos pensado.':'Completad el reto para continuar.')+'</span>';}
  function update(p){if(!context(p))return;const el=document.querySelector('#mission-next');if(el){el.disabled=!solved(p);if(el.nextElementSibling)el.nextElementSibling.textContent=solved(p)?'Podemos contar cómo lo hemos pensado.':'Completad el reto para continuar.';}}
  const check=()=>btn('Comprobar','mission-check','','secondary');
  const feedback=()=>'<div id="game-feedback" class="feedback" role="status" aria-live="polite"></div>';
  function cardOptions(ids,action,selected=[]){return '<div class="mission-card-options">'+ids.map(id=>'<button type="button" class="choice mission-choice'+(selected.includes(id)?' selected':'')+'" data-action="'+action+'" data-value="'+id+'" aria-pressed="'+selected.includes(id)+'" aria-label="'+E(d[id].short)+'">'+art(id)+'</button>').join('')+'</div>';}
  function renderMission(p){
    const w=context(p);if(!w)return null;
    if(p.payload.missionDone){p.answer=null;p.customSpeech=speech.complete;return {body:celebration(3,'Hemos resuelto seis retos de la semana '+w.week+'.','¡Misión completada!')+'<h2>'+E(w.title)+'</h2><p>¿Qué pista os ha ayudado más? Compartimos nuestro descubrimiento con la clase.</p>',foot:''};}
    const type=p.payload.missionType,n=p.round,m=data(p);p.explanation='¿Cómo lo has pensado? Podemos contarlo a la clase.';
    if(['puzzle','ordenar-piezas','contar'].includes(type))return null;
    let body='';
    if(type==='rasgos'||type==='silueta'){
      const correct=n%9,others=[correct,(correct+2)%9,(correct+4)%9,(correct+6)%9];m.options??=shuffle(others);
      if(!m.answerOptions)m.answerOptions=shuffle(others);
      p.customSpeech=type==='rasgos'?speech.rasgos+' '+d[correct].fact:speech.silueta;
      body='<h2>'+E(speech[type])+'</h2>'+(type==='rasgos'?'<p class="mission-clue">'+E(d[correct].fact)+'</p>':'<div class="mission-silhouette" aria-label="Silueta de dinosaurio">'+art(correct)+'</div>')+choices(m.answerOptions.map(id=>({label:art(id),value:String(id)})),String(correct));
    }else if(type==='faltan'){
      p.customSpeech=m.hidden?speech.missing:speech.lookMissing;p.answer=m.hidden?[...m.missing].sort((a,b)=>a-b).join(','):null;
      body='<h2>'+E(p.customSpeech)+'</h2><div class="mission-model">'+m.ids.map(id=>'<div>'+(m.hidden&&m.missing.includes(id)?'<span class="mission-hole">?</span>':art(id))+'</div>').join('')+'</div>'+(m.hidden?cardOptions(m.options,'mission-select',m.selected)+'<p class="hint">'+m.selected.length+' de 2 seleccionados</p>'+check()+btn('Volver a mirar','mission-look','','quiet'):btn('Ya miramos. Esconder dos','mission-hide','','secondary'))+feedback();
    }else if(type==='orden'){
      p.customSpeech=m.hidden?speech.order:speech.lookOrder;p.answer=m.hidden?m.ids.join(','):null;
      const values=m.hidden?Array.from({length:4},(_,i)=>m.placed[i]):m.ids;
      body='<h2>'+E(p.customSpeech)+'</h2><div class="mission-model">'+values.map((id,i)=>'<div><small>'+(i+1)+'</small>'+(id===undefined?'<span class="mission-hole">?</span>':art(id))+'</div>').join('')+'</div>'+(m.hidden?cardOptions(m.options.filter(id=>!m.placed.includes(id)),'mission-place')+check()+btn('Vaciar casillas','mission-clear','','quiet')+btn('Volver a mirar','mission-look','','quiet'):btn('Ya miramos. Mezclar','mission-hide','','secondary'))+feedback();
    }else if(type==='nido'||type==='colecciones'){
      const total=[6,7,8,9,10][n%5],shown=[2,4,3,5,4][n%5],answer=type==='nido'?total-shown:total;
      p.customSpeech=type==='nido'?speech.nido:speech.collections;
      const optionNumbers=[answer,...Array.from({length:10},(_,i)=>i+1).filter(x=>x!==answer).sort((a,b)=>Math.abs(a-answer)-Math.abs(b-answer)||a-b).slice(0,3)];if(!m.numbers)m.numbers=shuffle(optionNumbers);
      body='<h2>'+E(p.customSpeech)+'</h2>'+(type==='nido'?'<div class="mission-nest"><span class="mission-target" aria-label="Objetivo: '+total+' huevos">'+total+'</span>'+eggs(shown)+'</div>':'<div class="mission-collections">'+eggs(shown)+'<span aria-hidden="true">+</span>'+eggs(total-shown)+'</div>')+choices(m.numbers.map(String),String(answer));
    }else if(type==='serie'){
      const pattern=['AAB','ABB','ABC','AABB','ABC'][n%5],length=pattern.length*2,chars=pattern.repeat(3).slice(0,length+2).split(''),ids=[n%9,(n+2)%9,(n+4)%9];
      const answers=chars.slice(-2).map(c=>ids[c.charCodeAt(0)-65]);p.answer=answers.join(',');p.customSpeech=speech.series;
      body='<h2>'+E(p.customSpeech)+'</h2><div class="mission-pattern">'+chars.map((c,i)=>'<div>'+(i<length?art(ids[c.charCodeAt(0)-65]):m.placed[i-length]===undefined?'<span class="mission-hole">?</span>':art(m.placed[i-length]))+'</div>').join('')+'</div>'+cardOptions(ids,'mission-pattern')+check()+btn('Vaciar casillas','mission-clear','','quiet')+feedback();
    }else if(type==='menu'){
      p.customSpeech=speech.menu;p.answer='complete';
      const ids=Array.from({length:6},(_,i)=>(n+i)%9);const ready=Object.keys(m.groups).length===6;p.answered=ready;
      body='<h2>'+E(speech.menu)+'</h2><div class="mission-card-options">'+ids.map(id=>'<button type="button" class="choice mission-choice'+(m.picked===id?' selected':'')+'" data-action="mission-pick" data-value="'+id+'" aria-label="'+E(d[id].short)+'"'+(m.groups[id]?' disabled':'')+'>'+art(id)+(m.groups[id]?'<span class="mission-placed-mark">✓</span>':'')+'</button>').join('')+'</div><div class="mission-baskets">'+[['Herbívoro','🌿','Comían plantas'],['Carnívoro','🐟','Comían otros animales']].map(x=>'<button type="button" class="secondary" data-action="mission-group" data-value="'+x[0]+'"><span aria-hidden="true">'+x[1]+'</span><strong>'+x[2]+'</strong><small>'+Object.values(m.groups).filter(v=>v===x[0]).length+' colocados</small></button>').join('')+'</div><p class="hint">'+Object.keys(m.groups).length+' de 6 dinosaurios en su grupo</p>'+feedback();
    }
    return {body:'<div class="weekly-mission" data-mission-type="'+type+'">'+body+'</div>',foot:''};
  }
  function handle(action,value,target){
    if(!action?.startsWith('mission-'))return false;
    if(action==='mission-start'){void start(value);return true;}
    const p=state.projection,w=context(p);if(!w)return true;
    const m=data(p),type=p.payload.missionType;
    if(action==='mission-exit'){window.ROSA_AULA.close();document.querySelector('#projector').close();state.projection=null;state.dinoTab='aventuras';location.hash='dinosaurios';renderPage();return true;}
    if(action==='mission-next'){
      if(!solved(p))return true;window.ROSA_AULA.stopVoice();const index=p.payload.missionIndex+1;
      if(index<6)void start(w.week,index);else{p.payload.missionDone=true;p.payload.missionIndex=6;p.customSpeech=speech.complete;p.answered=false;projectionRender();}return true;
    }
    if(p.answered)return true;
    window.ROSA_AULA.stopVoice();
    if(action==='mission-hide')m.hidden=true;
    else if(action==='mission-look'){m.hidden=false;m.selected=[];m.placed=[];}
    else if(action==='mission-clear')m.placed=[];
    else if(action==='mission-select'){const id=Number(value);if(!m.options.includes(id))return true;if(m.selected.includes(id))m.selected=m.selected.filter(x=>x!==id);else if(m.selected.length<2)m.selected.push(id);}
    else if(action==='mission-place'){const id=Number(value);if(m.hidden&&m.options.includes(id)&&!m.placed.includes(id)&&m.placed.length<4)m.placed.push(id);}
    else if(action==='mission-pattern'){const id=Number(value);if([p.round%9,(p.round+2)%9,(p.round+4)%9].includes(id)&&m.placed.length<2)m.placed.push(id);}
    else if(action==='mission-pick'){const id=Number(value);if(Array.from({length:6},(_,i)=>(p.round+i)%9).includes(id)&&!m.groups[id])m.picked=id;}
    else if(action==='mission-group'){
      if(m.picked===null)return true;const id=m.picked;
      if(d[id].diet!==value){const fb=document.querySelector('#game-feedback');fb.textContent='Mira con calma. Puedes probar otra opción.';window.ROSA_AULA.feedbackVoice(fb.textContent);return true;}
      m.groups[id]=value;m.picked=null;if(Object.keys(m.groups).length===6){p.answered=true;window.ROSA_AULA.won(p);}
    }else if(action==='mission-check'){
      const selected=type==='faltan'?[...m.selected].sort((a,b)=>a-b):m.placed,required=type==='orden'?4:2;
      if(selected.length!==required){document.querySelector('#game-feedback').textContent='Completa la selección antes de comprobar.';return true;}
      target.dataset.value=selected.join(',');answer(target);return true;
    }
    projectionRender();return true;
  }
  function renderPage(){render();}
  function change(event){if(event.target.id!=='mission-week')return false;selectedWeek=getWeek(event.target.value).week;try{localStorage.setItem('rosa-project-week',String(selectedWeek));}catch{}renderPage();document.querySelector('#mission-week')?.focus();return true;}
  return {weeks,speech,page,start,context,header,footer,update,render:renderMission,handle,change,solved};
})();
