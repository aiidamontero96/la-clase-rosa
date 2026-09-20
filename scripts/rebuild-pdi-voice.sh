#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Keep the large local TTS environment out of the project/repository.
# Override with ROSA_QWEN_VENV if you prefer another location.
VENV="${ROSA_QWEN_VENV:-$HOME/.cache/la-clase-rosa/qwen-tts-venv}"
PY="$VENV/bin/python"
PIP="$VENV/bin/pip"

if [ ! -f sources/pdi-voice-reference.wav ]; then
  echo "ERROR: falta sources/pdi-voice-reference.wav, la muestra original de la voz Rosa." >&2
  exit 1
fi

if [ ! -f scripts/generate-pdi-voice.py ]; then
  echo "ERROR: falta scripts/generate-pdi-voice.py." >&2
  exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ERROR: ffmpeg no está instalado. Ejecuta: sudo apt install ffmpeg" >&2
  exit 1
fi

if [ ! -x "$PY" ]; then
  echo "Primera instalación de la voz local Qwen3-TTS. Puede tardar y descargar varios GB una sola vez."
  mkdir -p "$(dirname "$VENV")"
  python3 -m venv "$VENV"
  "$PIP" install --upgrade pip setuptools wheel
  # Force CPU PyTorch in WSL so pip does not pull CUDA packages unnecessarily.
  "$PIP" install --index-url https://download.pytorch.org/whl/cpu torch torchaudio
  "$PIP" install "qwen-tts==0.1.1" soundfile
fi

if ! "$PY" - <<'PY' >/dev/null 2>&1
import qwen_tts, torch, soundfile
PY
then
  echo "El entorno Qwen existe pero le faltan dependencias. Reparándolo..."
  "$PIP" install --upgrade --index-url https://download.pytorch.org/whl/cpu torch torchaudio
  "$PIP" install --upgrade "qwen-tts==0.1.1" soundfile
fi

node scripts/collect-scene-speech.cjs

echo
echo "Generando únicamente las narraciones que faltan con la voz local clonada 'Rosa'..."
echo "Referencia: sources/pdi-voice-reference.wav"
echo "Modelo: Qwen/Qwen3-TTS-12Hz-0.6B-Base"
echo "Puedes interrumpir con Ctrl+C: al volver a ejecutar continuará con los MP3 pendientes."
echo

"$PY" scripts/generate-scene-voice.py
node scripts/finalize-scene-voice.cjs

printf '\nVoz PDI reconstruida con el clon local Rosa. Los MP3 existentes no se sobrescriben.\n'
printf 'El modelo queda en la caché local; la web publicada solo contiene los MP3.\n'
printf 'Reinicia npm run dev si estaba abierto.\n'
