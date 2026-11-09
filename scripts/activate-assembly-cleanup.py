from pathlib import Path
import re
r=Path(__file__).resolve().parents[1]
p=r/'public/index.html';s=p.read_text(encoding='utf-8')
s,n=re.subn(r'(src=[\"\']app\.js)(?:\?[^\"\']*)?([\"\'])',r'\1?rev=asamblea-sin-casa1\2',s)
if n!=1:raise SystemExit('No se encuentra una única referencia a app.js. No se ha modificado index.html.')
p.write_text(s,encoding='utf-8');print('Asamblea actualizada y caché renovada.')
