const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),os=require('node:os'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),rows=JSON.parse(fs.readFileSync(path.join(root,'sources/pdi-voice-clips.json'),'utf8'));
const files={},missing=[],pending=process.argv.includes('--allow-pending');
for(const row of rows){const file=path.join(root,'public/audio/pdi',row.file);if(!fs.existsSync(file)||fs.statSync(file).size<500)missing.push(row.key);else files[row.key]='audio/pdi/'+row.file;}
if(missing.length&&!pending)throw new Error(missing.length+' audio clips are missing. First: '+missing.slice(0,4).join(', '));
let fullTexts=0;
if(!pending){
 const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'public/pdi-voice.js'),'utf8'),context);const V=context.window.ROSA_VOICE;
 const inventory=JSON.parse(fs.readFileSync(path.join(root,'sources/pdi-spoken-texts.json'),'utf8'));
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'rosa-audio-join-'));
 try{
  for(const item of inventory){
   const key=V.key(item.text);if(files[key])continue;
   const segments=Array.from(V.parts(item.text,files),t=>files[V.key(t)]);if(segments.some(p=>!p))throw new Error('Missing speech: '+item.text);
   const file='audio/pdi/'+crypto.createHash('sha256').update(key).digest('hex').slice(0,16)+'.mp3';
   const list=segments.map(p=>"file '"+path.join(root,'public',p).replace(/'/g,"'\\''")+"'").join('\n');
   fs.writeFileSync(path.join(temp,'parts.txt'),list+'\n');
   execFileSync('ffmpeg',['-loglevel','error','-y','-f','concat','-safe','0','-i',path.join(temp,'parts.txt'),'-codec:a','libmp3lame','-b:a','80k','-ar','24000',path.join(root,'public',file)]);
   files[key]=file;fullTexts++;
  }
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
}
const bank={version:1,voice:'Rosa',generator:'Qwen3-TTS 0.6B Base',language:'es',rate:.94,files};
fs.writeFileSync(path.join(root,'public/audio/pdi/manifest.js'),'window.ROSA_VOICE_FILES='+JSON.stringify(bank)+';\n');
console.log(JSON.stringify({available:Object.keys(files).length,missing:missing.length,joinedReadings:fullTexts}));
