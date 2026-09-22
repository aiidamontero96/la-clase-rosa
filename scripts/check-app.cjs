// SANEAMIENTO TESTS + DIAGNÓSTICO V3 · 2026-09-22
// Logic and asset checks without starting or inspecting a browser.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'public');
const manifest=JSON.parse(fs.readFileSync(path.join(dist,'materials.json'),'utf8'));
const elements=new Map(),listeners={},storage=new Map();
function element(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',open:false,disabled:false,checked:false,className:'',dataset:{},style:{setProperty(){}},classList:{add(){},remove(){},toggle(){return false;},contains(){return false;}},setAttribute(){},removeAttribute(){},getAttribute(){return null;},addEventListener(){},insertAdjacentHTML(position,html){html=String(html);this.innerHTML=position==='afterbegin'?html+this.innerHTML:this.innerHTML+html;},querySelector(selector){return element(id+' '+selector);},querySelectorAll(){return[];},appendChild(child){return child;},remove(){},focus(){},blur(){},scrollIntoView(){},showModal(){this.open=true;},close(){this.open=false;},getBoundingClientRect(){return {left:0,top:0,right:100,bottom:100,width:100,height:100};},cloneNode(){return element(id+' clone');},closest(){return null;},setPointerCapture(){},releasePointerCapture(){}});return elements.get(id);}
const document={querySelector:element,querySelectorAll(){return[];},getElementById:element,createElement(tag){return element('created:'+tag);},body:element('body'),fullscreenElement:null,webkitFullscreenElement:null,elementFromPoint(){return null;},exitFullscreen(){return Promise.resolve();},addEventListener(type,fn){(listeners[type]??=[]).push(fn);}};
const window={addEventListener(){},scrollTo(){},scrollY:0,setTimeout(){return 0;},AudioContext:null,webkitAudioContext:null};
const context=vm.createContext({document,window,location:{hash:'',href:'https://example.test/'},URL,URLSearchParams,CSS:{escape:value=>String(value)},requestAnimationFrame:fn=>{fn();return 1;},cancelAnimationFrame(){},getComputedStyle:()=>({}),localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},fetch:async()=>({ok:true,json:async()=>manifest}),setTimeout:()=>0,clearTimeout(){},console});
for(const file of ['data.js','pdi.js','play-content.js','sheet-content.js','sheet-studio.js','aula.js','rosi-config.js','rosi-media.js','rosi-episode.js','rosi-missions.js','classroom.js','pdi-scenes.js','app.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const run=code=>vm.runInContext(code,context);
const data=JSON.parse(run('JSON.stringify(D)'));
assert.equal(Object.values(data.questionGroups).flat().length,100);
assert(data.vocab.length>=36);run('state.wordBag=[];state.lastWord=-1');const firstWordCycle=new Set();for(let i=0;i<data.vocab.length;i++){run('nextRandomWord()');firstWordCycle.add(run('state.projection.round'));}assert.equal(firstWordCycle.size,data.vocab.length);
assert.equal(data.challenges.length,50);assert.equal(data.resources.length,159);
assert.equal(new Set(data.resources.map(r=>r.id)).size,159);
const printables=data.resources.filter(r=>r.printable);assert.equal(printables.length,90);
const kusama=data.resources.filter(r=>r.project==='Yayoi Kusama');assert.equal(kusama.length,28);
const kusamaActivities=kusama.filter(r=>!r.printable),kusamaPrintables=kusama.filter(r=>r.printable);assert.equal(kusamaActivities.length,19);assert.equal(kusamaPrintables.length,9);
assert.equal(data.kusamaStages.length,3);assert.equal(new Set(data.kusamaStages.flatMap(s=>s[3])).size,17);
for(const id of data.kusamaStages.flatMap(s=>s[3]))assert(kusamaActivities.some(r=>r.id===id),id);
for(const r of data.resources){assert(r.objective&&r.preparation&&r.steps.length>=3&&r.materials.length&&r.easy&&r.extend,r.id);for(const id of r.related||[])assert(data.resources.some(x=>x.id===id),r.id+' related '+id);}
for(const r of data.resources.filter(r=>!r.printable)){
  run('state.dialogId='+JSON.stringify(r.id)+';resourceDialog()');const html=element('#dialog-content').innerHTML;
  assert(html.includes('Materiales exactos'),r.id+' needs exact materials');
  const hasPrintable=(r.related||[]).some(id=>data.resources.find(item=>item.id===id)?.printable);
  assert(html.includes(hasPrintable?'Material imprimible opcional':'No necesita material imprimible'),r.id+' printable status');
}
// KUSAMA · ACTIVIDADES REALES VS IMPRIMIBLES RECLASIFICADOS · 2026-09-22
const kusamaVisualActivities=kusamaActivities.filter(r=>!r.classroomFormerPrintable);
const kusamaFormerPrintables=kusamaActivities.filter(r=>r.classroomFormerPrintable);
assert.equal(kusamaVisualActivities.length,17);
assert.deepEqual(kusamaFormerPrintables.map(r=>r.id).sort(),['kusama-espacios','kusama-flores']);
for(const r of kusamaVisualActivities){
  assert(r.example,r.id+' example');
  assert(fs.existsSync(path.join(dist,'assets','kusama',r.id+'.webp')),r.id+' image');
}
for(const r of kusamaFormerPrintables){
  assert(fs.existsSync(path.join(dist,'previews',r.id+'.webp')),r.id+' preview');
}
assert(printables.every(r=>r.coloring),'all printables must offer outline mode');
for(const r of printables){const m=manifest[r.id];assert(m,r.id);for(const file of [m.pdf,m.bw,m.preview,m.coloring])assert(fs.statSync(path.join(dist,file)).size>100,file);for(let p=1;p<=m.pages;p++)for(const ink of ['','-bn','-colorear'])assert(fs.statSync(path.join(dist,'pages',r.id+ink+'-'+p+'.jpg')).size>100);}
for(let i=0;i<100;i++){run('todayNew()');assert.equal(run('new Set(state.today).size'),6);}
run("state.filter={age:'4',area:'',type:'',project:'',q:'FOSIL'}");assert(run("R.filter(r=>matches(r,'banco')).length")>0);
// KUSAMA · CONTEO BANCO 28 · 2026-09-22
run("state.filter={age:'4',area:'',type:'',project:'Yayoi Kusama',q:''}");
assert.equal(run("R.filter(r=>matches(r,'banco')).length"),kusama.length);
assert(run("bank('banco')").includes(kusama.length+' recursos'));
run("state.filter={age:'4',area:'',type:'',project:'',q:''};state.favorites.add('memory-dino')");assert.equal(run("R.filter(r=>matches(r,'favoritos')).length"),1);
run("state.filter.type='PDI'");
const pdiBankHtml=run("bank('banco')");
const pdiBankMatch=pdiBankHtml.match(/<span role="status">(\d+) recursos/);
assert(pdiBankMatch,'PDI result count');
const pdiBankCount=Number(pdiBankMatch[1]);
assert.equal(pdiBankCount,run('GAMES.length'));
assert.equal(pdiBankCount,(pdiBankHtml.match(/class="game-tile"/g)||[]).length);
run("state.filter.area='Matemáticas'");
const mathPdiHtml=run("bank('banco')");
const mathPdiMatch=mathPdiHtml.match(/<span role="status">(\d+) recursos/);
assert(mathPdiMatch,'Matemáticas PDI result count');
const mathPdiCount=Number(mathPdiMatch[1]);
assert(mathPdiCount>0,'Matemáticas PDI must expose at least one game');
assert.equal(mathPdiCount,(mathPdiHtml.match(/class="game-tile"/g)||[]).length);
run("state.filter={area:'',type:'',project:'',q:''}");const printBank=run("bank('imprimibles')");assert(!printBank.includes('filter-age'));assert(!printBank.includes('>Experimento<'));assert(printBank.includes('Todos los proyectos'));assert(printBank.includes('Yayoi Kusama'));
const homeHtml=run('home()');assert.equal((homeHtml.match(/assembly-home-step/g)||[]).length,6);assert(homeHtml.includes('Entre huellas y dinosaurios'));assert(homeHtml.includes('El mundo de Yayoi Kusama'));assert(!homeHtml.includes('dino-lapiz.png'));
assert(!run('nav();home()').includes('#semana'));assert(!element('#navigation').innerHTML.includes('#semana'));assert(!element('#navigation').innerHTML.includes('#asamblea'));assert(element('#navigation').innerHTML.includes('#kusama'));
for(const route of ['inicio','asamblea','matematicas','lenguaje','logica','motricidad','arte','movimiento','juegos','imprimibles','pdi','taller','dinosaurios','kusama','curso','favoritos','hoy','semana','banco']){context.location.hash='#'+route;run('resetForRoute()');assert(element('#contenido').innerHTML.length>200,route);}
for(const tab of ['ruta','aventuras','especies','ciencia','matematicas','lenguaje','juegos','taller','rincon','todos']){run('state.dinoTab='+JSON.stringify(tab));assert(run('dinosaurs()').length>1000,tab);}
for(const tab of ['conocer','ruta','imprimibles','puntos','formas','espacios','lenguaje','todos']){run('state.kusamaTab='+JSON.stringify(tab));const html=run('kusama()');assert(html.length>1000,tab);assert(!html.includes('undefined'),tab);if(tab==='conocer'){assert(html.includes('9z6geQASZiY'));assert(!html.includes('tienda.grupo-sm.com'));assert(!html.includes('kusama-book-file'));}}
for(const game of run('GAMES.map(g=>g[0])')){run('startProjection('+JSON.stringify(game)+')');for(let n=0;n<12;n++){run('state.projection.round='+n+';projectionRender()');const html=element('#projection-content').innerHTML;assert(!html.includes('undefined'),game);assert(html.length>300,game);const expected=run('state.projection.answer');if(expected!==null)assert(html.includes('data-value="'+expected+'"'),game+' answer missing');}}
for(const pattern of ['AB','AAB','ABB','ABC','AABB']){run("startProjection('series');state.projection.pattern="+JSON.stringify(pattern));const answers=new Set();for(let n=0;n<9;n++){run('state.projection.round='+n+';projectionRender()');answers.add(run('state.projection.answer'));}assert(answers.size>1,pattern+' needs varied rounds');}
run("startProjection('memory')");const deck=run('state.projection.memory');for(let id=0;id<4;id++){const indices=Array.from(deck).flatMap((v,i)=>v===id?[i]:[]);assert.equal(indices.length,2);run('memoryFlip('+indices[0]+')');assert.equal(run('state.projection.pairCelebration'),false);run('memoryFlip('+indices[1]+')');assert.equal(run('state.projection.pairCelebration'),true);assert(element('#projection-content').innerHTML.includes('pdi-happy-face'));}assert.equal(run('state.projection.matched.length'),8);assert(element('#projection-content').innerHTML.includes('¡Lo habéis conseguido!'));
const round=(kind,n=0,hidden=false)=>JSON.parse(run('JSON.stringify(window.ROSA_PDI.round('+JSON.stringify(kind)+','+n+','+hidden+'))'));
const newGames=run('window.ROSA_PDI.games.map(g=>g[0])');
assert(newGames.length>0,'ROSA_PDI must expose games');
assert.equal(new Set(newGames).size,newGames.length,'ROSA_PDI game ids must be unique');
const allGameIds=run('GAMES.map(g=>g[0])');
assert.equal(new Set(allGameIds).size,allGameIds.length,'GAMES ids must be unique');
for(const id of newGames)assert(allGameIds.includes(id),id+' must be registered in GAMES');
const allowedCostumes=['VAMPIRO','DIABLO','ESQUELETO','ASTRONAUTA','BOMBERO','ABEJA','DINOSAURIO','PAYASO','PINOCHO','POLICÍA','RANA','ÁRBOL','PLÁTANO','BURRO','CANGREJO','ELEFANTE','FLAMENCA'];
assert.deepEqual(Array.from({length:allowedCostumes.length},(_,n)=>round('disfraces',n).answer),allowedCostumes);
for(let n=0;n<allowedCostumes.length;n++){const costumeRound=round('disfraces',n);assert.equal(costumeRound.options.length,3);assert(costumeRound.options.every(option=>allowedCostumes.includes(option.value)));}
for(const kind of newGames){
  const answerPositions=new Set();
  for(let n=0;n<36;n++){
    const r=round(kind,n),revealed=round(kind,n,true);
    assert.deepEqual(round(kind,n),r,kind+' must stay stable on retry');
    assert.equal(revealed.answer,r.answer,kind+' reveal must keep the answer');
    assert.equal(r.options.filter(o=>o.value===r.answer).length,1,kind+' has one answer');
    assert.equal(new Set(r.options.map(o=>o.value)).size,r.options.length,kind+' unique choices');
    answerPositions.add(r.options.findIndex(o=>o.value===r.answer));
    if(kind==='cantidades')for(const o of r.options)assert.equal((o.label.match(/class="pdi-emoji /g)||[]).length,Number(o.value));
    if(kind==='juntar')assert.equal((r.visual.match(/class="pdi-emoji /g)||[]).length,Number(r.answer));
    if(kind==='comparar'){const values=r.options.map(o=>Number(o.value));assert.notEqual(values[0],values[1]);assert.equal(Number(r.answer),r.prompt.includes('más')?Math.max(...values):Math.min(...values));assert(values.every(v=>v>=1&&v<=6));}
    if(kind==='siguiente'){const shown=[...r.visual.matchAll(/class="pdi-wagon">(\d)/g)].map(m=>Number(m[1]));assert.equal(shown[1],shown[0]+1);assert.equal(Number(r.answer),shown[1]+1);assert(Number(r.answer)<=6);}
  }
  assert(answerPositions.size>1,kind+' must not always use the same correct button');
}
assert.equal(round('silabas',0).answer,'1');assert.equal(round('silabas',1).answer,'2');assert.equal(round('silabas',2).answer,'3');assert.equal(round('silabas',3).answer,'4');
assert.deepEqual(Array.from({length:5},(_,n)=>round('vocales',n).answer),['A','E','I','O','U']);
function answerTarget(value){return {dataset:{value},classList:{add(){},remove(){}}};}
for(const kind of ['contar','series','falta','intruso','clasificar','letras','verdadero',...newGames]){
  run('startProjection('+JSON.stringify(kind)+');state.projection.hidden=true;projectionRender()');
  const expected=run('state.projection.answer');assert.notEqual(expected,null,kind);
  context.wrong=answerTarget('not-a-choice');run('answer(wrong)');assert.equal(run('state.projection.answered'),false);assert(element('#game-feedback').textContent.includes('probar otra opción'));
  context.correct=answerTarget(expected);run('answer(correct)');assert.equal(run('state.projection.answered'),true);const success=element('#game-feedback').innerHTML;assert(success.includes('pdi-happy-face')&&success.includes('pdi-star'),kind+' needs visible celebration');
  run('answer(wrong)');assert.equal(element('#game-feedback').innerHTML,success,kind+' keeps its success until the next turn');
  const target={dataset:{action:'projection-next',value:''}};for(const listener of listeners.click||[])listener({target:{closest:()=>target},preventDefault(){}});
  assert.equal(run('state.projection.answered'),false);assert.equal(run('state.projection.round'),1);assert(!element('#projection-content').innerHTML.includes('pdi-celebration'));
}
run("startProjection('orden')");assert.equal(run('state.projection.answer'),null);assert(element('#projection-content').innerHTML.includes('Ya miramos. Tapar'));run('state.projection.hidden=true;projectionRender()');assert(element('#projection-content').innerHTML.includes('Dibujo tapado'));assert.notEqual(run('state.projection.answer'),null);
for(const pattern of ['AB','AAB','ABB','ABC','AABB'])for(const theme of run('Object.keys(PATTERN_THEMES)'))for(const task of ['continuar','copiar','falta']){run('Object.assign(patternState,'+JSON.stringify({pattern,theme,task})+')');const html=run('patternMarkup()');assert(html.includes('Espacio para completar'));for(const match of html.matchAll(/src="([^"]+)"/g))assert(fs.existsSync(path.join(dist,match[1])),match[1]);}
const patternWorkshopHTML=run('patternWorkshop()');assert(patternWorkshopHTML.includes('Imprimir 6 series'));assert(patternWorkshopHTML.includes('Series por folio'));assert(patternWorkshopHTML.includes('pattern-a4-preview'));for(const count of [4,6,8])assert(patternWorkshopHTML.includes('value="'+count+'"'));for(const count of [5,7])assert(!patternWorkshopHTML.includes('value="'+count+'"'));assert(patternWorkshopHTML.includes('MIX · Una serie de cada tipo'));assert(!fs.readFileSync(path.join(dist,'app.js'),'utf8').includes('Piezas para recortar'));
const courseIds=['otono','halloween','navidad','paz','carnaval','andalucia','primavera','libro','fin'].map(x=>'curso-'+x);for(const id of courseIds){const item=data.resources.find(r=>r.id===id);assert(item?.printable,id);assert.equal(manifest[id].pages,2,id+' pages');}
const courseExtraIds=['otono-hoja','halloween-calabaza','halloween-busca','navidad-arbol','navidad-bolas','paz-corazon','carnaval-disfraz','andalucia-28f','primavera-mariposa','libro-marcapaginas','fin-retrato'].map(x=>'curso-'+x);for(const id of courseExtraIds){const item=data.resources.find(r=>r.id===id);assert(item?.printable,id);assert.equal(manifest[id].pages,1,id+' pages');}for(const id of ['curso-otono-hoja','curso-halloween-calabaza','curso-navidad-arbol','curso-navidad-bolas','curso-andalucia-28f','curso-primavera-mariposa','curso-libro-marcapaginas'])assert(manifest[id].coloring,id+' coloring pdf');const courseHtml=run('course()');for(const id of [...courseIds,...courseExtraIds])assert(courseHtml.includes('data-value="'+id+'"'),id+' visible in course');assert(!courseHtml.includes('Flamenco'));assert(courseHtml.includes('<details class="year-printables">'));assert(courseHtml.includes('3 imprimibles'));
for(const id of ['carnaval-cuatro-actividades','primavera-actividades'])assert(courseHtml.includes('data-value="'+id+'"'),id+' visible in course');
run("startProjection('nombre-escribe',0)");assert(element('#projection-content').innerHTML.includes('TRISTÁN'));run('state.projection.hidden=true;projectionRender()');assert(element('#projection-content').innerHTML.includes('Busca las letras en orden'));[...'TRISTÁN'].forEach((letter,index)=>{const target={dataset:{action:'name-letter',value:index+'|'+encodeURIComponent(letter)}};for(const listener of listeners.click||[])listener({target:{closest:()=>target},preventDefault(){}});});assert.equal(run('state.projection.answered'),true);assert(element('#projection-content').innerHTML.includes('Nombre completo'));
run("startProjection('asistencia');state.projection.counts={present:9,absent:3,girls:4,boys:5};state.projection.attendanceStep='count';state.projection.counts={present:0,absent:0,girls:0,boys:0};projectionRender()");assert.deepEqual(JSON.parse(run('JSON.stringify(state.projection.counts)')),{present:0,absent:0,girls:0,boys:0});assert(element('#projection-content').innerHTML.includes('Empieza todo en cero'));
assert.equal(run('Object.keys(window.ROSA_PLAY.themes).length'),12);assert(run('window.ROSA_SHEETS.panel()').includes('Fichas con un propósito'));assert.deepEqual(JSON.parse(run('JSON.stringify(window.ROSA_SHEETS.getRoster().slice(0,12))')),['Tristán','Sergio','Alejandro','Marcelo','Alma','Francisco','Abril','Martín','Emma','Álvaro','José Antonio','Mohammed']);
for(const mode of ['nombre','dino','pensar']){run('window.ROSA_SHEETS.ui.mode='+JSON.stringify(mode));const studio=run('window.ROSA_SHEETS.sheet()');assert(studio.includes('studio-sheet'));assert(!studio.includes('undefined'),mode);}
run('Object.assign(window.ROSA_SHEETS.ui,{mode:"dino",ink:"coloring"})');const outlineStudio=run('window.ROSA_SHEETS.sheet()');assert(outlineStudio.includes('studio-outline'));assert(outlineStudio.includes('-outline.'));
for(const type of ['repasar','inicial','letras','contar']){run('Object.assign(window.ROSA_SHEETS.ui,{mode:"nombre",nameType:'+JSON.stringify(type)+'})');assert(run('window.ROSA_SHEETS.sheet()').length>500,type);}
for(const type of ['conocer','camino','encuentra','contar']){run('Object.assign(window.ROSA_SHEETS.ui,{mode:"dino",dinoType:'+JSON.stringify(type)+'})');assert(run('window.ROSA_SHEETS.sheet()').length>500,type);}
for(const type of ['intruso','sombras','busca','clasifica']){run('Object.assign(window.ROSA_SHEETS.ui,{mode:"pensar",thinkType:'+JSON.stringify(type)+'})');assert(run('window.ROSA_SHEETS.sheet()').length>500,type);}
assert(run('window.ROSA_SHEETS.printHTML()').includes('Volver a la app'));
let patternPrint='';context.patternPopup={document:{open(){},write(html){patternPrint=html;},close(){}},opener:{}};run("window.open=()=>patternPopup;Object.assign(patternState,{pattern:'AAB',theme:'Formas',task:'continuar',count:8,ink:'coloring'});printPattern()");assert.equal((patternPrint.match(/class="pattern-exercise"/g)||[]).length,8);assert.equal((patternPrint.match(/class="workshop-cell"/g)||[]).length,64);assert(patternPrint.includes('--pattern-count:8;--pattern-items:8'));assert(patternPrint.includes('pattern-coloring'));assert(patternPrint.includes('pattern-count-8'));assert(patternPrint.includes('vector-shape'));assert(patternPrint.includes('<polygon class="shape-fill"'));assert(!/class="[^"]*\striangle(?:\s|")/.test(patternPrint));assert(!patternPrint.includes('recort'));assert(/refinements\.css\?rev=\d+/.test(patternPrint));
run("Object.assign(patternState,{count:4,pattern:'AB',task:'continuar'});patternPrint='';printPattern()");assert.equal((patternPrint.match(/class="pattern-exercise"/g)||[]).length,4);assert.equal((patternPrint.match(/class="workshop-cell"/g)||[]).length,24);assert(patternPrint.includes('--pattern-items:6'));
assert(patternPrint.includes('Volver a Matemáticas'));assert(!patternPrint.includes('win.opener=null'));
const customPrint=run('window.ROSA_AULA.printHTML()');assert(customPrint.includes('Volver a la app'));assert(customPrint.includes('window.opener.focus()'));
assert.equal(run("escapeHTML('<script>')"),'&lt;script&gt;');
console.log(JSON.stringify({resources:data.resources.length,kusamaActivities:kusamaActivities.length,kusamaPrintables:kusamaPrintables.length,printables:printables.length,coloringPrintables:printables.filter(r=>r.coloring).length,questions:Object.values(data.questionGroups).flat().length,challenges:data.challenges.length,pdiModes:run('GAMES.length'),newPdiGames:newGames.length,checks:'passed'}));
