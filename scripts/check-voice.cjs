const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),publicDir=path.join(root,'public');
const clips=JSON.parse(fs.readFileSync(path.join(root,'sources/pdi-voice-clips.json'),'utf8'));
const expected=Object.fromEntries(clips.map(c=>[c.key,'audio/pdi/'+c.file]));
const nodes=new Map();
const el=key=>{if(!nodes.has(key))nodes.set(key,{innerHTML:'',textContent:'',value:'',dataset:{},style:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(){},showModal(){},close(){},focus(){}});return nodes.get(key);};
const played=[];let player,rejectPlay=false,pauseCount=0;
class Audio{constructor(){player=this;}play(){played.push(this.src);return rejectPlay?Promise.reject(new Error('unavailable')):Promise.resolve();}pause(){pauseCount++;}removeAttribute(){this.src='';}load(){}}
const window={Audio,ROSA_VOICE_FILES:{files:expected},addEventListener(){},scrollTo(){}};
const context=vm.createContext({window,document:{querySelector:el,addEventListener(){}},console,URL,URLSearchParams,location:{hash:'',href:'https://rosa.example/'},localStorage:{getItem(){return null},setItem(){}},setTimeout(){},clearTimeout(){},fetch:async url=>({ok:url!=='/api/aula',json:async()=>JSON.parse(fs.readFileSync(path.join(publicDir,'materials.json'),'utf8'))})});
const run=s=>vm.runInContext(s,context);
for(const f of ['data.js','pdi.js','play-content.js','sheet-studio.js','pdi-voice.js','aula.js','app.js'])run(fs.readFileSync(path.join(publicDir,f),'utf8'));
const V=window.ROSA_VOICE;
const inventory=JSON.parse(fs.readFileSync(path.join(root,'sources/pdi-spoken-texts.json'),'utf8'));
for(const row of inventory){const parts=V.resolve(row.text);assert(parts.length);assert(parts.every(p=>p.url),'Missing voice: '+row.text);}
for(const date of ['jueves, 10 de septiembre de 2026','sábado, 1 de enero de 2044','lunes, 3 de marzo de 1902','domingo, 25 de febrero de 9999'])assert(V.resolve(date).every(p=>p.url),date);
(async()=>{
 for(const kind of ['contar','clasificar','dino','adivinanza','verdadero','vocales','memory','calendario','cuento']){
  run('startProjection('+JSON.stringify(kind)+',0)');
  const before=run('state.projection.speak'),urls=Array.from(V.resolve(before),p=>p.url);assert(urls.every(Boolean),before);
  played.length=0;run('A.handle("speak","")');assert.deepEqual(played,[urls[0]],kind);
  for(let i=1;i<urls.length;i++)player.onended();assert.deepEqual(played,urls,kind+' uses only its MP3 files');
  player.onended();assert.equal(player.onended,null);
 }
 run('startProjection("contar",0);A.handle("speak","")');const oldEnd=player.onended;const count=played.length;run('A.stopVoice()');oldEnd();assert.equal(played.length,count,'A stopped queue cannot resume');assert(pauseCount>0);
 run('A.handle("speak","");A.next()');assert.equal(player.onended,null,'Changing activities stops playback');
 const instruction=run('state.projection.speak');run('A.handle("voice-preview","")');assert.equal(run('state.projection.speak'),instruction,'Voice sample preserves activity');
 run('A.feedbackVoice("Mira con calma. Puedes probar otra opción.");A.handle("speak","")');assert.equal(played.at(-1),expected[V.key('Mira con calma.')]);
 rejectPlay=true;run('A.handle("speak","")');await new Promise(r=>setImmediate(r));assert(el('#toast').textContent.includes('No se ha podido reproducir'),el('#toast').textContent);assert.equal(player.onended,null);
 const n=played.length;run('A.feedbackVoice("Texto que no existe en el banco.");A.handle("speak","")');assert.equal(played.length,n,'Missing audio never substitutes another voice');
 assert(!fs.readFileSync(path.join(publicDir,'aula.js'),'utf8').includes('speechSynthesis'));
 if(!process.argv.includes('--logic-only')){
  for(const clip of clips){const file=path.join(publicDir,'audio/pdi',clip.file);assert(fs.existsSync(file)&&fs.statSync(file).size>500,clip.key+' MP3');}
  const saved={window:{}};vm.runInNewContext(fs.readFileSync(path.join(publicDir,'audio/pdi/manifest.js'),'utf8'),saved);for(const [key,url] of Object.entries(expected))assert.equal(saved.window.ROSA_VOICE_FILES.files[key],url);for(const item of inventory){const url=saved.window.ROSA_VOICE_FILES.files[V.key(item.text)];assert(url,'Full reading: '+item.text);assert(fs.statSync(path.join(publicDir,url)).size>500);}
 }
 console.log(JSON.stringify({spokenTexts:inventory.length,clips:clips.length,activitiesTested:9,stopAndRetry:'passed',calendar:'passed',fallback:'none',assets:process.argv.includes('--logic-only')?'pending generation':'complete'}));
})().catch(e=>{console.error(e);process.exitCode=1;});
