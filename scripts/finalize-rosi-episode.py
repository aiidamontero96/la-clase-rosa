"""Assemble only the pilot's existing voice clips and a small original music loop."""
from pathlib import Path
import json,subprocess,hashlib,tempfile
import numpy as np,soundfile as sf
root=Path(__file__).resolve().parents[1];out=root/'public/audio/pdi/rosi';sr=24000
data=json.loads(subprocess.check_output(['node','-e',"const fs=require('fs'),vm=require('vm'),c={window:{}};vm.runInNewContext(fs.readFileSync('public/rosi-config.js','utf8'),c);console.log(JSON.stringify(c.window.ROSA_EPISODES.episodes.map(e=>({...e,scenes:c.window.ROSA_EPISODES.lines(e)}))));"],cwd=root))
clips=json.loads((root/'sources/rosi-voice-clips.json').read_text());lookup={r['text']:r for r in clips}
def encode(y,path):
 with tempfile.TemporaryDirectory(prefix='rosi-audio-') as tmp:
  wav=Path(tmp)/'track.wav';sf.write(wav,y,sr)
  subprocess.run(['ffmpeg','-loglevel','error','-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','80k','-ar',str(sr),str(path)],check=True)
bank={}
for episode in data:
 waves=[];cues=[];samples=0
 for line in episode['scenes']:
  path=out/lookup[line['text']]['file'];y,rate=sf.read(path);assert rate==sr and y.ndim==1
  cues.append({'start':round(samples/sr,3),'end':round((samples+len(y))/sr,3),**line})
  waves.extend([y,np.zeros(round(.12*sr))]);samples+=len(y)+round(.12*sr)
 y=np.concatenate(waves+[np.zeros(round(.5*sr))]);file=episode['id']+'.mp3';encode(y,out/file)
 hop=1920;rms=np.array([np.sqrt(np.mean(y[i:i+hop]**2)) for i in range(0,len(y),hop)])
 scale=max(.015,float(np.percentile(rms,88)));envelope=np.round(np.clip((rms-.006)/scale,0,1)*100).astype(int).tolist()
 text=' '.join(c['text'] for c in cues)
 bank[episode['id']]={'audio':'audio/pdi/rosi/'+file,'duration':round(len(y)/sr,3),'text':text,'cues':cues,'envelopeStep':hop/sr,'envelope':envelope,'scriptHash':hashlib.sha256(text.encode()).hexdigest()}
# Original pentatonic mallet melody with soft chords. Generated once, played as a file.
duration=24;t=np.arange(sr*duration)/sr;music=np.zeros(len(t));beat=.75
for bar,chord in enumerate([[60,64,67],[57,60,64],[53,57,60],[55,60,62]]):
 start=bar*6;local=t-start;env=np.clip(local/.8,0,1)*np.clip((6-local)/1.2,0,1);env[(local<0)|(local>=6)]=0
 for note in chord:music+=.018*np.sin(2*np.pi*440*2**((note-69)/12)*local)*env
melody=[72,None,76,79,None,76,74,None,72,None,69,72,None,76,74,None]
for index,note in enumerate(melody):
 if note is None:continue
 local=t-index*beat*2;mask=(local>=0)&(local<3);tau=local[mask];freq=440*2**((note-69)/12)
 music[mask]+=.095*(np.sin(2*np.pi*freq*tau)+.18*np.sin(4*np.pi*freq*tau))*np.minimum(tau/.025,1)*np.exp(-tau/1.0)
music*=np.minimum(t/.2,1)*np.minimum((duration-t)/.4,1);encode(music,root/'public/audio/rosi-valle.mp3')
(root/'public/rosi-media.js').write_text('window.ROSA_EPISODE_MEDIA='+json.dumps(bank,ensure_ascii=False,separators=(',',':'))+';\n')
print(json.dumps({k:{'seconds':v['duration'],'scenes':len(v['cues'])} for k,v in bank.items()}))
