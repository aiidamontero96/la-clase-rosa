# La Clase Rosa

Banco de aula en español para Educación Infantil de cuatro años, sin cuentas ni registros del alumnado. Los favoritos de materiales se conservan en el navegador y las partidas de PDI en D1; los nombres introducidos para preparar letras no se almacenan.

## Contenido

- 130 recursos: 80 materiales imprimibles originales y 50 propuestas guiadas.
- 160 PDF A4: color y bajo consumo de tinta, con vista previa de cada página.
- 100 preguntas de asamblea, 50 retos, 6 canciones y 21 adivinanzas.
- 31 espacios de juego y proyección, con niveles, voz en español, favoritos PDI y sesiones de hasta cuatro juegos.
- Dos aventuras cooperativas, tres juegos de colocar piezas, tres cuentos originales con doce finales y una caja sorpresa.
- Taller de fichas A4: conteo, parejas, series y vocabulario; cuatro temas, tres tamaños, color o blanco y negro.
- Selecciones y partidas guardadas en D1, separadas por navegador mediante una cookie aleatoria HttpOnly. No se recogen datos del alumnado.
- Celebraciones con caritas, estrellas y mensajes de ánimo al acertar y al encontrar parejas en el memory. Avance manual y animación respetuosa con la preferencia de movimiento reducido.
- Taller de series con 5 patrones, 8 temas y 3 consignas; cada folio reúne cuatro series y no añade piezas recortables.
- Proyecto de dinosaurios organizado en seis bloques de dos semanas.
- Proyecto anual de Yayoi Kusama con 18 actividades, 18 ejemplos visuales diferentes y 10 imprimibles organizados en tres trimestres.
- Nueve ilustraciones digitales de dinosaurios con siluetas y colores diferenciados, compartidas por proyección, parejas, puzles y taller de fichas.
- Lectura «Dulce y alegre» por defecto; selección y prueba de las voces en español del dispositivo, con alternativa de voz natural.
- Selección diaria de seis propuestas y preparación semanal por áreas.

`public/` conserva los archivos públicos originales. El constructor prepara `dist/client/` y `dist/server/` para Sites. `public/fundamento.html` documenta la investigación, sus decisiones y 24 referencias consultadas el 9 de septiembre de 2026. Las fuentes externas sustentan los conceptos; no son necesarias para descargar los materiales locales.

## Fuentes y reconstrucción

`public/data.js` contiene el contenido editorial y `public/pdi.js` las rondas de los nuevos juegos. `scripts/build-materials.py` genera los PDF y sus imágenes a partir de esos datos y de las ilustraciones originales `sources/dinosaur-sheet.png` y `sources/classroom-paper.png`. Los dinosaurios son ilustraciones estilizadas, con colores imaginados y sin escala científica. Los ejemplos de montaje de Kusama viven en `public/assets/kusama/` y los 10 cuadernos nuevos se generan junto al resto de imprimibles.

La generación requiere Python con ReportLab, Pillow y PyMuPDF, Node y las fuentes DejaVu Sans instaladas en `/usr/share/fonts/truetype/dejavu/`. Ejecutar desde el proyecto:

```sh
python3 scripts/build-materials.py
node scripts/check-app.cjs
python3 scripts/check-materials.py
```

La colección digital se creó con la herramienta de generación de imágenes integrada: original en `sources/dinosaur-pdi-sheet.png` y encargo en `sources/dinosaur-pdi-prompt.txt`. `python3 scripts/extract-dinosaur-pdi.py` extrae sus nueve personajes a WebP transparente sin ampliar ni redibujar; necesita Pillow, NumPy y SciPy. Esta extracción no forma parte de la compilación habitual.

El constructor utiliza glifos de Noto Color Emoji, distribuido bajo SIL Open Font License 1.1. Se conserva su licencia en `scripts/NotoColorEmoji-LICENSE.txt` y se publica también en `public/assets/`. Fuente original: https://github.com/googlefonts/noto-emoji/blob/main/fonts/NotoColorEmoji.ttf . Tipografías web DM Sans y Nunito mediante Google Fonts, con fuentes de sistema de reserva.

Las verificaciones comprueban integridad de archivos, páginas, texto dentro de los límites, selección de actividades, filtros y lógica de los juegos. No sustituyen una prueba interactiva en navegador. Las hojas de contacto se usan para revisar visualmente los PDF.

## Publicación y comprobaciones

`npm run build` conserva las URL existentes y prepara los archivos públicos junto al endpoint de guardado. `.openai/hosting.json` declara la base D1 `DB`; `drizzle/` contiene sus migraciones. Una cookie aleatoria identifica el cuaderno de este navegador; los favoritos PDI, la sesión y la última partida se guardan en la base de datos. Los favoritos de materiales anteriores siguen usando su almacenamiento original. Si falla el guardado se ofrece reintentar sin perder la partida abierta.

`npm test` comprueba las reglas de los juegos, sesiones, recuperación, cuentos, fichas y aislamiento del guardado. La voz usa la síntesis del dispositivo y muestra una explicación si falta una voz en español. «Dulce y alegre» aplica un tono ligeramente más alto (1,22) y una velocidad de 0,9; el timbre depende del motor y no se garantiza una voz de niña o niño. Las preferencias de voz se guardan solo en este dispositivo (`rosa-voice-v1`), se actualiza la lista con `voiceschanged` y se conserva una alternativa española si desaparece la voz elegida. Los juegos de piezas admiten Pointer Events y selección por toque o teclado.

Referencias técnicas: [Cloudflare Assets](https://developers.cloudflare.com/workers/static-assets/binding/), [Web Speech](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/speak), [voces disponibles](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices), [tono](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/pitch) y [actualización de voces](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/voiceschanged_event).
