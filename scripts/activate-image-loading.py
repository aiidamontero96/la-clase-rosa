"""Activate the image loader while preserving local index.html customizations."""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
p = root / 'public/index.html'
text = p.read_text(encoding='utf-8')
if '</head>' not in text:
    raise SystemExit('No se encuentra </head>; no se ha modificado index.html.')
for name in ('app.js', 'dino-route.js'):
    pattern = r'(src=[\"\']' + re.escape(name) + r')(?:\?[^\"\']*)?([\"\'])'
    text, count = re.subn(pattern, r'\1?rev=carga-imagenes1\2', text)
    if count != 1:
        raise SystemExit(f'No se encuentra una única referencia a {name}; no se ha modificado index.html.')
if not re.search(r'src=[\"\']image-loading\.js(?:\?|[\"\'])', text):
    text = text.replace('</head>', '<script src="image-loading.js?rev=1" defer></script>\n</head>', 1)
p.write_text(text, encoding='utf-8')
print('Carga de imágenes activada; se conservan los ajustes locales de la cabecera.')
