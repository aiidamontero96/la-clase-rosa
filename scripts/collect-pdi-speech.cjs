const fs=require('node:fs'),vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'../public');
const elements=new Map();
const el=key=>{if(!elements.has(key))elements.set(key,{innerHTML:'',textContent:'',value:'',dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(){},showModal(){},close(){},style:{}});return elements.get(key);};
const document={querySelector:el,addEventListener(){}};
const window={addEventListener(){},scrollTo(){}};
const ctx=vm.createContext({window,document,console,URL,URLSearchParams,location:{hash:'',href:'https://rosa.test/'},localStorage:{getItem(){return null},setItem(){}},setTimeout(){},clearTimeout(){},fetch:async()=>({ok:false})});
const run=s=>vm.runInContext(s,ctx);
for(const f of ['data.js','pdi.js','play-content.js','sheet-studio.js','aula.js','app.js'])run(fs.readFileSync(root+'/'+f,'utf8'));
const texts=new Map();
const add=(text,kind)=>{if(text?.trim()){const t=text.replace(/Tyrannosaurus rex|T\.\s*rex/gi,'Tiranosaurio rex').replace(/\s*\/\s*/g,', ').replace(/\s+/g,' ').trim();if(!texts.has(t))texts.set(t,new Set());texts.get(t).add(kind)}};
for(const kind of [...run('GAMES.map(g=>g[0])'),'challenge','cancion','saludo','asistencia','estacion','encargado','numero','letra','nombre']){
 for(let level=1;level<=3;level++){
  run('startProjection('+JSON.stringify(kind)+',0,"ROSA")');run('state.projection.level='+level);
  for(let n=0;n<360;n++)for(const hidden of [false,true]){
   run('state.projection.round='+n+';state.projection.hidden='+hidden+';state.projection.drop=window.ROSA_PLAY.pieces(state.projection.kind,state.projection.round,state.projection.level);projectionRender()');
   add(run('state.projection.speak'),kind);
  }
 }
}
for(const cat of run('Object.keys(D.questionGroups)'))for(const t of run('D.questionGroups['+JSON.stringify(cat)+']'))add(t,'question');
for(const s of run('window.ROSA_PLAY.stories'))for(const node of Object.values(s.nodes))add(s.title+'. '+node.text+' '+(node.question||'')+(node.choices?' '+node.choices.map(c=>c[1]).join('. '):''),'cuento');
for(const type of ['adivinanza','pregunta','movimiento','reto'])for(let n=0;n<100;n++){
 const s=run('window.ROSA_PLAY.surprise('+n+','+JSON.stringify(type)+')');add(s.title+'. '+s.text,'sorpresa');if(s.answer)add(s.title+'. '+s.text+' '+s.answer,'sorpresa');
}

for(const t of ['¡Hola, peques! ¿Jugamos juntos? Mirad con calma. ¡Vamos a descubrirlo!', 'Mira con calma. Puedes probar otra opción.', 'Lo habéis encontrado juntos.', '¿Cómo lo has pensado? Podemos contarlo a la clase.', '¡Lo has encontrado!', '¡Muy bien!', '¡Buen trabajo!', '¡Lo has conseguido!', '¡Qué bien lo has pensado!', '¡Un aplauso para ti!', '¡Lo habéis conseguido!', '¡Una pareja!', 'Habéis encontrado todas las parejas. ¡Un aplauso para toda la clase!', '¡Hemos llegado al nido!', '¡El jardín está lleno de flores!', '¡Nuestro jardín está lleno de flores!', 'Lo habéis completado pieza a pieza.', 'Primero toca una pieza.', 'Mira con calma. Prueba otro lugar.', 'La pieza sigue disponible. Puedes tocar su lugar.', '¿Qué hemos descubierto hoy?'])add(t,'feedback');
for(const t of run('D.truth.map(t=>t[2])'))add(t,'feedback');
for(const t of run('D.riddles.map(t=>t[1])'))add(t,'respuesta');
for(const kind of run('window.ROSA_PDI.games.map(g=>g[0])'))for(let lev=1;lev<=3;lev++)for(let n=0;n<360;n++){const r=run('window.ROSA_PDI.round('+JSON.stringify(kind)+','+n+',true,'+lev+')');if(r?.explanation)add(r.explanation,'feedback');}
fs.writeFileSync(path.resolve(__dirname,'../sources/pdi-spoken-texts.json'),JSON.stringify([...texts].map(([text,kinds])=>({text,kinds:[...kinds]})),null,2));
console.log({phrases:texts.size,words:[...texts.keys()].join(' ').split(/\s+/).length,characters:[...texts.keys()].join('').length});
