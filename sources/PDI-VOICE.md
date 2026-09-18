# Voz de la PDI

Los audios se generan una vez y se sirven como MP3 del propio sitio. El navegador no llama a un servicio de síntesis ni necesita claves. No se usa SpeechSynthesis como alternativa.

- Modelo: Qwen/Qwen3-TTS-12Hz-0.6B-Base, licencia Apache 2.0.
- Idioma: español.
- Referencia: la muestra aportada por la usuaria, conservada en `sources/pdi-voice-reference.wav` para poder regenerar los materiales. No se sirve desde `public/`.
- Voz: timbre generado a partir de esa referencia. No es la voz Microsoft Marina.
- Velocidad de los archivos originales: 0,94, mediante `atempo` sin cambiar el tono.
- Reproducción en PDI: 1,12 veces la velocidad de los MP3, conservando el tono. Este ajuste está en `ROSA_VOICE.playbackRate`; se aplica a todas las consignas, respuestas y muestras. No genera nuevos audios al pulsar el botón.
- La muestra `public/audio/muestra-voz-fluida.mp3` lleva ese mismo aumento del 12 % ya aplicado para poder escucharla fuera de la PDI.
- Formato: MP3 mono, 24 kHz, 80 kb/s.
- Reproducción: un MP3 por texto de las actividades, montado a partir de fragmentos pregrabados; las fechas variables usan los mismos fragmentos. Los audios se detienen al cambiar de actividad o pulsar Parar voz.
- Calendario: días, meses y números pregrabados para componer las fechas.

## Regenerar

1. `node scripts/collect-pdi-speech.cjs`
2. `node scripts/prepare-pdi-voice.cjs`
3. En un entorno Python con `qwen-tts==0.1.1`, PyTorch CPU y ffmpeg: `python scripts/generate-pdi-voice.py`.
4. `node scripts/finalize-pdi-voice.cjs`
5. `node scripts/check-voice.cjs`

La generación se puede reanudar; conserva los MP3 que ya existen. Si cambian el modelo, la referencia o la pronunciación, retirar los archivos afectados antes de regenerarlos. Los modelos se descargan por separado y no forman parte de la web.

Documentación del modelo: https://github.com/QwenLM/Qwen3-TTS

La voz se ha comprobado con reconocimiento de habla independiente y reproducción de MP3 en la vista previa. La valoración del timbre infantil corresponde a la revisión de las muestras por la maestra.

## Escenas ilustradas y voz automática — septiembre de 2026

Las nuevas escenas, consignas generales y funciones de encargados añaden grabaciones estáticas en español (es-ES-ElviraNeural, -8% en la generación). Se mantienen los audios anteriores; no se introduce síntesis en el navegador ni peticiones TTS en producción. La nueva narradora tiene un timbre distinto al banco original.

`collect-scene-speech.cjs` recoge únicamente narraciones generales y excluye coincidencias con nombres del alumnado. `generate-scene-voice.py` genera esos textos una vez con edge-tts, y `finalize-scene-voice.cjs` comprueba los archivos y escribe el manifiesto complementario. Los nombres elegidos para cada encargo se muestran en pantalla; la locución de los nombres queda pendiente de autorización o de grabaciones locales aportadas por la docente. La revisión automática rechazó enviarlos a un servicio externo.
