const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'public/pdi-voice.js'),'utf8'),ctx);
const V=ctx.window.ROSA_VOICE;
const inventory=JSON.parse(fs.readFileSync(path.join(root,'sources/pdi-spoken-texts.json'),'utf8'));
const records=new Map();
function add(text){const key=V.key(text);if(!key||records.has(key))return;records.set(key,{key,text:V.normalize(text),file:crypto.createHash('sha256').update(key).digest('hex').slice(0,16)+'.mp3'});}
for(const row of inventory)for(const part of V.parts(row.text))add(part);
for(let n=0;n<100;n++)add(String(n));
for(let n=100;n<=900;n+=100)add(String(n));
for(let n=2026;n<=2036;n++)add(String(n));
for(const word of ['ciento','mil','de','lunes','martes','miércoles','jueves','viernes','sábado','domingo','enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'])add(word);
const ones=['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve','veinte','veintiuno','veintidós','veintitrés','veinticuatro','veinticinco','veintiséis','veintisiete','veintiocho','veintinueve'];
function number(n){
 if(n<30)return ones[n];
 if(n<100)return ['','','','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'][Math.floor(n/10)]+(n%10?' y '+ones[n%10]:'');
 if(n<1000){if(n===100)return 'cien';return ['','ciento','doscientos','trescientos','cuatrocientos','quinientos','seiscientos','setecientos','ochocientos','novecientos'][Math.floor(n/100)]+(n%100?' '+number(n%100):'');}
 return (n<2000?'mil':number(Math.floor(n/1000))+' mil')+(n%1000?' '+number(n%1000):'');
}
const names={Ankylosaurus:'Anquilosaurio',Brachiosaurus:'Braquiosaurio',Stegosaurus:'Estegosaurio',Parasaurolophus:'Parasaurolofo',Spinosaurus:'Espinosaurio'};
for(const row of records.values()){
 let spoken=row.text.replace(/\b\d{1,6}\b/g,n=>number(Number(n))).replace(/Ankylosaurus|Brachiosaurus|Stegosaurus|Parasaurolophus|Spinosaurus/g,n=>names[n]);
 spoken=spoken[0].toLocaleUpperCase('es-ES')+spoken.slice(1);
 if(!/[.!?]$/.test(spoken))spoken+='.';
 row.spoken=spoken;
}
const rows=[...records.values()].sort((a,b)=>a.text.length-b.text.length);
fs.writeFileSync(path.join(root,'sources/pdi-voice-clips.json'),JSON.stringify(rows,null,2)+'\n');
console.log({clips:rows.length,words:rows.map(r=>r.text).join(' ').split(/\s+/).length});
