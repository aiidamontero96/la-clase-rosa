const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),c={window:{}};
for(const file of ['data.js','audio/pdi/manifest.js','pdi-voice.js','rosi-missions.js'])vm.runInNewContext(fs.readFileSync(path.join(root,'public',file),'utf8'),c);
const M=c.window.ROSA_MISSIONS,V=c.window.ROSA_VOICE,rows=new Map();
const texts=[...Object.values(M.speech),...c.window.ROSA.dinosaurs.map(d=>M.speech.rasgos+' '+d.fact)];
for(const text of texts)for(const clip of V.resolve(text))if(!clip.url){const key=V.key(clip.text);rows.set(key,{key,text:clip.text,spoken:clip.text,file:crypto.createHash('sha256').update(key).digest('hex').slice(0,16)+'.mp3'});}
fs.writeFileSync(path.join(root,'sources/rosi-mission-voice-clips.json'),JSON.stringify([...rows.values()],null,2)+'\n');
fs.writeFileSync(path.join(root,'public/rosi-missions-voice.js'),'Object.assign(window.ROSA_VOICE_FILES.files,'+JSON.stringify(Object.fromEntries([...rows.values()].map(r=>[r.key,'audio/pdi/rosi-missions/'+r.file])))+');\n');
console.log(JSON.stringify({weeks:M.weeks.length,challenges:M.weeks.reduce((n,w)=>n+w.steps.length,0),newVoiceClips:rows.size}));
