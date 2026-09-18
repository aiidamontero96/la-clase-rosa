"""Generate the static PDI voice offline. No account, key or runtime TTS API.
Requires qwen-tts 0.1.1, CPU PyTorch, soundfile and ffmpeg.
"""
import os, json, time, argparse, subprocess, tempfile
from pathlib import Path
os.environ.setdefault('HF_HUB_DISABLE_XET','1')
os.environ.setdefault('HF_HUB_DOWNLOAD_TIMEOUT','120')
os.environ.setdefault('HF_HUB_ETAG_TIMEOUT','30')
import torch, soundfile as sf
from qwen_tts import Qwen3TTSModel
parser=argparse.ArgumentParser();parser.add_argument('--batch-size',type=int,default=16);parser.add_argument('--limit',type=int,default=0)
parser.add_argument('--input',default='sources/pdi-voice-clips.json');parser.add_argument('--output',default='public/audio/pdi');parser.add_argument('--progress',default='sources/pdi-voice-generation-progress.json');args=parser.parse_args()
root=Path(__file__).resolve().parents[1]
clips=json.loads((root/args.input).read_text())
out=root/args.output;out.mkdir(parents=True,exist_ok=True)
remaining=[row for row in clips if not (out/row['file']).exists()]
if args.limit:remaining=remaining[:args.limit]
torch.set_num_threads(6);torch.manual_seed(20260910)
model=Qwen3TTSModel.from_pretrained(os.environ.get('ROSA_TTS_MODEL','Qwen/Qwen3-TTS-12Hz-0.6B-Base'),device_map='cpu',dtype=torch.bfloat16,attn_implementation='sdpa')
# Keep waveform decoding in small groups so CPU generation fits modest RAM.
original_decode=model.model.speech_tokenizer.decode
def decode_in_groups(items,**kwargs):
 decoded=[];sample_rate=None
 for offset in range(0,len(items),4):
  waves,sample_rate=original_decode(items[offset:offset+4],**kwargs)
  decoded.extend(waves)
 return decoded,sample_rate
model.model.speech_tokenizer.decode=decode_in_groups
prompt=model.create_voice_clone_prompt(ref_audio=str(root/'sources/pdi-voice-reference.wav'),ref_text='¿Qué comía Anquilosaurio? Su cuerpo estaba protegido por placas óseas. Su cola terminaba en una maza.',x_vector_only_mode=False)
started=time.time();done=0
print(json.dumps({'status':'ready','remaining':len(remaining),'batch_size':args.batch_size}),flush=True)
start=0
while start<len(remaining):
 size=min(args.batch_size,64 if len(remaining[start]['spoken'])<80 else 32)
 batch=remaining[start:start+size];t=time.time()
 texts=[row.get('spoken',row['text']) for row in batch]
 max_tokens=max(96,min(600,int(max(map(len,texts))*1.6)))
 print(json.dumps({'generating':len(batch),'first':batch[0]['key']}),flush=True)
 wavs,sr=model.generate_voice_clone(text=texts,language=['Spanish']*len(batch),voice_clone_prompt=prompt,non_streaming_mode=True,max_new_tokens=max_tokens)
 with tempfile.TemporaryDirectory(prefix='rosa-voice-') as folder:
  for row,wav in zip(batch,wavs):
   duration=len(wav)/sr
   if duration<.18 or duration>max_tokens/12+.5:raise RuntimeError('Unexpected duration for '+row['key'])
   wavfile=Path(folder)/'clip.wav';mp3file=Path(folder)/'clip.mp3';sf.write(wavfile,wav,sr)
   # Slow down by 6%, preserving the model's natural pitch. Encode once.
   subprocess.run(['ffmpeg','-loglevel','error','-y','-i',str(wavfile),'-af','atempo=0.94','-codec:a','libmp3lame','-b:a','80k','-ar','24000',str(mp3file)],check=True)
   (out/row['file']).write_bytes(mp3file.read_bytes())
   row['seconds']=round(duration/.94,3);done+=1
 start+=len(batch)
 print(json.dumps({'done':done,'total':len(remaining),'batch_seconds':round(time.time()-t,1),'elapsed_seconds':round(time.time()-started,1),'last':batch[-1]['key']}),flush=True)
 (root/args.progress).write_text(json.dumps({'model':'Qwen/Qwen3-TTS-12Hz-0.6B-Base','rate':.94,'completed':sum((out/row['file']).exists() for row in clips),'total':len(clips),'clips':clips},ensure_ascii=False,indent=2)+'\n')
print('COMPLETE',flush=True)
