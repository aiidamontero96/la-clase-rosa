from pathlib import Path
import os, tempfile
import json
import fitz
from PIL import Image, ImageDraw
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('ROSA_QA_DIR',str(Path(tempfile.gettempdir())/'rosa-pdf-qa')));OUT.mkdir(parents=True,exist_ok=True)
meta=json.loads((ROOT/'public/materials.json').read_text())
errors=[]
for id,r in meta.items():
    for path in [r['pdf'],r['bw']]+([r['coloring']] if r.get('coloring') else []):
        doc=fitz.open(ROOT/'public'/path)
        if len(doc)!=r['pages']:errors.append((path,'page count'))
        for i,p in enumerate(doc):
            blocks=p.get_text('dict')['blocks']
            spans=[s for b in blocks if b['type']==0 for line in b['lines'] for s in line['spans']]
            width,height=p.rect.width,p.rect.height
            if any(s['bbox'][0]<-1 or s['bbox'][2]>width+1 or s['bbox'][1]<-1 or s['bbox'][3]>height+1 for s in spans):errors.append((path,i+1,'text outside page'))
            if '\ufffd' in p.get_text():errors.append((path,i+1,'replacement character'))
        doc.close()
files=[ROOT/'public'/v['preview'] for v in meta.values()]
for start in range(0,len(files),20):
    canvas=Image.new('RGB',(1200,1380),'#e7e7e7');dr=ImageDraw.Draw(canvas)
    for j,f in enumerate(files[start:start+20]):
        im=Image.open(f).convert('RGB');im.thumbnail((215,305));x=j%5*240+10;y=j//5*345+8
        canvas.paste(im,(x,y));dr.text((x,y+313),f.stem,fill='black')
    canvas.save(OUT/f'contact-{start//20}.jpg')
print(json.dumps({'material_count':len(meta),'pdf_count':sum(2+('coloring' in r) for r in meta.values()),'errors':errors,'contact_sheets':str(OUT)},ensure_ascii=False))
if errors:raise SystemExit(1)
