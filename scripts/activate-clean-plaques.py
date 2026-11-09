"""Use the clean high-resolution artwork, preserving local CSS rules."""
from pathlib import Path
import re
r=Path(__file__).resolve().parents[1]
p=r/'public/patitos-superheroes.css'
s=p.read_text(encoding='utf-8')
for old,new in [('placa.webp','placa-limpia.webp'),('fecha.webp','fecha-limpia.webp')]:
    s=s.replace('assets/patitos-acuarela/'+old,'assets/patitos-acuarela/'+new)
p.write_text(s,encoding='utf-8')
p=r/'public/index.html';s=p.read_text(encoding='utf-8')
s=re.sub(r'(href=[\"\']patitos-superheroes\.css)(?:\?[^\"\']*)?([\"\'])',r'\1?rev=placas-limpias1\2',s)
p.write_text(s,encoding='utf-8')
print('Placas y cartel de fecha actualizados.')
