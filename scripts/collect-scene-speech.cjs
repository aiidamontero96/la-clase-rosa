// Logic and asset checks without starting or inspecting a browser.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'public');
const manifest=JSON.parse(fs.readFileSync(path.join(dist,'materials.json'),'utf8'));
const elements=new Map(),listeners={},storage=new Map();
function element(id){if(!elements.has(id))elements.set(id,{insertAdjacentHTML(){},innerHTML:'',textContent:'',value:'',open:false,dataset:{},classList:{add(){},remove(){},toggle(){return false;}},setAttribute(){},addEventListener(){},showModal(){this.open=true;},close(){this.open=false;}});return elements.get(id);}
const document={querySelector:element,addEventListener(type,fn){(listeners[type]??=[]).push(fn);}};
const window={addEventListener(){},scrollTo(){},scrollY:0};
const context=vm.createContext({document,window,location:{hash:'',href:'https://example.test/'},URL,URLSearchParams,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},fetch:async()=>({ok:true,json:async()=>manifest}),setTimeout:()=>0,clearTimeout(){},console});
for(const file of ['data.js','pdi.js','play-content.js','sheet-content.js','sheet-studio.js','audio/pdi/manifest.js','audio/pdi/scenes-manifest.js','pdi-voice.js','aula.js','rosi-config.js','rosi-media.js','rosi-episode.js','rosi-missions.js','classroom.js','pdi-scenes.js','app.js'])vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const run=code=>vm.runInContext(code,context);


const texts=new Set();const add=t=>{if(t)texts.add(String(t));};

// Every visible PDI game must have an automatic reading. We only generate
// recordings that are not already covered by the main prerecorded bank.
for(const kind of run("GAMES.map(g=>g[0]).filter(k=>k!=='cestas')"))for(let level=1;level<=3;level++)for(let n=0;n<60;n++)for(const hidden of [false,true]){
 run('startProjection('+JSON.stringify(kind)+','+n+')');
 run('state.projection.level='+level+';state.projection.hidden='+hidden+';projectionRender()');
 add(run('state.projection.speak'));
}
for(let n=0;n<60;n++)for(let step=0;step<3;step++){run("startProjection('expedicion',"+n+",{step:"+step+"})");add(run('state.projection.speak'));add(run('state.projection.explanation'));}
for(let n=0;n<7;n++){run("startProjection('andalucia-cuento',"+n+")");add(run('state.projection.speak'));add(run('state.projection.explanation'));}
for(const kind of ['asistencia','encargado','emociones','saludo','estacion','tiempo','numero','letra','dino-ficha','movimiento-guiado'])for(let n=0;n<30;n++){
 run('startProjection('+JSON.stringify(kind)+','+n+')');add(run('state.projection.speak'));
 if(kind==='dino-ficha')for(const fact of ['diet','fact']){run('state.projection.payload={fact:'+JSON.stringify(fact)+'};projectionRender()');add(run('state.projection.speak'));}
}
for(const theme of run('Object.keys(window.ROSA_CLASSROOM.themes)'))for(const kind of ['tema-contar','tema-series','tema-vocabulario'])for(let n=0;n<12;n++){run('startProjection('+JSON.stringify(kind)+','+n+','+JSON.stringify({theme})+')');add(run('state.projection.speak'));add(run('state.projection.explanation'));}
for(const weather of ['Sol','Nubes','Lluvia','Viento','Nieve','Sol y nubes']){run('startProjection("tiempo");state.projection.weather='+JSON.stringify(weather)+';projectionRender()');add(run('state.projection.speak'));}
for(const text of ['De los saludos se encargará.','De las luces se encargará.','Del material se encargará.'])add(text);
for(let session=0;session<6;session++)for(let n=0;n<6;n++){run('startProjection("movimiento-guiado",'+n+',{session:'+session+'})');add(run('state.projection.speak'));}
for(const text of ['¿Quién ha venido hoy? Toca un nombre para tachar a quien no ha venido hoy.','¿Cuántos hemos venido? Contamos juntos.','Gracias por compartirlo. ¿Qué necesitas ahora?','Está bien. Puedes escuchar.','¿Qué pistas recuerdas?','Volvemos a mirar las láminas.','VERDE, BLANCO Y VERDE. ¡LA BANDERA ESTÁ COMPLETA!','LAS ACEITUNAS SALEN DEL OLIVO.',...['Primavera','Verano','Otoño','Invierno'].map(s=>'Observamos los cambios de '+s.toLowerCase()+'.')])add(text);
const V=window.ROSA_VOICE,crypto=require('crypto');const rows=[...texts].filter(t=>V.resolve(t).some(c=>!c.url)).map(text=>({text,key:V.key(text),file:'scene-'+crypto.createHash('sha256').update(V.key(text)).digest('hex').slice(0,16)+'.mp3'}));
const studentNames=run('D.students').map(x=>V.key(x));const safeRows=rows.filter(r=>!studentNames.some(name=>new RegExp('(^|[^a-záéíóúñ])'+name+'([^a-záéíóúñ]|$)','i').test(r.key)));fs.writeFileSync(path.join(root,'sources/scenes-voice-texts.json'),JSON.stringify(safeRows,null,2));console.log({total:texts.size,newClips:rows.length});
