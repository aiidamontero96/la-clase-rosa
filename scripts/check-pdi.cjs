// Exercise rules, persistence and event handlers without opening a browser.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),publicDir=path.join(root,'public');
const manifest=JSON.parse(fs.readFileSync(path.join(publicDir,'materials.json'),'utf8'));
const blank=()=>({version:1,favorites:[],queue:[],level:2,cursors:{},last:null,adventure:{theme:'none',steps:0}});
let persisted=blank(),failSave=false,failLoad=false,spoken=[],cancelled=0,printed='';
const elements=new Map(),listeners={},voiceListeners={},stored=new Map();
function element(key){if(!elements.has(key))elements.set(key,{innerHTML:'',textContent:'',style:{setProperty(){}},dataset:{},value:'',open:false,disabled:false,classList:{add(){},remove(){},toggle(){}},focus(){},scrollIntoView(){},setAttribute(){},removeAttribute(){},addEventListener(){},appendChild(){},querySelector:element,querySelectorAll:()=>[],remove(){},getBoundingClientRect:()=>({width:100,height:100}),cloneNode:()=>element('ghost'),showModal(){this.open=true;},close(){this.open=false;}});return elements.get(key);}
const document={querySelector:element,querySelectorAll:()=>[],createElement:tag=>element(tag),body:element('body'),addEventListener:(type,fn)=>(listeners[type]??=[]).push(fn),elementFromPoint:()=>({closest:()=>({dataset:{slot:'0'}})}),elementsFromPoint:()=>[{closest:()=>({dataset:{slot:'0'}})}]};
const window={addEventListener(){},scrollTo(){},scrollY:0,setTimeout,SpeechSynthesisUtterance:function(text){this.text=text;},speechSynthesis:{getVoices:()=>[{lang:'es-ES',name:'Español'}],addEventListener:(type,fn)=>voiceListeners[type]=fn,cancel(){cancelled++;},speak(utterance){spoken.push(utterance);}},open:()=>({document:{open(){},write(html){printed=html;},close(){}},opener:window})};
const context=vm.createContext({window,document,location:{hash:'#pdi',href:'https://rosa.example/'},URL,URLSearchParams,localStorage:{getItem:key=>stored.get(key)||null,setItem:(key,value)=>stored.set(key,value)},setTimeout:()=>0,clearTimeout(){},requestAnimationFrame:fn=>fn(),console,fetch:async(url,options={})=>{if(url!=='/api/aula')return {ok:true,json:async()=>manifest};if(options.method==='PUT'){if(failSave)return {ok:false};persisted=JSON.parse(options.body);return {ok:true,json:async()=>({saved:true})};}if(failLoad)return {ok:false};return {ok:true,json:async()=>({book:JSON.parse(JSON.stringify(persisted))})};}});
for(const file of ['data.js','pdi.js','play-content.js','sheet-content.js','sheet-studio.js','aula.js','classroom.js','app.js'])vm.runInContext(fs.readFileSync(path.join(publicDir,file),'utf8'),context,{filename:file});
const run=source=>vm.runInContext(source,context),json=source=>JSON.parse(run('JSON.stringify('+source+')')),drain=()=>new Promise(resolve=>setImmediate(resolve));
async function action(name,value=''){run('A.handle('+JSON.stringify(name)+','+JSON.stringify(value)+',{})');await drain();}
(async()=>{
  await run('A.load()');assert.equal(run('A.ui.loaded'),true);
  for(let level=1;level<=4;level++)for(const kind of run('window.ROSA_PDI.games.map(g=>g[0])'))for(let n=0;n<30;n++){
    const r=json('window.ROSA_PDI.round('+JSON.stringify(kind)+','+n+',true,'+level+')');if(!r)continue;assert(r.options.some(o=>o.value===r.answer));assert.equal(new Set(r.options.map(o=>o.value)).size,r.options.length);
    if(['cantidades','juntar','siguiente'].includes(kind)){assert(Number(r.answer)<=[3,6,10,12][level-1]);if(level===1)assert.equal(r.options.length,2);if(level>=3)assert.equal(r.options.length,4);}
    if(kind==='juntar')assert.equal((r.visual.match(/class="pdi-emoji /g)||[]).length,Number(r.answer));
  }
  await action('pdi-favorite','puzzle');await run('A.save()');assert.deepEqual(persisted.favorites,['puzzle']);
  for(const id of ['contar','vocales','memory','cuento'])await action('queue-toggle',id);assert.equal(run('A.ui.book.queue.length'),4);
  await action('queue-up','memory');assert.deepEqual(json('A.ui.book.queue'),['contar','memory','vocales','cuento']);
  await action('session-start');assert.equal(run('state.projection.kind'),'contar');assert.equal(run('A.ui.session.index'),0);
  await action('session-next');assert.equal(run('state.projection.kind'),'memory');assert.equal(run('A.ui.session.index'),1);
  await run('A.setLevel(1)');assert.equal(run('state.projection.memory.length'),4);
  const deck=json('state.projection.memory'),same=deck.map((v,i)=>v===deck[0]?i:null).filter(v=>v!==null);run('memoryFlip('+same[0]+');memoryFlip('+same[1]+')');await run('A.save()');const snapshot=JSON.stringify(persisted.last);
  run('state.projection=null');await run('A.resume()');assert.equal(JSON.stringify(json('A.snapshot(state.projection)')),snapshot);assert.equal(run('state.projection.matched.length'),2);
  await action('session-next');await action('session-next');await action('session-next');assert.equal(run('state.projection.kind'),'session-end');assert.equal(run('A.ui.book.last'),null);
  for(const id of ['cestas','parejas','cantidades','comparar','juntar'])await action('queue-toggle',id);assert.equal(run('A.ui.book.queue.length'),8);assert.equal(run("A.ui.book.queue.includes('juntar')"),false);
  run("A.ui.book.adventure={theme:'jardin',steps:0}");await run('A.launch("contar",{round:0})');
  for(let i=0;i<7;i++){context.target={dataset:{value:run('state.projection.answer')},classList:{add(){},remove(){}}};run('answer(target);answer(target)');assert.equal(run('A.ui.book.adventure.steps'),Math.min(i+1,6));if(i<6)run('A.next()');}
  assert(element('#game-feedback').innerHTML.includes('pdi-happy-face'));
  for(const kind of ['puzzle','ordenar-piezas','cestas','ordena-numeros','ordena-historia'])for(let level=1;level<=4;level++){
    await run('A.setLevel('+level+')');await run('A.launch('+JSON.stringify(kind)+',{round:2})');const pieces=json('state.projection.drop.pieces'),goal=run('state.projection.drop.goal');
    run('A.selectPiece("0");A.place("99")');assert.equal(run('Object.keys(state.projection.drop.placed).length'),0);
    for(const piece of pieces.slice(0,goal))run('A.selectPiece('+JSON.stringify(piece.id)+');A.place('+JSON.stringify(piece.slot)+')');
    assert.equal(run('state.projection.answered'),true,kind+' completes');assert(element('#piece-feedback').innerHTML.includes('pdi-happy-face'));
    await run('A.save()');const before=json('state.projection.drop.placed');await run('A.resume()');assert.deepEqual(json('state.projection.drop.placed'),before);
  }
  await run('A.launch("puzzle",{round:0})');const pointer={pointerId:1,clientX:10,clientY:10,button:0,target:{closest:()=>({...element('piece'),dataset:{piece:'0'}})},preventDefault(){}};
  listeners.pointerdown[0](pointer);listeners.pointermove[0]({...pointer,clientX:30,clientY:30});listeners.pointerup[0]({...pointer,clientX:40,clientY:40});assert.equal(run('state.projection.drop.placed["0"]'),'0','Pointer drag must use the same placement rule');
  const stories=json('window.ROSA_PLAY.stories');let endings=0;
  for(const story of stories){
    const visit=(id,path=[])=>{const node=story.nodes[id];assert(node);assert(!path.includes(id));if(!node.choices){endings++;assert(node.question);return;}assert.equal(node.choices.length,2);for(const choice of node.choices)visit(choice[2],[...path,id]);};visit('inicio');
    await run('A.launch("cuento",{round:0})');context.storySelect={id:'story-picker',value:story.id,dataset:{}};run('A.change(storySelect)');
    const first=story.nodes.inicio.choices[0][2];run('A.storyChoice('+JSON.stringify(first)+')');await run('A.save()');await run('A.resume()');assert.equal(run('state.projection.storyPath[1]'),first);
    const end=story.nodes[first].choices[0][2];run('A.storyChoice('+JSON.stringify(end)+')');assert(element('#projection-content').innerHTML.includes('¡Un cuento compartido!'));
  }assert.equal(endings,12);
  await run('A.launch("sorpresa",{round:0})');assert(element('#projection-content').innerHTML.includes('surprise-box'));await action('surprise-open');assert(element('#projection-content').innerHTML.includes('Descubrir respuesta'));await action('surprise-answer');assert(element('#projection-content').innerHTML.includes('surprise-answer'));run('A.next()');assert.equal(run('state.projection.surpriseOpen'),false);
  assert.deepEqual(json('window.ROSA_SHEETS.getRoster()'),['Tristán','Sergio','Alejandro','Marcelo','Alma','Francisco','Abril','Martín','Emma','Álvaro','José Antonio','Mohammed']);
  assert(!run('window.ROSA_SHEETS.panel()').includes('data-roster-index'));
  run("window.ROSA_SHEETS.ui.mode='dino';window.ROSA_SHEETS.ui.dinoType='conocer'");assert(!run('window.ROSA_SHEETS.panel()').includes('>Nivel<'));
  run("window.ROSA_SHEETS.ui.dinoType='contar'");assert(run('window.ROSA_SHEETS.panel()').includes('>Nivel<'));
  for(let n=0;n<9;n++){await run('A.launch("dino",{round:'+n+'})');const html=element('#projection-content').innerHTML;assert(html.includes('pdi-dino-presentation'));assert(html.includes(run('D.dinosaurs['+n+'].short')));assert(html.includes('assets/dinos-pdi/'+run('D.dinosaurs['+n+'].id')+'.webp'));}
  // Generador actual: cantidades válidas 4, 6 y 8. Probamos 6.
  for(const theme of ['Números','Formas','Animales','Naturaleza','Emociones','Dinosaurios'])for(const type of ['contar','memory','series','tarjetas'])for(const size of ['grande','mediana','pequena']){
    const settings={theme,type,size,count:6,max:10,ink:'bn',pattern:'ABC',seed:1};
    const cards=json('window.ROSA_PLAY.printCards('+JSON.stringify(settings)+')');
    assert.equal(cards.length,6,theme+' / '+type+' must create six cards');
    const html=run('window.ROSA_PLAY.printSheets('+JSON.stringify(settings)+')');
    const sheets=(html.match(/class=\"print-sheet /g)||[]).length;
    const renderedCards=(html.match(/class=\"custom-print-card\"/g)||[]).length;
    assert(sheets>=1,theme+' / '+type+' must create at least one sheet');
    assert.equal(renderedCards,cards.length,theme+' / '+type+' must render every card');
    for(const match of html.matchAll(/src=\"([^\"]+)\"/g))assert(fs.existsSync(path.join(publicDir,match[1])),match[1]);
    if(type==='memory'){
      const counts=new Map();for(const card of cards)counts.set(card,(counts.get(card)||0)+1);
      assert.equal(counts.size,3,theme+' three distinct memory pictures');
      assert([...counts.values()].every(v=>v===2),theme+' every memory picture must appear twice');
    }
    if(type==='contar'){assert(html.includes('count-ten'),theme+' counting sheet must use count-ten layout');for(const card of cards)assert.equal((card.match(/<img /g)||[]).length,10);}
    if(type==='series')assert(!html.includes('print-cutouts'),theme+' series must not include cutouts');
  }
  await action('custom-print');assert(/custom-print\.css\?rev=\d+/.test(printed));assert(printed.includes('Imprimir / Guardar PDF'));assert(printed.includes('Volver a la app'));assert(printed.includes('<base href="https://rosa.example/">'));
  failSave=true;await action('pdi-favorite','cestas');await run('A.save()');assert.equal(run('A.ui.saveError'),true);assert.equal(run('A.ui.dirty'),true);failSave=false;await run('A.retry()');assert.equal(run('A.ui.saveError'),false);assert(persisted.favorites.includes('cestas'));
  persisted=blank();persisted.favorites=['memory'];failLoad=true;run("A.ui.loaded=false;A.ui.book={version:1,favorites:[],queue:[],level:2,cursors:{},last:null,adventure:{theme:'none',steps:0}};A.ui.dirty=false;A.ui.pendingFields.clear();A.ui.favoriteOps.clear()");await action('pdi-favorite','cestas');failLoad=false;await run('A.retry()');assert.deepEqual([...persisted.favorites].sort(),['cestas','memory'],'Recovery must preserve unseen saved favorites');
  console.log(JSON.stringify({levels:4,sessions:'8 games passed',resume:'passed',adventures:'passed',pieceGames:5,storyEndings:12,printLayouts:48,saveRetry:'passed'}));
})().catch(error=>{console.error(error);process.exitCode=1;});
