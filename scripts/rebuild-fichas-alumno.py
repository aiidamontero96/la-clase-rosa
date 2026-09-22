from pathlib import Path
import importlib.util
import json
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
import pymupdf as fitz

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("rosa_materials",ROOT/"scripts/build-materials.py")
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)

resources=[r for r in m.DATA['resources'] if r.get('printable') and r['id'] in m.SHEET_IDS]
for idx,r in enumerate(resources,1):
    print(f'[{idx}/{len(resources)}] Generando {r["id"]}...', flush=True)
    if r.get('externalPdf'):
        m.build_external(r)
    else:
        n=m.build_one(r,False);nb=m.build_one(r,True);nc=m.build_one(r,True,True)
        assert n==nb==nc

def render(r):
    for suffix in ['', '-bn', '-colorear']:
        stem=r['id']+suffix
        doc=fitz.open(m.OUT/'pdf'/(stem+'.pdf'))
        for i,p in enumerate(doc):
            scale=1 if r.get('externalPdf') else 1.5
            pix=p.get_pixmap(matrix=fitz.Matrix(scale,scale),alpha=False)
            im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
            im.save(m.OUT/'pages'/(stem+'-'+str(i+1)+'.jpg'),quality=65 if r.get('externalPdf') else 86,optimize=bool(r.get('externalPdf')))
            if i==0 and suffix!='-colorear':
                preview=im.copy();preview.thumbnail((420,595))
                preview.save(m.OUT/'previews'/(stem+'.webp'),quality=85)
        doc.close()

print('Renderizando páginas y miniaturas...', flush=True)
with ThreadPoolExecutor(max_workers=4) as pool:
    list(pool.map(render,resources))

print(json.dumps({'fichas_regeneradas':len(resources),'ids':[r['id'] for r in resources]},ensure_ascii=False))
