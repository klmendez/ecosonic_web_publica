from __future__ import annotations
import importlib.util, json, shutil, sys
from pathlib import Path

PACKAGE=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path(__file__).resolve().parents[1]/"ULTIMO MODELO"
APP_FILE=PACKAGE/"PÁGINA"/"backend"/"app.py"
PUBLIC=Path(__file__).resolve().parents[1]/"public"

spec=importlib.util.spec_from_file_location("ecosonic_maps_backend",APP_FILE)
app=importlib.util.module_from_spec(spec);sys.modules[spec.name]=app;spec.loader.exec_module(app)
result=app.process_csv_from_path(app.DEFAULT_CSV_PATH)
maps_dir=PUBLIC/"maps";maps_dir.mkdir(parents=True,exist_ok=True)
for item in result["maps"]:
    source=app.PAGE_ROOT/item["href"].lstrip("/")
    target=maps_dir/f'{item["class_name"]}_{item["period"]}.png'
    shutil.copy2(source,target);item["href"]=f'/maps/{target.name}'
(PUBLIC/"data").mkdir(parents=True,exist_ok=True)
(PUBLIC/"data"/"maps.json").write_text(json.dumps(result,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
print(json.dumps({"maps":len(result["maps"]),"directory":str(maps_dir)},ensure_ascii=False))
