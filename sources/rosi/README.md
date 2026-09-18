# Piloto de Rosi

Un único episodio: «El dinosaurio escondido». Abre la misión de la semana 1, con seis retos de pistas, dos dinosaurios ausentes y reconstrucción de un orden de cuatro. Reutiliza la PDI, el banco de voz local y su velocidad actual (1.12, conservando el tono). No hace llamadas a proveedores de voz ni genera contenido durante la reproducción.

## Configuración

`public/rosi-config.js` contiene el nombre de la mascota, la lista de diez alumnos, los dos ayudantes del piloto, el guion y la actividad final. El nombre de la mascota se define únicamente en `mascot.name`; el guion utiliza `{mascot}`, `{helper1}` y `{helper2}`. No se han generado episodios adicionales ni una rotación automática.

Al cambiar nombres o frases hay que preparar una nueva versión de los MP3 estáticos antes de publicar. Los cambios de texto nunca activan una voz alternativa en el navegador.

1. Ejecutar `node scripts/prepare-rosi-episode.cjs`.
2. Utilizar el entorno local de voz ya existente (Qwen3-TTS 0.6B y la referencia autorizada de PDI): `python scripts/generate-pdi-voice.py --input sources/rosi-voice-clips.json --output public/audio/pdi/rosi --progress sources/rosi-voice-progress.json --batch-size 8`. El modelo local se indica con `ROSA_TTS_MODEL`. El generador conserva los clips existentes y crea solo los hashes que faltan.
3. Ejecutar `python scripts/finalize-rosi-episode.py`. Reúne las frases, calcula tiempos de subtítulos y una envolvente de volumen para los movimientos de boca. También crea el bucle musical original de 24 segundos. Requiere numpy, soundfile, ffmpeg y Node, sin servicios externos.
4. Ejecutar `node scripts/check-rosi.cjs`, las comprobaciones del proyecto y la vista previa antes de publicar.

## Recursos reutilizables

`public/assets/rosi/rosi-atlas.webp` es un único atlas transparente de la mascota. `valle.webp` es el único fondo. `generation-prompts.json` y `atlas-regions.json` conservan los encargos originales y las coordenadas de las piezas. Las piezas se montan con ventanas SVG sobre el mismo atlas, sin duplicar ilustraciones. CSS anima ojos, cabeza, brazos, cuerpo, hojas y luz; el tiempo del MP3 dirige las expresiones, los subtítulos y la boca. Las preferencias de movimiento reducido se respetan.

La música y la voz se detienen al pausar, cerrar, cambiar de sección u ocultar la pestaña. La música tiene un control independiente. En dispositivos sin pantalla completa nativa se ofrece un reproductor que ocupa la pantalla del navegador.

## Misiones semanales

`public/rosi-missions.js` configura doce misiones de seis retos, alineadas con las seis etapas del proyecto existente. Solo hay un episodio animado. Las otras semanas son secuencias de juegos, sin vídeos ni episodios adicionales.

La misión se indica en el `payload` del proyector existente. Reutiliza sus controles, voz, respuestas, celebraciones, puzles, conteo y ordenación de piezas. Las tareas nuevas usan cuatro opciones, selección de dos ausentes, orden de cuatro, dos huecos de series AAB/ABB/ABC, cantidades y clasificación completa de seis dinosaurios. El botón siguiente se habilita al resolver el reto. Se puede volver a observar el modelo sin reloj ni penalización.

La dificultad se fija para cada reto (seis piezas en los puzles; nivel 3 en las demás tareas). No cambia el nivel elegido para la PDI normal ni sobrescribe su partida guardada. El selector de semana es una preferencia local del dispositivo. `check-rosi-missions.cjs` recorre y resuelve los 72 retos, verifica los errores, el paso al siguiente, los archivos de voz y la preservación de las preferencias.

Para nuevas consignas, ejecutar `node scripts/prepare-rosi-missions.cjs`. Este inventario excluye los textos ya grabados. Generar los que falten con `scripts/generate-pdi-voice.py --input sources/rosi-mission-voice-clips.json --output public/audio/pdi/rosi-missions --progress sources/rosi-mission-voice-progress.json --batch-size 8`. El manifiesto complementario se carga sobre el banco existente.

## Corrección facial

La cabeza corregida `rosi-head.webp` elimina la sonrisa dibujada que se duplicaba bajo la boca animada. Se conservan cuerpo, mochila, brazos, ojos y boca del atlas original. La edición devolvió RGB con fondo neutro en lugar de alpha; la ventana SVG aplica una opacidad calculada por la diferencia entre rojo y verde para quitar ese fondo sin una segunda generación. El filtro usa sRGB y un identificador único por instancia. Los archivos de encargo y validación de la edición están en esta carpeta.
