# Cuadernos semanales · 4 años

Diez semanas, diez páginas por semana: portada, tres descubrimientos, dos retos de observación y razonamiento, dibujo, palabra en la pizarra guiada, recuerdo oral y guía docente. El botón Siguiente recorre todas; las pestañas y el índice permiten saltar sin perder el punto.

La semana 2 abre los capítulos existentes de Triásico, Jurásico y Cretácico. «Volver al cuaderno» recupera la página de origen, incluso después de recorrer escenas de un capítulo.

La cabecera utiliza la imagen facilitada por la maestra. Los interiores combinan fotografías de fósiles, ave y planta actuales con reconstrucciones realistas existentes y modelos de huellas. Créditos y licencias: `public/assets/route-notebook/CREDITOS.html`.

| Semana | Dibujo / representación | Palabra |
|---|---|---|
| 1 | Camino de tres huellas | HUELLA |
| 2 | Paisaje: helechos y río | TIERRA |
| 3 | Dos cuellos de distinta longitud | LARGO |
| 4 | Tres plantas para Triceratops | PLANTA |
| 5 | Rodear dos placas del estegosaurio | CUERNO |
| 6 | Nido alrededor de huevos fosilizados | HUEVO |
| 7 | Recorrido ondulado del plesiosaurio | ALAS |
| 8 | Rodear dos huesos del fósil | FÓSIL |
| 9 | Sol y rayos junto al helecho | LUZ |
| 10 | Cartel de un dinosaurio del museo | MUSEO |

Las respuestas y los dibujos se conservan al pasar páginas o cerrar y reabrir una semana durante la misma carga de la web. No se guardan tras recargar/cerrar el navegador. La pizarra guiada reutiliza el motor de la web; no exige lectura ni escritura autónoma. Las consignas se leen en voz alta y se modelan. En la guía final hay objetivos, apoyos y propuestas fuera de la pantalla.

## Aplicar el parche

Este parche es incremental sobre `la-clase-rosa-ruta-4-anos.patch`, ya aplicado. Incluye archivos binarios (imágenes).

Desde el repositorio, en WSL:

```bash
parche="/mnt/c/Users/acastrom/Downloads/la-clase-rosa-cuaderno-anillas-v2.patch"
git apply --check "$parche" && git apply "$parche"
node scripts/check-dino-route.cjs
npm run dev -- --host 0.0.0.0
```

Aplicarlo solo una vez. Si la comprobación falla, no descartar cambios con `git checkout .`: conservar el trabajo local y revisar qué archivos difieren. El parche no publica ni sube cambios a GitHub.

## Verificación

Pruebas automáticas: 100 páginas, límites de navegación, recuperación de página, 20 retos con respuestas correctas e incorrectas, recursos locales, dibujos y palabras diferentes. `node --check` para app y pizarra; `npm run build`.

Pruebas visuales en Chrome: las diez semanas en 1363×936; recorrido representativo de diez páginas en marcos de 1024×768 y 390×844; apertura y vuelta de las tres etapas; dibujo y repaso con conservación de trazos. No sustituye una comprobación física con la PDI o un iPad.
