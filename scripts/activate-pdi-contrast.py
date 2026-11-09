from pathlib import Path
import re
p=Path(__file__).resolve().parents[1]/'public/index.html'
s=p.read_text(encoding='utf-8')
s,n=re.subn(r'(src=[\"\']asistencia-patitos\.js)(?:\?[^\"\']*)?([\"\'])',r'\1?rev=escritura-fondo-claro2\2',s)
if n!=1:raise SystemExit('No se ha modificado index.html: referencia a asistencia-patitos.js no encontrada o duplicada.')
p.write_text(s,encoding='utf-8');print('Fondo claro y trazo oscuro activados en los cuatro recuadros.')
