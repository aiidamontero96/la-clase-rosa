// Validate prerecorded media and exercise player lifecycle without a browser.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),nodes=new Map(),events={},storage=new Map(),launched=[],frames=new Map();let frame=0;
class Node{
 constructor(){this.textContent='';this.innerHTML='';this.hidden=false;this.currentTime=0;this.paused=true;this.dataset={};this.attributes={};this.events={};this.open=false;this.isConnected=true;this.classes=new Set();this.classList={add:(...a)=>a.forEach(x=>this.classes.add(x)),remove:(...a)=>a.forEach(x=>this.classes.delete(x)),contains:x=>this.classes.has(x)};this.properties={};this.style={setProperty:(k,v)=>this.properties[k]=v};}
 querySelector(s){if(!nodes.has(s))nodes.set(s,new Node());return nodes.get(s);}
 setAttribute(k,v){this.attributes[k]=v;}removeAttribute(k){delete this[k];}addEventListener(k,fn){(this.events[k]??=[]).push(fn);}emit(k){for(const fn of this.events[k]||[])fn();}
 play(){if(this.reject)return Promise.reject(Error('audio unavailable'));this.paused=false;this.emit('playing');return Promise.resolve();}
 pause(){const changed=!this.paused;this.paused=true;if(changed)this.emit('pause');}load(){}showModal(){this.open=true;}close(){this.open=false;this.emit('close');}focus(){}
}
const dialog=new Node();
const document={createElement:()=>dialog,body:{append(){}},activeElement:new Node(),addEventListener:(k,fn)=>events[k]=fn,fullscreenElement:null};
const window={addEventListener(){},ROSA_AULA:{stopVoice(){}},ROSA_MISSIONS:{start:week=>launched.push(week)}};
const c=vm.createContext({window,document,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},requestAnimationFrame:fn=>{frames.set(++frame,fn);return frame;},cancelAnimationFrame:id=>frames.delete(id)});
for(const file of ['pdi-voice.js','rosi-config.js','rosi-media.js','rosi-episode.js'])vm.runInContext(fs.readFileSync(path.join(root,'public',file),'utf8'),c);
const C=window.ROSA_EPISODES,M=window.ROSA_EPISODE_MEDIA,P=window.ROSA_EPISODE;
assert.equal(C.episodes.length,1,'Only one pilot');assert.equal(new Set(C.pupils).size,10);const episode=C.episodes[0],media=M[episode.id];
assert.equal(episode.helpers.length,2);assert.equal(new Set(episode.helpers).size,2);assert(episode.helpers.every(n=>C.pupils.includes(n)));
assert.deepEqual(Array.from(media.cues,c=>c.text),Array.from(C.lines(episode),c=>c.text),'Changing names or dialogue requires rebuilding voice and cues');
assert.equal(media.cues[0].start,0);for(let i=0;i<media.cues.length;i++){const cue=media.cues[i];assert(cue.end>cue.start);if(i)assert(cue.start>=media.cues[i-1].end);}
assert(media.duration>=media.cues.at(-1).end);assert.equal(media.envelope.length,Math.ceil(media.duration/media.envelopeStep));assert(media.envelope.some(n=>n>50)&&media.envelope.some(n=>n===0));
for(const file of [C.mascot.atlas,C.mascot.head,C.mascot.background,media.audio,'audio/rosi-valle.mp3'])assert(fs.statSync(path.join(root,'public',file)).size>1000,file);
const flush=()=>new Promise(r=>setImmediate(r));const action=(s,v)=>P.handle('episode-'+s,v);const voice=()=>nodes.get('#rosi-voice'),music=()=>nodes.get('#rosi-music');
(async()=>{
 action('open',episode.id);assert(dialog.open);assert(voice().paused,'Opening does not autoplay');assert.equal(voice().playbackRate,1.12);assert.equal(voice().preservesPitch,true);
 action('mission');assert.equal(launched.length,0,'Mission unlocks only after the episode');
 action('play');await flush();assert(!voice().paused&&!music().paused);assert.equal(frames.size,1);
 voice().currentTime=media.cues[4].start+.3;for(const fn of [...frames.values()])fn();assert.equal(nodes.get('.rosi-caption').textContent,media.cues[4].text);
 action('play');assert(voice().paused&&music().paused);assert.equal(frames.size,0);const at=voice().currentTime;
 action('play');await flush();assert.equal(voice().currentTime,at,'Resume preserves position');action('music');assert(music().paused);assert(!voice().paused,'Music toggle preserves voice');
 action('subtitles');assert(nodes.get('.rosi-caption').hidden);action('subtitles');assert(!nodes.get('.rosi-caption').hidden);
 action('restart');await flush();assert.equal(voice().currentTime,0);assert(!voice().paused);
 voice().emit('waiting');assert.equal(frames.size,0);assert(music().paused,'Buffering freezes music');voice().emit('playing');assert.equal(frames.size,1);
 voice().currentTime=media.duration;voice().paused=true;voice().emit('ended');assert(!nodes.get('.rosi-finish').hidden);assert(music().paused);action('mission');assert.equal(launched[0],1);assert(!dialog.open&&voice().paused);assert.equal(frames.size,0);
 action('open',episode.id);voice().reject=true;action('play');await flush();assert(nodes.get('.rosi-status').textContent.includes('Reintentar'));assert(music().paused);assert.equal(frames.size,0);voice().reject=false;action('play');await flush();assert(!voice().paused);
 document.hidden=true;events.visibilitychange();assert(voice().paused&&music().paused);assert.equal(frames.size,0);document.hidden=false;
 action('fullscreen');await flush();assert(dialog.classList.contains('rosi-expanded'),'Fullscreen fallback works without native support');action('close');assert(!dialog.classList.contains('rosi-expanded'));
 assert.equal(P.handle('answer','0'),false,'Existing PDI actions remain untouched');
 console.log(JSON.stringify({pilot:episode.id,helpers:Array.from(episode.helpers),scenes:media.cues.length,media:'validated',controls:'passed',pauseAndBuffering:'passed',audioRetry:'passed',mission:'six weekly challenges',runtimeGeneration:false}));
})().catch(e=>{console.error(e);process.exitCode=1;});
