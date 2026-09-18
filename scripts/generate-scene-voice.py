"""Add prerecorded Spanish narration for the illustrated PDI. No runtime TTS."""
import asyncio,json,ssl
from pathlib import Path
import edge_tts,edge_tts.communicate
root=Path(__file__).resolve().parents[1]
# Input contains only generic educational narration. Student-name entries are excluded by the collector.
rows=json.loads((root/'sources/scenes-voice-texts.json').read_text())
edge_tts.communicate._SSL_CTX=ssl.create_default_context()
async def main():
 sem=asyncio.Semaphore(16);done=0;failed=[]
 async def generate(row):
  nonlocal done
  path=root/'public/audio/pdi'/row['file']
  if path.exists() and path.stat().st_size>500:return
  async with sem:
   for attempt in range(3):
    try:
     await edge_tts.Communicate(row['text'],'es-ES-ElviraNeural',rate='-8%').save(str(path))
     if path.stat().st_size<500:raise RuntimeError('Empty audio')
     done+=1
     if done%25==0:print(f'Generated {done}/{len(rows)}',flush=True)
     return
    except Exception as e:
     if attempt==2:failed.append(row['key']);print(type(e).__name__,row['key'][:50],flush=True)
 await asyncio.gather(*(generate(row) for row in rows))
 print(json.dumps({'generated':done,'failed':failed}),flush=True)
 if failed:raise RuntimeError('Missing narration')
asyncio.run(main())
