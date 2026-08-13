from __future__ import annotations
import json,sys
from pathlib import Path
from PIL import Image

PACKAGE=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path(__file__).resolve().parents[1]/"ULTIMO MODELO"
ROOT=Path(__file__).resolve().parents[1]
available=json.loads((ROOT/"public"/"data"/"available.json").read_text(encoding="utf-8"))
sources={"frames":PACKAGE/"DATA"/"IMAGENES"/"FRAMES_CADA_2_MIN_Completo","mels":PACKAGE/"DATA"/"IMAGENES"/"MELS_CADA_2_MIN_Completo"}
for kind,source_dir in sources.items():
    target_dir=ROOT/"public"/"media"/kind;target_dir.mkdir(parents=True,exist_ok=True)
    for i,item in enumerate(available,1):
        source=source_dir/f'{item["key"]}.png';target=target_dir/f'{item["key"]}.webp'
        if target.is_file() and target.stat().st_mtime>=source.stat().st_mtime: continue
        with Image.open(source) as image:
            image.convert("RGB").save(target,"WEBP",quality=88 if kind=="frames" else 90,method=6)
        if i%100==0: print(kind,i,flush=True)
print("Media web terminada")
