"""Rebuild shipped fonts: python subset-fonts.py /path/MapleMono-NF-CN-unhinted.zip.

Requires fonttools[woff]. Input is the official v7.9 release. No build-time or
runtime network access is needed once the generated assets are checked in.
"""
import hashlib
import io
import json
import logging
import sys
import zipfile
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'src/fonts'
VERSION = '7.9'
STYLES = [('Regular', 400, 'normal'), ('Bold', 700, 'normal'), ('Italic', 400, 'italic'), ('BoldItalic', 700, 'italic')]


def make_style(args):
    archive, face, weight, style = args
    logging.getLogger('fontTools').setLevel(logging.ERROR)
    with zipfile.ZipFile(archive) as z:
        raw = z.read(f'MapleMono-NF-CN-{face}.ttf')
    original = TTFont(io.BytesIO(raw))
    points = sorted(original.getBestCmap())
    # Latin/Greek/Cyrillic share a small initial request; all other scripts and
    # icons load only the Unicode pages actually used by visible code.
    groups = {'latin': [p for p in points if p < 0x530]}
    for point in points:
        if point >= 0x530:
            groups.setdefault(f'{point // 512:03x}', []).append(point)
    rules, manifest = [], []
    for name, unicodes in groups.items():
        font = TTFont(io.BytesIO(raw), recalcTimestamp=False)
        options = subset.Options()
        options.layout_features = ['*']
        options.name_IDs = ['*']
        options.name_legacy = True
        options.name_languages = ['*']
        worker = subset.Subsetter(options=options)
        worker.populate(unicodes=unicodes)
        worker.subset(font)
        # A derived web subset has its own family name; preserve attribution.
        for record in font['name'].names:
            if record.nameID in (1, 4, 6, 16):
                value = f'LiMR Maple Mono NF CN {face}' if record.nameID in (4, 6) else 'LiMR Maple Mono NF CN'
                record.string = (value.replace(' ', '') if record.nameID == 6 else value).encode(record.getEncoding())
        font.flavor = 'woff2'
        buffer = io.BytesIO(); font.save(buffer)
        data = buffer.getvalue()
        digest = hashlib.sha256(data).hexdigest()[:10]
        filename = f'maple-{VERSION}-{face.lower()}-{name}-{digest}.woff2'
        (OUT / filename).write_bytes(data)
        # Compact exact contiguous coverage prevents unnecessary parallel fetches.
        ranges = []
        first = last = unicodes[0]
        for point in unicodes[1:] + [None]:
            if point is not None and point == last + 1:
                last = point; continue
            ranges.append(f'U+{first:X}' if first == last else f'U+{first:X}-{last:X}')
            first = last = point
        coverage = ','.join(ranges)
        rules.append(f'@font-face {{ font-family: "LiMR Maple Mono NF CN"; font-style: {style}; font-weight: {weight}; font-display: swap; src: url("./{filename}") format("woff2"); unicode-range: {coverage}; }}')
        manifest.append({'file': filename, 'bytes': len(data), 'weight': weight, 'style': style, 'coverage': coverage})
    print(f'{face}: {len(manifest)} subsets, {sum(m["bytes"] for m in manifest):,} bytes', flush=True)
    return rules, manifest


if __name__ == '__main__':
    archive = str(Path(sys.argv[1]).resolve())
    OUT.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(archive) as z:
        (OUT / 'LICENSE.txt').write_bytes(z.read('LICENSE.txt'))
    with ProcessPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(make_style, [(archive, *style) for style in STYLES]))
    (OUT / 'maple.css').write_text('/* Maple Mono NF CN v7.9, SIL OFL 1.1. Locally served, character subsets. */\n' + '\n'.join(rule for rules, _ in results for rule in rules) + '\n')
    (OUT / 'manifest.json').write_text(json.dumps({'source': 'https://github.com/subframe7536/maple-font/releases/tag/v7.9', 'archiveSha256': hashlib.sha256(Path(archive).read_bytes()).hexdigest(), 'subsets': [item for _, items in results for item in items]}, indent=2) + '\n')
