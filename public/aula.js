'use strict';
window.ROSA_AULA=(()=>{
  const PLAY=window.ROSA_PLAY;
  const emptyBook=()=>({version:1,favorites:[],level:2,queue:[],cursors:{},last:null,adventure:{theme:'none',steps:0}});
  const ui={book:emptyBook(),loaded:false,loading:null,dirty:false,saving:false,saveError:false,saveTimer:null,pendingFields:new Set(),favoriteOps:new Map(),session:null,finished:[],filter:'Todas',selected:null,drag:null,ignoreClick:0,workshopTab:'proposito',printPage:0,print:{type:'contar',theme:'Dinosaurios',count:6,max:6,size:'mediana',ink:'color',pattern:'AB',seed:0}};
  const levelNames=['Con ayuda','Practicamos','Un reto más'];
  const pieceGames=['puzzle','ordenar-piezas','cestas'];
  const objectiveIds=['tema-contar','tema-series','tema-vocabulario','contar','series','falta','intruso','clasificar','letras','verdadero','memory',...window.ROSA_PDI.games.map(g=>g[0]),...pieceGames];
  const isObjective=kind=>objectiveIds.includes(kind);
  const known=kind=>GAMES.some(g=>g[0]===kind);
  const title=kind=>GAMES.find(g=>g[0]===kind)?.[1]||'Pizarra digital';
  const level=()=>ui.book.level;
  const cleanLevel=value=>[1,2,3].includes(Number(value))?Number(value):2;
  const safeCopy=value=>JSON.parse(JSON.stringify(value));
  let voiceAudio=null,voiceVersion=0,autoVoiceTimer=null;


  async function load(){
    if(ui.loaded)return true;
    if(ui.loading)return ui.loading;
    ui.loading=(async()=>{
      try{
        const r=await fetch('/api/aula',{credentials:'same-origin',cache:'no-store'});
        if(!r.ok)throw new Error('load');const data=await r.json();
        if(!data.book||data.book.version!==1)throw new Error('format');
        const pending=safeCopy(ui.book);ui.book={...emptyBook(),...data.book};
        for(const key of ui.pendingFields){if(key==='cursors')ui.book.cursors={...ui.book.cursors,...pending.cursors};else if(key==='favorites'){for(const [id,add] of ui.favoriteOps)ui.book.favorites=add?[...new Set([...ui.book.favorites,id])]:ui.book.favorites.filter(x=>x!==id);}else ui.book[key]=pending[key];}
        ui.book.level=cleanLevel(ui.book.level);
        ui.book.favorites=ui.book.favorites.filter(known);ui.book.queue=ui.book.queue.filter(known).slice(0,4);
        ui.loaded=true;ui.saveError=false;refreshPage();return true;
      }catch{ui.saveError=true;refreshStatus();return false;}
      finally{ui.loading=null;}
    })();return ui.loading;
  }
  function refreshPage(){if(['pdi','favoritos'].includes(route()))render();else nav();}
  function statusHTML(){return '<div class="aula-save-status" role="status">'+(ui.saveError?'No se ha podido guardar todavía. '+btn('Reintentar','aula-retry','','quiet small'):ui.saving?'Guardando la selección…':ui.dirty?'Hay cambios pendientes de guardar.':ui.loaded?'Tu selección y la partida se conservan para cuando vuelvas con este navegador.':'Recuperando tu selección…')+'</div>';}
  function refreshStatus(){const el=$('#aula-save-status');if(el)el.innerHTML=statusHTML();}
  function saveSoon(keys=['last','cursors']){for(const key of keys)ui.pendingFields.add(key);ui.dirty=true;clearTimeout(ui.saveTimer);ui.saveTimer=setTimeout(save,350);}
  async function save(){
    if(ui.saving||!ui.dirty)return;
    if(!ui.loaded){ui.saveError=true;refreshStatus();return;}
    ui.saving=true;refreshStatus();
    try{
      while(ui.dirty){ui.dirty=false;const r=await fetch('/api/aula',{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(ui.book),keepalive:true});if(!r.ok)throw new Error('save');}
      ui.saveError=false;ui.pendingFields.clear();ui.favoriteOps.clear();
    }catch{ui.dirty=true;ui.saveError=true;}
    finally{ui.saving=false;refreshStatus();}
  }
  async function retry(){if(!ui.loaded&&!await load()){toast('No se ha podido recuperar la selección. Puedes seguir jugando y volver a intentarlo.');return;}await save();refreshPage();}
  function snapshot(p){
    if(!p||p.payload?.missionWeek||!known(p.kind))return null;
    return {kind:p.kind,payload:p.payload,round:p.round,level:p.level,pattern:p.pattern,hidden:p.hidden,answered:p.answered,memory:p.memory,matched:p.matched,placed:p.drop?.placed||{},storyId:p.storyId,storyPath:p.storyPath,surpriseOpen:p.surpriseOpen,surpriseType:p.surpriseType,session:ui.session?safeCopy(ui.session):null};
  }
  function remember(){const p=state.projection,snap=snapshot(p);if(!snap)return;ui.book.last=snap;ui.book.cursors[p.kind]=p.round;saveSoon();}
  function setup(p){p.level=p.payload?.missionWeek?p.payload.missionLevel:level();p.pattern=['AB','AB','ABC'][p.level-1];p.pairCelebration=false;p.drop=PLAY.pieces(p.kind,p.round,p.level);p.storyId=PLAY.stories[p.round%PLAY.stories.length].id;p.storyPath=['inicio'];p.surpriseOpen=false;p.surpriseType='mezcla';p.surpriseRevealed=false;ui.selected=null;if(p.kind==='memory')resetMemory(p);}
  function resetMemory(p){const poolSize=p.payload?.theme?(window.ROSA_CLASSROOM.themes[p.payload.theme]?.length||6):9,pairs=Math.min(poolSize,[2,4,6][p.level-1]),values=Array.from({length:pairs},(_,i)=>(i+p.round)%poolSize);p.memory=shuffle([...values,...values]);p.matched=[];p.flipped=[];p.locked=false;p.pairCelebration=false;}
  async function launch(kind,options={}){
    if(!known(kind))return;await load();stopVoice();
    ui.session=options.session?safeCopy(options.session):null;
    const previous=ui.book.cursors[kind];const n=Number.isInteger(options.round)?options.round:Number.isInteger(previous)?(previous+1)%100001:Math.floor(Math.random()*240);
    startProjection(kind,n,options.payload||null);
  }
  async function resume(){
    await load();const p=safeCopy(ui.book.last);if(!p||!known(p.kind)){toast('Elige un juego para empezar.');return;}
    stopVoice();ui.session=p.session&&p.session.games.every(known)?p.session:null;ui.book.level=cleanLevel(p.level);
    startProjection(p.kind,p.round,p.payload||null);const current=state.projection;
    current.hidden=!!p.hidden;current.answered=!!p.answered;current.pattern=p.pattern||'AB';
    if(p.kind==='memory'&&validMemory(p.memory,p.matched,current.level)){current.memory=p.memory;current.matched=p.matched;current.pairCelebration=p.matched.length===p.memory.length;}
    if(current.drop){for(const piece of current.drop.pieces){if(p.placed?.[piece.id]===piece.slot)current.drop.placed[piece.id]=piece.slot;}current.answered=Object.keys(current.drop.placed).length>=current.drop.goal;}
    if(p.kind==='cuento'){const story=PLAY.stories.find(s=>s.id===p.storyId);if(story){current.storyId=story.id;current.storyPath=validStoryPath(story,p.storyPath)?p.storyPath:['inicio'];}}
    current.surpriseOpen=!!p.surpriseOpen;current.surpriseType=['mezcla','adivinanza','movimiento','pregunta','reto'].includes(p.surpriseType)?p.surpriseType:'mezcla';
    projectionRender();
  }
  function validMemory(deck,matched,lev){const total=[4,8,12][lev-1];return Array.isArray(deck)&&deck.length===total&&deck.every(v=>Number.isInteger(v)&&v>=0&&v<9)&&[...new Set(deck)].length===total/2&&[...new Set(deck)].every(v=>deck.filter(x=>x===v).length===2)&&Array.isArray(matched)&&new Set(matched).size===matched.length&&matched.every(i=>Number.isInteger(i)&&i>=0&&i<total)&&[...new Set(matched.map(i=>deck[i]))].every(v=>matched.filter(i=>deck[i]===v).length===2);}
  function next(){const p=state.projection;if(!p&&!explicitText)return;stopVoice();p.voiceFeedback='';p.round=(p.round+1)%100001;p.answered=false;p.hidden=false;p.rewarded=false;p.pairCelebration=false;p.drop=PLAY.pieces(p.kind,p.round,p.level);p.surpriseOpen=false;p.surpriseRevealed=false;ui.selected=null;if(p.kind==='memory')resetMemory(p);projectionRender();$('#projector').scrollTop=0;}
  async function setLevel(value){await load();stopVoice();ui.book.level=cleanLevel(value);const p=state.projection;if(p&&isObjective(p.kind)){p.level=level();p.voiceFeedback='';p.answered=false;p.rewarded=false;p.hidden=false;p.drop=PLAY.pieces(p.kind,p.round,p.level);p.pattern=['AB','AB','ABC'][p.level-1];if(p.kind==='memory')resetMemory(p);projectionRender();}else refreshPage();saveSoon(['level']);}
  function levelSelect(id){return '<label class="aula-level" for="'+id+'">Nivel <select id="'+id+'">'+levelNames.map((name,i)=>'<option value="'+(i+1)+'"'+(level()===i+1?' selected':'')+'>'+name+'</option>').join('')+'</select></label>';}
  async function toggleFavorite(kind){if(!known(kind))return;await load();const add=!ui.book.favorites.includes(kind);ui.book.favorites=add?[...ui.book.favorites,kind]:ui.book.favorites.filter(x=>x!==kind);ui.favoriteOps.set(kind,add);saveSoon(['favorites']);refreshPage();}
  async function toggleQueue(kind){if(!known(kind))return;await load();if(ui.book.queue.includes(kind))ui.book.queue=ui.book.queue.filter(x=>x!==kind);else if(ui.book.queue.length<4)ui.book.queue.push(kind);else{toast('La sesión tiene cuatro juegos. Quita uno para añadir otro.');return;}saveSoon(['queue']);refreshPage();}
  async function reorder(kind,direction){await load();const index=ui.book.queue.indexOf(kind),other=index+direction;if(index<0||other<0||other>=ui.book.queue.length)return;[ui.book.queue[index],ui.book.queue[other]]=[ui.book.queue[other],ui.book.queue[index]];saveSoon(['queue']);refreshPage();}
  async function startSession(){await load();if(!ui.book.queue.length){toast('Añade de uno a cuatro juegos a la sesión.');return;}await launch(ui.book.queue[0],{session:{games:[...ui.book.queue],index:0}});}
  async function sessionNext(){const s=ui.session;if(!s)return;remember();if(s.index+1<s.games.length){s.index++;await launch(s.games[s.index],{session:s});}else{stopVoice();ui.finished=[...s.games];ui.session=null;ui.book.last=null;saveSoon();startProjection('session-end');}}
  function cardTools(g){const fav=ui.book.favorites.includes(g[0]),queued=ui.book.queue.includes(g[0]);return '<div class="pdi-card-tools"><button type="button" class="quiet small" data-action="pdi-favorite" data-value="'+g[0]+'" aria-pressed="'+fav+'" aria-label="'+(fav?'Quitar de':'Guardar en')+' favoritos: '+E(g[1])+'">'+(fav?'♥':'♡')+'</button><button type="button" class="quiet small" data-action="queue-toggle" data-value="'+g[0]+'" aria-pressed="'+queued+'">'+(queued?'✓ En la sesión':'+ A mi sesión')+'</button></div>';}
  function sessionHTML(){return '<section class="panel session-panel"><div class="heading-row"><h2>Mi sesión de PDI</h2><span class="tag">'+ui.book.queue.length+' / 4 juegos</span></div>'+(!ui.book.queue.length?'<p class="hint">Añade juegos con «+ A mi sesión». Después podrás pasar de uno a otro sin volver al menú.</p>':'<ol class="session-list">'+ui.book.queue.map((id,i)=>'<li><span><b>'+(i+1)+'</b> '+E(title(id))+'</span><div>'+btn('↑','queue-up',id,'quiet small')+btn('↓','queue-down',id,'quiet small')+btn('Quitar','queue-toggle',id,'quiet small')+'</div></li>').join('')+'</ol>')+'<div class="session-controls">'+levelSelect('aula-level')+'<button type="button" data-action="session-start"'+(!ui.book.queue.length?' disabled':'')+'>Empezar sesión →</button></div></section>';}
  function adventureSetup(){const a=ui.book.adventure;if(!['none','puntos'].includes(a.theme))ui.book.adventure={theme:'none',steps:0};return '<section class="panel adventure-panel"><h2>Una aventura para toda la clase</h2><p>Cada logro suma un punto verde. Al reunir seis, celebramos lo que hemos conseguido juntos.</p>'+(ui.book.adventure.theme==='none'?'<div class="adventure-options">'+btn('● Empezar con puntos verdes','adventure-start','puntos','secondary')+'</div>':'<div class="adventure-current">'+adventureHTML()+btn('Continuar aventura','adventure-continue','','small')+btn('Cerrar aventura','adventure-stop','','quiet small')+'</div>')+'</section>';}
  async function startAdventure(theme){if(theme!=='puntos')return;await load();ui.book.adventure={theme:'puntos',steps:0};saveSoon(['adventure']);await launch(ui.book.queue[0]||'contar');}
  function adventureHTML(){const a=ui.book.adventure;if(a.theme==='none')return '';const complete=a.steps>=6;return '<div class="adventure-track puntos" aria-label="'+a.steps+' de 6 puntos verdes"><strong>'+(complete?'¡Seis puntos verdes conseguidos!':'Nuestros puntos verdes')+'</strong><div class="adventure-steps" aria-hidden="true">'+Array.from({length:6},(_,i)=>'<span class="adventure-step '+(i<a.steps?'done':'')+'">'+(i<a.steps?'●':'○')+'</span>').join('')+'</div><small>'+a.steps+' de 6 puntos</small></div>';}
  function won(p,headline){if(p.payload?.missionWeek){window.ROSA_MISSIONS.update(p);return headline;}const a=ui.book.adventure;if(a.theme!=='none'&&a.steps<6){a.steps++;saveSoon(['adventure']);const el=$('#adventure-progress');if(el)el.innerHTML=adventureHTML();if(a.steps===6)headline='¡Seis puntos verdes conseguidos!';}remember();return headline;}
  function assemblyHub(){const steps=[['1','🙋','¿Quién ha venido?','asistencia'],['2','📅','Calendario','calendario'],['3','🌦️','Estación y tiempo','estacion'],['4','🙂','Emociones','emociones'],['5','⭐','Encargados','encargado'],['6','1·A','Número y letra protagonistas','numero']];return '<section class="panel pdi-assembly-hub"><div class="pdi-assembly-heading"><div><span class="eyebrow">EL CENTRO DE NUESTRA PDI</span><h2>Asamblea</h2><p>Sigue el orden completo o abre directamente el momento que necesites.</p></div>'+btn('Empezar la asamblea','routine','asistencia')+'</div><ol class="pdi-assembly-steps">'+steps.map(step=>'<li><button type="button" data-action="routine" data-value="'+step[3]+'"><b>'+step[0]+'</b><span aria-hidden="true">'+step[1]+'</span><strong>'+step[2]+'</strong></button></li>').join('')+'</ol><div class="pdi-assembly-extras"><strong>Para añadir cuando quieras</strong>'+btn('💬 Palabra del día aleatoria','random-word','','secondary')+btn('👋 Saludo','routine','saludo','secondary')+btn('♪ Canciones','song-manager','','secondary')+btn('? Adivinanza','routine','adivinanza','secondary')+'<a class="button secondary" href="#asamblea">Preguntas, retos y canciones</a></div></section>';}
  const external=(label,url,cls='secondary')=>'<a class="button '+cls+'" href="'+E(url)+'" target="_blank" rel="noopener">'+label+' <span aria-hidden="true">↗</span></a>';
  function expandProjectCards(html){return html.replaceAll('<details class="world-card ','<article class="world-card world-card-expanded ').replaceAll('<summary>','<div class="world-card-heading">').replaceAll('</summary>','</div>').replaceAll('</details>','</article>');}
  function expandSpecialCards(html){return html.replaceAll('<details class="special-choice">','<article class="special-choice special-choice-expanded">').replaceAll('<summary>','<div class="special-choice-heading">').replaceAll('</summary>','</div>').replaceAll('</details>','</article>');}
  function projectHubs(){return expandProjectCards(window.ROSA_CLASSROOM.projectHubs());}
  function specialDaysHub(){return expandSpecialCards(window.ROSA_CLASSROOM.specialDays());}
  function pdiNav(active='asamblea'){const links=[['asamblea','#pdi','☀','Asamblea'],['proyectos','#pdi-proyectos','🦕','Proyectos'],['dias','#pdi-dias','🎉','Días especiales'],['juegos','#pdi-juegos','◈','Todos los juegos'],['canciones','#canciones','♪','Canciones']];return '<nav class="pdi-quick-nav pdi-section-nav" aria-label="Secciones de PDI">'+links.map(([id,href,icon,label])=>'<a class="'+(active===id?'active':'')+'" href="'+href+'"'+(active===id?' aria-current="page"':'')+'>'+icon+' '+label+'</a>').join('')+'</nav>';}
  function pdiGameList(selected){if(!selected.length)return '<div class="empty"><h3>No hay juegos en este filtro</h3><p>Prueba otra categoría para seguir preparando tu sesión.</p>'+btn('Ver todos los juegos','pdi-filter','Todas')+'</div>';if(ui.filter!=='Todas')return gameTiles(selected);const order=['Asamblea','Matemáticas','Lenguaje','Lógica','Psicomotricidad','Proyecto','Juegos'];return order.map(name=>{const games=selected.filter(g=>area(g)===name);return games.length?'<section class="pdi-category"><div class="heading-row"><h2>'+E(name)+'</h2><span class="tag">'+games.length+' propuestas</span></div>'+gameTiles(games)+'</section>':'';}).join('');}
  function pdiPage(){return head('Pizarra digital','',ui.book.last?btn('↩ Continuar','pdi-resume','','secondary'):'','','')+'<div id="aula-save-status">'+statusHTML()+'</div>'+pdiNav('asamblea')+'<div id="pdi-asamblea">'+assemblyHub()+'</div><div id="pdi-sesion">'+sessionHTML()+'</div>';}
  function pdiProjectsPage(){return head('Proyectos','Cada proyecto en su propio espacio de PDI.','','PIZARRA DIGITAL')+pdiNav('proyectos')+projectHubs();}
  function pdiSpecialDaysPage(){return head('Días especiales','Accesos directos a los momentos especiales del curso.','','PIZARRA DIGITAL')+pdiNav('dias')+specialDaysHub();}
  function pdiGamesPage(){const selected=GAMES.filter(g=>ui.filter==='Favoritos'?ui.book.favorites.includes(g[0]):ui.filter==='Todas'||area(g)===ui.filter);return head('Todos los juegos','Filtra por categoría y añade los que quieras a Mi sesión.','','PIZARRA DIGITAL')+pdiNav('juegos')+'<section class="panel pdi-games-browser"><div class="heading-row"><div><span class="eyebrow">BANCO DE JUEGOS</span><h2>Elige una categoría</h2></div><span class="tag">'+selected.length+' juegos</span></div><div class="chips pdi-filter-chips">'+['Todas','Favoritos','Matemáticas','Lenguaje','Lógica','Asamblea','Proyecto','Juegos','Psicomotricidad'].map(name=>btn(name,'pdi-filter',name,'chip '+(ui.filter===name?'active':''))).join('')+'</div>'+pdiGameList(selected)+'</section>';}

  function area(g){return g[4]||({contar:'Matemáticas',series:'Matemáticas',falta:'Lógica',intruso:'Lógica',clasificar:'Proyecto',letras:'Lenguaje',emociones:'Asamblea',calendario:'Asamblea',tiempo:'Asamblea',dino:'Proyecto',verdadero:'Proyecto',adivinanza:'Lenguaje',memory:'Juegos',vocabulario:'Lenguaje'}[g[0]]);}
  function toolbar(p){return (window.ROSA_MISSIONS?.header(p)||'')+'<div class="aula-projection-controls">'+btn('🔊 Escuchar','speak','','secondary small')+btn('Parar voz','stop-voice','','quiet small')+(!p.payload?.missionWeek&&isObjective(p.kind)?levelSelect('projection-level'):'')+(ui.session?'<span class="tag">Sesión · '+(ui.session.index+1)+' / '+ui.session.games.length+'</span>':'')+voiceSettingsHTML()+'<span id="pdi-voice-status" class="sr-only" role="status"></span></div><div id="adventure-progress">'+(!p.payload?.missionWeek&&isObjective(p.kind)?adventureHTML():'')+'</div>';}
  function footer(foot){const mission=window.ROSA_MISSIONS?.footer(state.projection);if(mission!==null&&mission!==undefined)return mission;return foot+(ui.session?btn(ui.session.index+1<ui.session.games.length?'Siguiente juego →':'Terminar sesión ✓','session-next','','secondary'):'');}
  function stripHTML(html){return html.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();}
  function afterRender(body){const p=state.projection;if(!p)return;const previousSpeech=p.speak;p.speak=p.customSpeech||stripHTML((body.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)||[])[1]||title(p.kind));const word=body.match(/class="pdi-word"[\s\S]*?<strong>([^<]+)<\/strong>/);if(word)p.speak+=' '+word[1]+'.';
    if(p.kind==='challenge'){const ch=pick(D.challenges,p.round);p.speak=ch.title+'. '+ch.text;}
    if(p.kind==='dino'){const d=pick(D.dinosaurs,p.round);p.speak=d.short+'. '+d.fact;}
    if(p.kind==='vocabulario'){const v=pick(D.vocab,p.round);p.speak=v.word+'. '+v.definition;}
    if(p.kind==='cancion'){const song=pick(D.songs,p.round);p.speak=song[0]+'. '+song[1].replaceAll(' / ','. ');}
    if(p.kind==='calendario')p.speak=p.date.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    if(p.kind==='numero')p.speak+=' '+Math.min(10,Math.max(1,p.round+1))+'. Enséñalo con los dedos.';
    if(previousSpeech!==p.speak){stopVoice();p.voiceFeedback='';}const speechKey=[p.kind,p.round,p.hidden,p.speak].join('|');if(p.kind!=='cancion'&&p.lastAutoSpeech!==speechKey){p.lastAutoSpeech=speechKey;autoRead(p.speak);}
    if(p.answered&&p.answer!==null){const fb=$('#game-feedback');if(fb)fb.innerHTML=celebration(p.round,p.explanation||'Lo habéis encontrado juntos.');}
    remember();
  }
  function voiceSettingsHTML(){return '<details class="voice-settings"><summary>La voz de la clase</summary><div class="voice-sample">'+btn('🔊 Probar voz','voice-preview','','secondary small')+'<p class="hint">Una voz suave para escuchar y jugar juntos.</p></div></details>';}
  function stopVoice(){
    voiceVersion++;clearTimeout(autoVoiceTimer);
    if(voiceAudio){voiceAudio.onended=null;voiceAudio.onerror=null;voiceAudio.pause();voiceAudio.removeAttribute('src');voiceAudio.load();}
    const status=$('#pdi-voice-status');if(status)status.textContent='';
  }
  function autoRead(text){clearTimeout(autoVoiceTimer);const p=state.projection;autoVoiceTimer=setTimeout(()=>{if(state.projection===p)speak(false,text,true);},0);}
  function announce(text){speak(false,text);}
  function feedbackVoice(text){stopVoice();if(state.projection)state.projection.voiceFeedback=text;autoRead(text);}
  function speak(preview=false,explicitText=null,automatic=false){
    const p=state.projection;if(!p&&!explicitText)return;stopVoice();
    const text=explicitText||(preview?'¡Hola, peques! ¿Jugamos juntos? Mirad con calma. ¡Vamos a descubrirlo!':p.voiceFeedback||p.speak||title(p.kind));
    const clips=window.ROSA_VOICE?.resolve(text)||[];
    if(!clips.length||clips.some(c=>!c.url)){if(!automatic)toast('No se ha podido cargar esta lectura. Vuelve a abrir la actividad e inténtalo de nuevo.');return;}
    for(const clip of clips.slice(0,4)){const warm=new window.Audio();warm.preload='auto';warm.src=clip.url;try{warm.load();}catch{}}
    if(!window.Audio){toast('Este navegador no permite reproducir el audio. La consigna sigue en pantalla.');return;}
    if(!voiceAudio){voiceAudio=new window.Audio();voiceAudio.id='pdi-audio';voiceAudio.hidden=true;document.body?.appendChild?.(voiceAudio);}voiceAudio.preload='auto';voiceAudio.volume=1;
    const current=voiceVersion;let index=0;
    const failed=()=>{if(voiceVersion!==current)return;stopVoice();toast('No se ha podido reproducir el audio. Vuelve a pulsar «Escuchar».');};
    const play=()=>{
      if(current!==voiceVersion)return;
      if(index>=clips.length){stopVoice();return;}
      voiceAudio.src=clips[index++].url;
      window.ROSA_VOICE.configureAudio(voiceAudio);
      const status=$('#pdi-voice-status');if(status)status.textContent='Escuchando…';
      try{voiceAudio.play()?.catch(failed);}catch{failed();}
    };
    voiceAudio.onended=play;voiceAudio.onerror=failed;play();
  }

  function custom(p){const mission=window.ROSA_MISSIONS?.render(p);if(mission)return mission;
    p.customSpeech='';
    if(pieceGames.includes(p.kind))return renderPieces(p);
    if(p.kind==='cuento')return renderStory(p);
    if(p.kind==='sorpresa')return renderSurprise(p);
    if(p.kind==='session-end')return {body:celebration(1,'Hemos compartido '+ui.finished.length+' propuestas. Podemos contar cuál nos ha gustado más.','¡Una sesión juntos!')+'<h2>¿Qué hemos descubierto hoy?</h2><div class="session-complete-list">'+ui.finished.map(id=>'<span class="tag">'+E(title(id))+'</span>').join('')+'</div>',foot:btn('Volver a la pizarra','session-close')};
    return null;
  }
  function renderPieces(p){
    const game=p.drop||(p.drop=PLAY.pieces(p.kind,p.round,p.level));const complete=Object.keys(game.placed).length>=game.goal;
    p.answered=complete;p.customSpeech=game.prompt+'. Puedes arrastrar una pieza o tocarla y después tocar su lugar.';
    const pieceButton=piece=>'<button type="button" class="pdi-piece '+(ui.selected===piece.id?'selected':'')+'" data-action="pick-piece" data-value="'+piece.id+'" data-piece="'+piece.id+'" aria-pressed="'+(ui.selected===piece.id)+'" aria-label="'+E(piece.label)+'"'+(game.kind==='ordenar-piezas'?' style="--piece-size:'+piece.size+'px"':'')+'>'+PLAY.pieceArt(game,piece)+'</button>';
    const available=game.pieces.filter(piece=>!(piece.id in game.placed));const offset=(p.round+1)%available.length;const tray=[...available.slice(offset||0),...available.slice(0,offset||0)];
    let targets='';
    if(game.kind==='cestas')targets='<button type="button" class="fruit-basket" data-action="place-piece" data-value="0" data-slot="0"'+(complete?' disabled':'')+'><span aria-hidden="true">🧺</span><strong>'+Object.keys(game.placed).length+' / '+game.goal+'</strong><span class="basket-fruits">'+Object.keys(game.placed).map(()=>PLAY.picture(game.art.src,game.art.label)).join('')+'</span></button>';
    else targets='<div class="drop-grid '+(game.kind==='puzzle'?'puzzle-grid':'size-grid')+'" style="--cols:'+(game.cols||game.goal)+';--piece-ratio:'+(game.rows/game.cols||1)+'">'+game.pieces.map(piece=>{const placed=Object.values(game.placed).includes(piece.slot);return '<button type="button" class="pdi-slot '+(placed?'filled':'')+'" data-action="place-piece" data-value="'+piece.slot+'" data-slot="'+piece.slot+'" aria-label="Lugar '+(Number(piece.slot)+1)+'"'+(placed?' disabled':'')+(game.kind==='ordenar-piezas'?' style="--piece-size:'+piece.size+'px"':'')+'>'+(placed?PLAY.pieceArt(game,piece):'<span>'+(Number(piece.slot)+1)+'</span>')+'</button>';}).join('')+'</div>';
    return {body:'<h2>'+E(game.prompt)+'</h2><p class="hint piece-instruction">Arrastra, o toca una pieza y después su lugar.</p>'+(game.kind==='puzzle'?'<details class="puzzle-model"'+(p.level===1?' open':'')+'><summary>Ver modelo</summary>'+PLAY.picture(game.art.src,game.art.label)+'</details>':'')+'<div class="piece-workspace">'+targets+'<div class="piece-tray '+(game.kind==='puzzle'?'puzzle-grid':'')+'" style="--cols:'+(game.cols||3)+';--piece-ratio:'+(game.rows/game.cols||1)+'" aria-label="Piezas para colocar">'+tray.map(pieceButton).join('')+'</div></div><div id="piece-feedback" class="feedback" role="status" aria-live="polite">'+(complete?celebration(p.round,'Lo habéis completado pieza a pieza.','¡Lo habéis conseguido!'):'')+'</div>',foot:btn('Otra propuesta →','projection-next')};
  }
  function selectPiece(id){const p=state.projection;if(!p?.drop||p.answered||id in p.drop.placed||!p.drop.pieces.some(piece=>piece.id===id))return;ui.selected=id;projectionRender();$('#projection-content [data-slot]:not([disabled])')?.focus?.();}
  function place(slot){const p=state.projection,game=p?.drop;if(!game||p.answered)return;if(ui.selected===null){$('#piece-feedback').textContent='Primero toca una pieza.';return;}const piece=game.pieces.find(x=>x.id===ui.selected);if(!piece||piece.id in game.placed)return;if(piece.slot!==String(slot)||game.kind!=='cestas'&&Object.values(game.placed).includes(String(slot))){$('#piece-feedback').textContent='Mira con calma. Prueba otro lugar.';return;}game.placed[piece.id]=String(slot);ui.selected=null;const complete=Object.keys(game.placed).length>=game.goal;p.answered=complete;let message='';if(complete)message=won(p,'¡Lo habéis conseguido!');projectionRender();if(complete){$('#piece-feedback').innerHTML=celebration(p.round,'Lo habéis completado pieza a pieza.',message);$('#piece-feedback').scrollIntoView?.({block:'nearest'});}}
  function clearDrag(){const d=ui.drag;if(d?.ghost)d.ghost.remove();ui.drag=null;}
  function pointerDown(event){const target=event.target.closest('[data-piece]');if(!target||event.button!==undefined&&event.button!==0||!state.projection?.drop)return;ui.drag={id:target.dataset.piece,pointer:event.pointerId,x:event.clientX,y:event.clientY,target,moved:false,projection:state.projection};}
  function pointerMove(event){const d=ui.drag;if(!d||d.pointer!==event.pointerId||state.projection!==d.projection)return;if(Math.hypot(event.clientX-d.x,event.clientY-d.y)<8&&!d.moved)return;d.moved=true;event.preventDefault();if(!d.ghost){d.ghost=d.target.cloneNode(true);d.ghost.removeAttribute('data-action');d.ghost.removeAttribute('data-piece');d.ghost.setAttribute('aria-hidden','true');d.ghost.classList.add('piece-ghost');const box=d.target.getBoundingClientRect();d.ghost.style.width=box.width+'px';d.ghost.style.height=box.height+'px';$('#projector').appendChild(d.ghost);}d.ghost.style.left=(event.clientX-45)+'px';d.ghost.style.top=(event.clientY-45)+'px';}
  function pointerUp(event){const d=ui.drag;if(!d||d.pointer!==event.pointerId)return;const moved=d.moved,id=d.id,current=d.projection;clearDrag();if(!moved||state.projection!==current)return;ui.ignoreClick=Date.now()+350;const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-slot]');ui.selected=id;if(target)place(target.dataset.slot);else{projectionRender();$('#piece-feedback').textContent='La pieza sigue disponible. Puedes tocar su lugar.';}}

  function storyFor(p){return PLAY.stories.find(s=>s.id===p.storyId)||PLAY.stories[0];}
  function validStoryPath(story,path){return Array.isArray(path)&&path[0]==='inicio'&&path.length<=4&&path.every((id,i)=>story.nodes[id]&&(i===0||story.nodes[path[i-1]]?.choices?.some(c=>c[2]===id)));}
  function renderStory(p){const story=storyFor(p);if(!validStoryPath(story,p.storyPath))p.storyPath=['inicio'];const node=story.nodes[p.storyPath[p.storyPath.length-1]],firstPage=p.storyPath.length===1;p.customSpeech=(firstPage?story.title+'. ':'')+node.text+' '+(node.question||'')+(node.choices?' '+node.choices.map(c=>c[1]).join('. '):'');return {body:'<div class="story-picker"><label for="story-picker">Nuestro cuento <select id="story-picker">'+PLAY.stories.map(s=>'<option value="'+s.id+'"'+(s.id===story.id?' selected':'')+'>'+E(s.title)+'</option>').join('')+'</select></label></div><article class="story-scene">'+PLAY.picture(story.cover,story.title,'story-art')+'<div><span class="eyebrow">CUENTO ORIGINAL · PÁGINA '+p.storyPath.length+'</span><h2>'+E(story.title)+'</h2><p>'+E(node.text)+'</p>'+(node.question?'<p class="story-question">'+E(node.question)+'</p>':'')+'</div></article>'+(node.choices?'<div class="story-choices">'+node.choices.map(c=>btn('<span aria-hidden="true">'+c[0]+'</span>'+E(c[1]),'story-choice',c[2],'choice')).join('')+'</div>':celebration(3,'Cada decisión ha creado nuestro camino.','¡Un cuento compartido!')),foot:(p.storyPath.length>1?btn('← Volver a la página anterior','story-back','','secondary'):'')+btn('Leer de nuevo','story-restart','','secondary')};}
  function chooseStory(id){const p=state.projection,story=PLAY.stories.find(s=>s.id===id);if(p?.kind!=='cuento'||!story)return;stopVoice();p.storyId=id;p.storyPath=['inicio'];projectionRender();}
  function storyChoice(id){const p=state.projection;if(p?.kind!=='cuento')return;const story=storyFor(p),node=story.nodes[p.storyPath.at(-1)];if(!node.choices?.some(c=>c[2]===id))return;stopVoice();p.storyPath.push(id);projectionRender();$('#projector').scrollTop=0;}
  function renderSurprise(p){if(!p.surpriseOpen){p.customSpeech='Toca la caja para descubrir una sorpresa.';return {body:'<h2>¿Qué habrá dentro?</h2><button type="button" class="surprise-box" data-action="surprise-open" aria-label="Abrir la caja sorpresa"><span aria-hidden="true">🎁</span><strong>Toca para descubrir</strong></button>',foot:surpriseFilter(p)};}const s=PLAY.surprise(p.round,p.surpriseType);p.customSpeech=s.title+'. '+s.text+(p.surpriseRevealed&&s.answer?' '+s.answer:'');return {body:'<span class="prompt-symbol" aria-hidden="true">'+s.icon+'</span><h2>'+E(s.title)+'</h2><p class="surprise-prompt">'+E(s.text)+'</p>'+(s.answer?(p.surpriseRevealed?'<p class="surprise-answer">'+E(s.answer)+'</p>':btn('Descubrir respuesta','surprise-answer','','secondary')):''),foot:btn('Otra caja →','projection-next')+surpriseFilter(p)};}
  function surpriseFilter(p){return '<label class="aula-level">Sorpresas <select id="surprise-type">'+[['mezcla','Un poco de todo'],['adivinanza','Adivinanzas'],['movimiento','Movimiento'],['pregunta','Conversación'],['reto','Retos breves']].map(v=>'<option value="'+v[0]+'"'+(p.surpriseType===v[0]?' selected':'')+'>'+v[1]+'</option>').join('')+'</select></label>';}

  const printTypes=[['contar','1','Contar','Cuenta los dibujos y escribe cuántos hay.'],['memory','▦','Parejas','Recorta y busca las dos tarjetas iguales.'],['series','◈','Series','Descubre el patrón y completa los huecos.'],['tarjetas','A','Vocabulario','Observa el dibujo y descubre su nombre.']];
  const countTen=()=>ui.print.type==='contar'&&ui.print.max===10;
  const pageCount=()=>Math.ceil(ui.print.count/(countTen()?3:({grande:4,mediana:6,pequena:12}[ui.print.size])));
  function printSelect(label,key,values){return '<label class="field" for="print-'+key+'"><span>'+label+'</span><select id="print-'+key+'" data-print-setting="'+key+'">'+values.map(v=>'<option value="'+E(v[0])+'"'+(String(ui.print[key])===String(v[0])?' selected':'')+'>'+E(v[1])+'</option>').join('')+'</select></label>';}
  function printPreview(){
    ui.printPage=Math.max(0,Math.min(ui.printPage,pageCount()-1));
    return '<div class="preview-heading"><h2>Así quedará tu ficha</h2><span class="tag">A4 · '+({color:'Color',bn:'Blanco y negro',coloring:'Solo contorno'}[ui.print.ink]||'Color')+'</span></div><div class="custom-preview">'+PLAY.printSheets(ui.print,ui.printPage)+'</div><nav class="preview-pagination" aria-label="Páginas de tus fichas"><button type="button" class="secondary small" data-action="print-page" data-value="-1" aria-label="Ficha anterior"'+(ui.printPage===0?' disabled':'')+'>←</button><span role="status">Página '+(ui.printPage+1)+' de '+pageCount()+'</span><button type="button" class="secondary small" data-action="print-page" data-value="1" aria-label="Ficha siguiente"'+(ui.printPage===pageCount()-1?' disabled':'')+'>→</button></nav>';
  }
  function workshop(){
    const tabs='<div class="creator-tabs" aria-label="Tipo de creador">'+btn('Fichas con propósito','workshop-tab','proposito','secondary '+(ui.workshopTab==='proposito'?'active':''))+btn('Tarjetas rápidas','workshop-tab','rapidas','secondary '+(ui.workshopTab==='rapidas'?'active':''))+'</div>';
    if(ui.workshopTab==='proposito')return head('Crea tus fichas','Elige una propuesta, personalízala y comprueba la hoja antes de imprimir.')+tabs+'<p class="creator-series-link"><a href="#matematicas">Crear series · 4, 6 u 8 filas por A4 →</a></p>'+window.ROSA_SHEETS.panel();
    return head('Crea tus fichas','Elige una propuesta, personalízala y comprueba la hoja antes de imprimir.')+tabs+
      '<div class="custom-workshop"><section class="panel custom-controls" aria-label="Personaliza tus fichas">'+
      '<fieldset class="print-type-field"><legend><span class="workshop-step">1</span> ¿Qué vais a practicar?</legend><div class="print-type-grid">'+printTypes.map(t=>'<button type="button" class="print-type" id="print-type-'+t[0]+'" data-action="print-type" data-value="'+t[0]+'" aria-pressed="'+(ui.print.type===t[0])+'"><span aria-hidden="true">'+t[1]+'</span>'+t[2]+'</button>').join('')+'</div><p class="hint print-type-hint">'+printTypes.find(t=>t[0]===ui.print.type)[3]+'</p></fieldset>'+
      '<fieldset><legend><span class="workshop-step">2</span> Elige los detalles</legend><div class="print-fields">'+
      printSelect('Tema de los dibujos','theme',['Números','Formas','Animales','Naturaleza','Emociones','Dinosaurios'].map(v=>[v,v]))+
      printSelect(ui.print.type==='memory'?'Parejas para encontrar':'Tarjetas en total','count',ui.print.type==='memory'?[[4,'2 parejas · 4 tarjetas'],[6,'3 parejas · 6 tarjetas'],[12,'6 parejas · 12 tarjetas']]:[[4,'4 tarjetas'],[6,'6 tarjetas'],[12,'12 tarjetas']])+
      (ui.print.type==='contar'?printSelect('Contamos hasta el…','max',[[3,'3 · Primeros pasos'],[6,'6 · Practicamos'],[10,'10 · Un reto más']]):'')+
      (ui.print.type==='series'?printSelect('Patrón que se repite','pattern',[['AB','AB · Dos dibujos'],['AAB','AAB · Uno se repite'],['ABC','ABC · Tres dibujos']]):'')+
      '</div>'+btn('↻ Otros dibujos','print-shuffle','','secondary small')+'</fieldset>'+
      '<fieldset><legend><span class="workshop-step">3</span> Prepara el papel</legend><div class="print-fields">'+
      (countTen()?'<div class="count-ten-note"><strong>Reto hasta 10</strong><span>3 tarjetas horizontales por hoja, con 10 dibujos en cada una.</span></div>':printSelect('Tamaño de las tarjetas','size',[['grande','Grande · 4 por hoja'],['mediana','Mediano · 6 por hoja'],['pequena','Pequeño · 12 por hoja']]))+
      printSelect('Impresión','ink',[['color','A todo color'],['bn','Blanco y negro'],['coloring','Solo contorno · para colorear']])+'</div></fieldset>'+
      '<div class="workshop-print-action">'+btn('Preparar impresión / PDF','custom-print')+'<p class="hint">'+ui.print.count+' tarjetas en '+pageCount()+' '+(pageCount()===1?'hoja':'hojas')+'. Se imprimen todas las páginas.</p></div></section>'+
      '<section id="print-preview-panel" class="custom-preview-wrap" aria-label="Vista previa de tus fichas">'+printPreview()+'</section></div>';
  }
  function refreshPrint(focusId){render();if(focusId)$('#'+focusId)?.focus?.({preventScroll:true});}
  function printHTML(){return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="'+E(new URL('.',location.href).href)+'"><title>Mis fichas · La Clase Rosa</title><link rel="stylesheet" href="custom-print.css?rev=8"><style>@page{size:A4 portrait;margin:0}</style></head><body class="custom-print-document"><div class="print-document-tools"><div class="print-document-actions"><button id="custom-print-button" disabled onclick="window.print()">Imprimir / Guardar PDF</button><button class="print-back-button" onclick="if(window.opener&&!window.opener.closed){window.opener.focus();window.close()}else{history.back()}">← Volver a la app</button></div><p>A4 · Escala 100 % · Sin cabeceras ni pies del navegador</p></div><div class="print-pages-screen">'+PLAY.printSheets(ui.print)+'</div><script src="custom-print-ready.js?rev=6"></script></body></html>';}
  function openPrint(){const win=window.open('','_blank');if(!win){toast('Permite la ventana de impresión y vuelve a intentarlo.');return;}win.document.open();win.document.write(printHTML());win.document.close();}
  function change(t){if(window.ROSA_SHEETS.change(t))return true;if(['aula-level','projection-level'].includes(t.id)){void setLevel(t.value);return true;}if(t.id==='story-picker'){chooseStory(t.value);return true;}if(t.id==='surprise-type'){stopVoice();state.projection.surpriseType=t.value;state.projection.surpriseOpen=false;state.projection.surpriseRevealed=false;projectionRender();return true;}if(t.dataset.printSetting){const key=t.dataset.printSetting;if(key in ui.print){ui.print[key]=['count','max'].includes(key)?Number(t.value):t.value;ui.printPage=0;refreshPrint(t.id);}return true;}return false;}
  function handle(action,value,target){
    if(window.ROSA_SHEETS.handle(action,value,target))return true;
    const handlers={
      'pdi-favorite':()=>toggleFavorite(value),'queue-toggle':()=>toggleQueue(value),'queue-up':()=>reorder(value,-1),'queue-down':()=>reorder(value,1),'session-start':startSession,'session-next':sessionNext,
      'pdi-resume':resume,'pdi-filter':()=>{ui.filter=value;render();},'aula-retry':retry,'speak':()=>speak(),'stop-voice':stopVoice,'voice-preview':()=>speak(true),
      'adventure-start':()=>startAdventure(value),'adventure-continue':()=>launch(ui.book.queue[0]||'contar'),'adventure-stop':()=>{ui.book.adventure={theme:'none',steps:0};saveSoon(['adventure']);refreshPage();},
      'pick-piece':()=>{if(Date.now()>ui.ignoreClick)selectPiece(value);},'place-piece':()=>{if(Date.now()>ui.ignoreClick)place(value);},
      'story-choice':()=>storyChoice(value),'story-back':()=>{if(state.projection.storyPath.length>1){stopVoice();state.projection.storyPath.pop();projectionRender();}},'story-restart':()=>chooseStory(state.projection.storyId),
      'surprise-open':()=>{state.projection.surpriseOpen=true;projectionRender();},'surprise-answer':()=>{state.projection.surpriseRevealed=true;projectionRender();},'workshop-tab':()=>{if(['proposito','rapidas'].includes(value)){ui.workshopTab=value;ui.printPage=0;render();}},
      'print-shuffle':()=>{ui.print.seed++;$('#print-preview-panel').innerHTML=printPreview();},'print-type':()=>{if(!printTypes.some(t=>t[0]===value))return;ui.print.type=value;ui.printPage=0;refreshPrint('print-type-'+value);},'print-page':()=>{ui.printPage+=Number(value);$('#print-preview-panel').innerHTML=printPreview();},'custom-print':openPrint,
      'session-close':()=>{close();$('#projector').close();state.projection=null;location.hash='pdi';render();}
    };if(!handlers[action])return false;void handlers[action]();return true;
  }
  function close(){remember();stopVoice();clearDrag();void save();}
  function init(){document.addEventListener('pointerdown',pointerDown);document.addEventListener('pointermove',pointerMove,{passive:false});document.addEventListener('pointerup',pointerUp);document.addEventListener('pointercancel',clearDrag);window.addEventListener('pagehide',()=>{remember();void save();stopVoice();});void load();}
  return {announce,ui,init,load,save,retry,level,isObjective,setup,launch,resume,next,setLevel,remember,cardTools,pdiNav,pdiPage,pdiProjectsPage,pdiSpecialDaysPage,pdiGamesPage,toolbar,footer,afterRender,won,custom,change,handle,close,stopVoice,feedbackVoice,workshop,printHTML,validMemory,validStoryPath,selectPiece,place,storyChoice,snapshot};
})();
