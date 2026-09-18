#!/usr/bin/env python3
"""Extract nine native-size dinosaur sprites from the original generated sheet.

Dependencies: Pillow, NumPy, SciPy.
Usage:
  python scripts/extract-dinosaur-pdi.py [SOURCE.png] [OUTPUT_DIRECTORY]

The original image is never modified. No pixels are resized, recolored, or
redrawn. Alpha-connected dinosaur cores identify ownership; nearest-core
assignment retains antialiased fragments without collecting neighboring tails.
Only remote, detached 1/255-opacity generator dust is omitted. Lossless WebP
round trips are checked byte-for-byte against each native RGBA canvas.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

NAMES = (
    "trex", "triceratops", "stegosaurus",
    "brachiosaurus", "velociraptor", "ankylosaurus",
    "diplodocus", "parasaurolophus", "spinosaurus",
)
CORE_ALPHA_THRESHOLD = 48
MIN_CORE_AREA = 2000
FRINGE_DISTANCE = 16
MIN_PADDING = 32
CANVAS_MULTIPLE = 32


def bounds(mask: np.ndarray) -> tuple[int, int, int, int]:
    ys, xs = np.where(mask)
    if not len(xs):
        raise ValueError("Cannot bound an empty dinosaur mask.")
    return int(xs.min()), int(ys.min()), int(xs.max() + 1), int(ys.max() + 1)


def extract(source: Path, output: Path) -> dict:
    rgba = np.array(Image.open(source).convert("RGBA"))
    alpha = rgba[:, :, 3]
    height, width = alpha.shape
    if width != height:
        raise ValueError("Expected the selected square 3 by 3 source sheet.")

    raw_core, _ = ndimage.label(alpha > CORE_ALPHA_THRESHOLD)
    areas = np.bincount(raw_core.ravel())
    major_ids = [i for i, area in enumerate(areas) if i and area >= MIN_CORE_AREA]
    if len(major_ids) != 9:
        raise ValueError(f"Expected nine dinosaur cores; found {len(major_ids)}.")
    core = np.where(np.isin(raw_core, major_ids), raw_core, 0)

    labels_by_name = {}
    for label in major_ids:
        left, top, right, bottom = bounds(core == label)
        column = min(2, int(((left + right) / 2) / (width / 3)))
        row = min(2, int(((top + bottom) / 2) / (height / 3)))
        name = NAMES[row * 3 + column]
        if name in labels_by_name:
            raise ValueError(f"Multiple cores assigned to {name}.")
        labels_by_name[name] = label
    if set(labels_by_name) != set(NAMES):
        raise ValueError("The source does not have the expected species positions.")

    distance, nearest = ndimage.distance_transform_edt(core == 0, return_indices=True)
    owner = core[tuple(nearest)]
    retained = (alpha > 0) & (distance <= FRINGE_DISTANCE)
    excluded = (alpha > 0) & ~retained
    excluded_count = int(excluded.sum())
    excluded_max_alpha = int(alpha[excluded].max()) if excluded_count else 0
    if excluded_max_alpha > 1:
        raise ValueError("Fringe radius would omit visible artwork; inspect before extracting.")

    # Every alpha-connected pixel in each principal animal must be retained.
    all_components, _ = ndimage.label(alpha > 0)
    principal_ids = np.unique(all_components[core > 0])
    principal_mask = np.isin(all_components, principal_ids) & (alpha > 0)
    if np.any(principal_mask & ~retained):
        raise ValueError("The fringe radius cuts an alpha-connected animal edge.")

    masks = {name: retained & (owner == labels_by_name[name]) for name in NAMES}
    boxes = {name: bounds(mask) for name, mask in masks.items()}
    largest = max(max(right - left, bottom - top) for left, top, right, bottom in boxes.values())
    side = ((largest + 2 * MIN_PADDING + CANVAS_MULTIPLE - 1) // CANVAS_MULTIPLE) * CANVAS_MULTIPLE

    output.mkdir(parents=True, exist_ok=True)
    sprites = []
    copied_pixels = 0
    for index, name in enumerate(NAMES):
        mask = masks[name]
        left, top, right, bottom = boxes[name]
        animal_width, animal_height = right - left, bottom - top
        offset_x = (side - animal_width) // 2
        offset_y = (side - animal_height) // 2
        cropped = rgba[top:bottom, left:right].copy()
        cropped[~mask[top:bottom, left:right]] = 0
        canvas = np.zeros((side, side, 4), dtype=np.uint8)
        canvas[offset_y:offset_y + animal_height, offset_x:offset_x + animal_width] = cropped
        pixel_count = int(mask.sum())
        if int((canvas[:, :, 3] > 0).sum()) != pixel_count:
            raise ValueError(f"Pixel count changed while placing {name}.")
        copied_pixels += pixel_count

        path = output / f"{name}.webp"
        Image.fromarray(canvas).save(
            path, format="WEBP", lossless=True, quality=100, method=6, exact=True
        )
        decoded = np.array(Image.open(path).convert("RGBA"))
        if not np.array_equal(decoded, canvas):
            raise ValueError(f"Lossless RGBA round trip failed for {name}.")
        if np.any(decoded[0, :, 3]) or np.any(decoded[-1, :, 3]) or np.any(decoded[:, 0, 3]) or np.any(decoded[:, -1, 3]):
            raise ValueError(f"{name} touches the output canvas edge.")

        sprites.append({
            "name": name,
            "filename": path.name,
            "row": index // 3,
            "column": index % 3,
            "width": side,
            "height": side,
            "source_bounds_xyxy_exclusive": [left, top, right, bottom],
            "native_artwork_width": animal_width,
            "native_artwork_height": animal_height,
            "placement_xy": [offset_x, offset_y],
            "nontransparent_pixels": pixel_count,
            "file_bytes": path.stat().st_size,
            "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            "lossless_rgba_verified": True,
        })
    if copied_pixels != int(retained.sum()):
        raise ValueError("Pixels were omitted or assigned more than once.")

    manifest = {
        "source_filename": source.name,
        "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "source_width": width,
        "source_height": height,
        "format": "lossless WebP RGBA",
        "resizing": "none",
        "canvas_side": side,
        "minimum_transparent_padding": MIN_PADDING,
        "core_alpha_threshold": CORE_ALPHA_THRESHOLD,
        "fringe_radius_pixels": FRINGE_DISTANCE,
        "excluded_remote_background_pixels": excluded_count,
        "excluded_remote_background_max_alpha": excluded_max_alpha,
        "all_alpha_connected_dinosaur_pixels_preserved": True,
        "retained_nontransparent_pixels": copied_pixels,
        "sprites": sprites,
    }
    (output / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    return manifest


if __name__ == "__main__":
    base = Path(__file__).resolve().parent.parent
    source_path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else base / "sources" / "dinosaur-pdi-sheet.png"
    output_path = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else base / "public" / "assets" / "dinos-pdi"
    result = extract(source_path, output_path)
    for sprite in result["sprites"]:
        print(f"{output_path / sprite['filename']}  {sprite['width']}x{sprite['height']}  {sprite['file_bytes']} bytes")
    print(f"Verified all nine lossless RGBA exports. Omitted {result['excluded_remote_background_pixels']} detached background pixels with alpha <= {result['excluded_remote_background_max_alpha']}/255.")
