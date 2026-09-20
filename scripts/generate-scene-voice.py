"""Generate illustrated-PDI narration with the same local cloned voice as the main PDI bank.

This is a compatibility wrapper around generate-pdi-voice.py.  It deliberately
uses the project's existing Qwen3-TTS voice-clone reference instead of any
online TTS service, so no account, API key or runtime network request is needed
after the model has been downloaded once.
"""
from pathlib import Path
import os
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
batch_size = os.environ.get('ROSA_QWEN_BATCH_SIZE', '8')

cmd = [
    sys.executable,
    str(root / 'scripts/generate-pdi-voice.py'),
    '--input',
    'sources/scenes-voice-texts.json',
    '--output',
    'public/audio/pdi',
    '--progress',
    'sources/scenes-voice-generation-progress.json',
    '--batch-size',
    batch_size,
]

subprocess.run(cmd, cwd=root, check=True)
