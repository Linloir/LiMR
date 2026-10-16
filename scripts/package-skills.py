#!/usr/bin/env python3
"""Build portable skill archives and the Playground's download assets."""
import hashlib
import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parents[1]
VERSION = json.loads((ROOT / 'package.json').read_text())['version']
NAMES = ('limr-use', 'limr-plugin-development')
OUTPUT = ROOT / 'artifacts' / 'skills'
PUBLIC = ROOT / 'playground' / 'public' / 'downloads'


def archive(name, skills):
    path = OUTPUT / name
    with ZipFile(path, 'w', compression=ZIP_DEFLATED) as bundle:
        for skill in skills:
            directory = ROOT / 'skills' / skill
            if not (directory / 'SKILL.md').is_file():
                raise RuntimeError(f'Missing skill: {skill}')
            for file in sorted(directory.rglob('*')):
                if not file.is_file() or any(part in ('node_modules', 'dist', '__pycache__') for part in file.parts):
                    continue
                info = ZipInfo(file.relative_to(ROOT / 'skills').as_posix())
                info.compress_type = ZIP_DEFLATED
                info.external_attr = 0o100644 << 16
                bundle.writestr(info, file.read_bytes())
    with ZipFile(path) as bundle:
        if bundle.testzip() is not None:
            raise RuntimeError(f'Invalid archive: {path}')
    (PUBLIC / name).write_bytes(path.read_bytes())
    return f'{hashlib.sha256(path.read_bytes()).hexdigest()}  {name}'


OUTPUT.mkdir(parents=True, exist_ok=True)
PUBLIC.mkdir(parents=True, exist_ok=True)
# Keep the downloadable site identical to a clean CI build. Historical release
# archives stay in artifacts/skills; the site serves the current release only.
for stale in PUBLIC.glob('limr-skills-*.zip'):
    if stale.name != f'limr-skills-{VERSION}.zip':
        stale.unlink()
checksums = [archive(f'{name}.zip', [name]) for name in NAMES]
checksums.append(archive(f'limr-skills-{VERSION}.zip', NAMES))
for destination in (OUTPUT, PUBLIC):
    (destination / 'SHA256SUMS').write_text('\n'.join(checksums) + '\n')
print(f'Skills {VERSION}: {len(checksums)} archives in {OUTPUT} and {PUBLIC}')
