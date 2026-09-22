const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),nodes=new Map(),storage=new Map();
function el(s){if(!nodes.has(s))nodes.set(s,{innerHTML:'',textContent:'',value:'',open:false,disabled:false,checked:false,className:'',dataset:{},style:{setProperty(){}},classList:{add(){},remove(){},toggle(){return false;},contains(){return false;}},setAttribute(){},removeAttribute(){},getAttribute(){return null;},addEventListener(){},insertAdjacentHTML(position,html){html=String(html);this.innerHTML=position==='afterbegin'?html+this.innerHTML:this.innerHTML+html;},querySelector(selector){return el(s+' '+selector);},querySelectorAll(){return[];},appendChild(child){return child;},remove(){},focus(){},blur(){},scrollIntoView(){},showModal(){this.open=true;},close(){this.open=false;},getBoundingClientRect(){return {left:0,top:0,right:100,bottom:100,width:100,height:100};},cloneNode(){return el(s+' clone');},closest(){return null;},setPointerCapture(){},releasePointerCapture(){}});return nodes.get(s);}
const document={querySelector:el,querySelectorAll(){return[];},getElementById:el,createElement(tag){return el('created:'+tag);},body:el('body'),fullscreenElement:null,elementFromPoint(){return null;},addEventListener(){}},window={addEventListener(){},scrollTo(){},setTimeout(){return 0;},AudioContext:null,webkitAudioContext:null};
const c=vm.createContext({window,document,console,URL,URLSearchParams,CSS:{escape:value=>String(value)},requestAnimationFrame:fn=>{fn();return 1;},cancelAnimationFrame(){},location:{hash:'#dinosaurios',href:'https://rosa.example/'},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},setTimeout(){},clearTimeout(){},fetch:async url=>({ok:url!=='/api/aula',json:async()=>JSON.parse(fs.readFileSync(path.join(root,'public/materials.json'),'utf8'))})});
const run=s=>vm.runInContext(s,c),json=s=>JSON.parse(run('JSON.stringify('+s+')'));
for(const f of ['data.js','pdi.js','play-content.js','sheet-content.js','sheet-studio.js','audio/pdi/manifest.js','pdi-voice.js','aula.js','rosi-missions-voice.js','rosi-missions.js','rosi-config.js','rosi-media.js','rosi-episode.js','classroom.js','pdi-scenes.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,'public',f),'utf8'),c,{filename:f});
const M=window.ROSA_MISSIONS,V=window.ROSA_VOICE;
assert.equal(M.weeks.length,12);assert(M.weeks.every((w,i)=>w.week===i+1&&w.steps.length===6));
const action=(name,value='',target={dataset:{},classList:{add(){},remove(){}}})=>M.handle('mission-'+name,value,target);
(async()=>{
 let checked=0;
 for(const w of M.weeks)for(let index=0;index<6;index++){
  await M.start(w.week,index);const type=w.steps[index].type,p=run('state.projection');
  assert.equal(p.level,w.steps[index].level);assert.equal(run('A.ui.book.level'),2,'Weekly difficulty must preserve ordinary PDI preferences');
  assert.equal(run('A.snapshot(state.projection)'),null,'Weekly games do not overwrite the saved ordinary game');
  action('next');assert.equal(run('state.projection.payload.missionIndex'),index,'Unsolved games cannot be skipped');
  if(type==='faltan'||type==='orden'){action('hide');assert.equal(p.missionData.ids.length,4);}
  assert(V.resolve(p.speak).every(r=>r.url),'Missing voice: '+p.speak);
  if(['rasgos','silueta','contar','nido','colecciones'].includes(type)){
   const html=el('#projection-content').innerHTML,values=[...html.matchAll(/data-action="answer" data-value="([^"]+)"/g)].map(x=>x[1]);
   assert.equal(values.length,4,type+' needs four distinct choices');assert.equal(new Set(values).size,4);assert(values.includes(p.answer));
   c.target={dataset:{value:values.find(v=>v!==p.answer)},classList:{add(){},remove(){}}};run('answer(target)');assert(!p.answered);
   c.target.dataset.value=p.answer;run('answer(target)');assert(p.answered);
  }else if(type==='faltan'){
   assert.equal(new Set(p.missionData.missing).size,2);for(const id of p.missionData.missing)action('select',String(id));action('check');assert(p.answered);
  }else if(type==='orden'){
   for(const id of p.missionData.ids)action('place',String(id));action('check');assert(p.answered);
  }else if(type==='serie'){
   const expected=p.answer.split(',');assert.equal(expected.length,2);expected.forEach(id=>action('pattern',id));action('check');assert(p.answered);
  }else if(type==='menu'){
   const ids=Array.from({length:6},(_,i)=>(p.round+i)%9);
   for(const id of ids){action('pick',String(id));const diet=window.ROSA.dinosaurs[id].diet;action('group',diet==='Herbívoro'?'Carnívoro':'Herbívoro');assert(!p.missionData.groups[id],'Wrong classifications do not advance');action('group',diet);}
   assert.equal(Object.keys(p.missionData.groups).length,6);assert(p.answered);
  }else{
   assert(p.drop);assert(p.drop.goal>=6||type==='ordenar-piezas');for(const piece of p.drop.pieces){window.ROSA_AULA.ui.selected=piece.id;window.ROSA_AULA.place(piece.slot);}assert(p.answered);
  }
  assert(M.solved(p),type);assert(!el('#mission-next').disabled,type+' unlocks after completion');checked++;
 }
 await M.start(1,5);let p=run('state.projection');action('hide');p.missionData.ids.forEach(id=>action('place',String(id)));action('check');action('next');assert(p.payload.missionDone);assert(el('#projection-content').innerHTML.includes('¡Misión completada!'));
 action('exit');assert.equal(run('state.projection'),null);assert.equal(run('state.dinoTab'),'aventuras');
 M.change({target:{id:'mission-week',value:'7'}});assert(M.page().includes('El menú de los dinosaurios'));
 for(const row of JSON.parse(fs.readFileSync(path.join(root,'sources/rosi-mission-voice-clips.json'),'utf8'))){assert(fs.statSync(path.join(root,'public/audio/pdi/rosi-missions',row.file)).size>500,row.text);}
 console.log(JSON.stringify({weeks:12,challenges:checked,fourChoices:'passed',twoMissing:'passed',sequenceAndPatterns:'passed',groupClassification:'passed',completionGate:'passed',savedPreferences:'preserved',voice:'complete'}));
})().catch(e=>{console.error(e);process.exitCode=1;});
