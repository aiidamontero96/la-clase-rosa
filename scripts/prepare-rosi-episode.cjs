const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),context={window:{}};
for(const file of ['pdi-voice.js','rosi-config.js'])vm.runInNewContext(fs.readFileSync(path.join(root,'public',file),'utf8'),context);
const C=context.window.ROSA_EPISODES,V=context.window.ROSA_VOICE,rows=new Map();
for(const episode of C.episodes)for(const line of C.lines(episode)){
 const key=V.key(line.text);rows.set(key,{key,text:line.text,spoken:line.text,file:crypto.createHash('sha256').update(key).digest('hex').slice(0,16)+'.mp3'});
}
fs.writeFileSync(path.join(root,'sources/rosi-voice-clips.json'),JSON.stringify([...rows.values()],null,2)+'\n');
console.log(JSON.stringify({episodes:C.episodes.length,newVoiceClips:rows.size,helpers:C.episodes[0].helpers}));
