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

const assertAssets=html=>{for(const [,url] of html.matchAll(/src="([^"?]+)(?:[^"]*)"/g)){if(!url.startsWith('http'))assert(fs.existsSync(path.join(dist,url)),url);}};
for(const name of ['arte','motricidad','logica','juegos','pdi','matematicas','lenguaje','dinosaurios','kusama','movimiento','imprimibles','canciones','taller','curso']){context.location.hash='#'+name;run('resetForRoute()');const html=element('#contenido').innerHTML;assert(html.length>200,name);assert(!html.includes('undefined'),name);if(name!=='dinosaurios')assertAssets(html);}
context.location.hash='#matematicas';run('resetForRoute()');assert(element('#contenido').innerHTML.includes('Taller de series'));
for(const count of [4,6,8])for(const theme of run('Object.keys(PATTERN_THEMES)'))for(const ink of ['color','bn','coloring']){run('Object.assign(patternState,'+JSON.stringify({count,theme,ink})+')');assertAssets(run('patternSheetMarkup()'));}
for(const mode of ['numeros','formas','nombre','pensar','trazos','dino']){run('window.ROSA_SHEETS.ui.mode='+JSON.stringify(mode));assertAssets(run('window.ROSA_SHEETS.printHTML()'));}
for(const theme of ['Números','Formas','Animales','Naturaleza','Emociones','Dinosaurios'])for(const ink of ['color','bn','coloring'])assertAssets(run('window.ROSA_PLAY.printSheets('+JSON.stringify({theme,ink,type:'memory',count:12,size:'mediana',max:6,pattern:'AB',seed:0})+')'));
for(const theme of run('Object.keys(window.ROSA_CLASSROOM.themes)'))for(const kind of ['tema-series','tema-contar','tema-vocabulario'])for(let level=1;level<=3;level++)for(let n=0;n<12;n++){run('startProjection('+JSON.stringify(kind)+','+n+','+JSON.stringify({theme})+');state.projection.level='+level+';projectionRender()');const answer=run('state.projection.answer'),html=element('#projection-content').innerHTML;assert(answer!==null);assert(html.includes('data-value="'+answer+'"'),kind+theme+n);if(theme==='Andalucía'&&kind==='tema-series'){assert(html.includes('#ffffff'));assert(html.includes('#07834d'));}}
for(let n=0;n<60;n++){run("startProjection('expedicion',"+n+")");assert(element('#projection-content').innerHTML.includes('SEMANA '));}
assert(!run('bank("imprimibles")').includes('data-value="adivinanzas"'));
assert(!run('bank("imprimibles")').includes('data-value="kusama-cuento"'));
console.log('Classroom checks passed: routes, restored series, printable assets, themed answers, 60 lessons, catalogue separation.');
// Daily hierarchy, distinct worksheet collections and all three stages per day.
const pdiHTML=run('A.pdiPage()');assert(pdiHTML.indexOf('Mi sesión de PDI')<pdiHTML.indexOf('Entramos en cada mundo'));assert(pdiHTML.indexOf('Juegos por habilidades')<pdiHTML.indexOf('Entramos en cada mundo'));
assert(run('R.filter(window.ROSA_CLASSROOM.isSheet).every(r=>r.printable)'));
assert(!run('bank("imprimibles")').includes('data-value="memory-dino"'));
assert(!run('bank("propuestas")').includes('data-value="curso-andalucia-28f"'));
for(let n=0;n<60;n++)for(let step=0;step<3;step++){run('startProjection("expedicion",'+n+',{step:'+step+'})');const html=element('#projection-content').innerHTML;assertAssets(html);assert(html.includes('PASO '+(step+1)+' / 3'));assert(run('state.projection.speak').trim());assert(run('window.ROSA_VOICE.resolve(state.projection.speak).every(c=>c.url)'),run('state.projection.speak'));}
for(let n=0;n<7;n++){run('startProjection("andalucia-cuento",'+n+')');assertAssets(element('#projection-content').innerHTML);}
assert.equal((run('window.ROSA_CLASSROOM.songs()').match(/class="song-card"/g)||[]).length,1);
console.log('Revised PDI checks passed: daily hierarchy, separate collections, 180 lesson steps, seven Andalucía pages and one saved song.');

for(const row of JSON.parse(fs.readFileSync(path.join(root,'sources/scenes-voice-texts.json'),'utf8')))assert(window.ROSA_VOICE.resolve(row.text).every(c=>c.url),row.text);
console.log('All new narration resolves to local audio files.');
