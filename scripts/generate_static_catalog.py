from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd

PACKAGE = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parents[1] / "ULTIMO MODELO"
APP_FILE = PACKAGE / "PÁGINA" / "backend" / "app.py"
OUT = Path(__file__).resolve().parents[1] / "public" / "data"


def load_backend():
    spec = importlib.util.spec_from_file_location("ecosonic_backend", APP_FILE)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def native(value):
    if isinstance(value, (np.integer,)): return int(value)
    if isinstance(value, (np.floating,)): return float(value)
    return value


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    app = load_backend()
    bundle, data, visual = app._dap_resources()
    frames = PACKAGE / "DATA" / "IMAGENES" / "FRAMES_CADA_2_MIN_Completo"
    mels = PACKAGE / "DATA" / "IMAGENES" / "MELS_CADA_2_MIN_Completo"
    candidates = []
    for frame in sorted(frames.glob("punto_*_P*_*.png")):
        if not (mels / frame.name).is_file(): continue
        point, period, minute = app._uploaded_block(frame.name)
        candidates.append((f"punto_{point:02d}_P{period}_{minute}min", point, period, minute))

    acoustic_cols = ["B_media","B_p90","G_media","MH_media","VI_media","SI_media","TM_media","TM_p90"]
    data = data.copy()
    data["_point"] = pd.to_numeric(data["puntoId"], errors="coerce")
    data["_period"] = pd.to_numeric(data["periodo_n"], errors="coerce")
    medians = {c: float(pd.to_numeric(data[c], errors="coerce").median()) for c in acoustic_cols}
    grouped = data.groupby(["_point","_period"], dropna=True)
    acoustic_cache = {}
    observation_cache = grouped.size().to_dict()
    for key, group in grouped:
        acoustic_cache[(int(key[0]), int(key[1]))] = {
            c: native(pd.to_numeric(group[c], errors="coerce").median()) for c in acoustic_cols
        }

    visual = visual.copy()
    visual["_point"] = pd.to_numeric(visual["Punto"], errors="coerce")
    visual["_period"] = visual["Periodo"].astype(str).str.upper().str.removeprefix("P").astype(int)
    visual["_block"] = pd.to_numeric(visual["Bloque de 2 min"], errors="coerce")
    visual_lookup = {(int(r["_point"]),int(r["_period"]),int(r["_block"])):r for _,r in visual.iterrows()}
    vcols = {
        "personas_visual":"Personas (%)","peatonal_visual":"Espacio peatonal (%)",
        "vegetacion_visual":"Parques y vegetación (%)","vias_visual":"Vías (%)",
        "vehiculos_visual":"Vehículos (%)","cielo_visual":"Cielo (%)",
    }

    profile = {c: float(pd.to_numeric(data[c],errors="coerce").median()) for c in ("edad","ingresos_num","personasHogar","preocupacionAmbiental")}
    categories = {c: app._mode(data[c]) for c in ("genero","nivelEducativo","ocupacion","familiaridad","tipoPuntoEvaluado")}
    rows, env_rows, valid = [], [], []
    for key, point, period, minute in candidates:
        view = visual_lookup.get((point,period,minute//2))
        if view is None: continue
        acoustic = acoustic_cache.get((point,period), medians).copy()
        acoustic = {c: (medians[c] if not np.isfinite(float(acoustic.get(c,np.nan))) else float(acoustic[c])) for c in acoustic_cols}
        env = dict(acoustic)
        for dest, source in vcols.items(): env[dest] = float(view[source])
        env["trafico_congruente"] = env["TM_media"]*(env["vehiculos_visual"]+env["vias_visual"])
        env["naturaleza_congruente"] = (env["B_media"]+env["G_media"])*env["vegetacion_visual"]
        env["balance_natural_trafico"] = env["naturaleza_congruente"]-env["trafico_congruente"]
        rows.append({**env,**profile,**categories,"periodo_n":period})
        env_rows.append(env); valid.append((key,point,period,minute,view))

    input_df = pd.DataFrame(rows)
    env_df = pd.DataFrame(env_rows)[bundle["environment_features"]]
    for col, model in bundle["perception_models"].items(): input_df[col] = np.clip(model.predict(env_df),1,5)
    input_df["isoAnimado"] = float(pd.to_numeric(data["isoAnimado"],errors="coerce").median())
    input_df["isoMonotono"] = float(pd.to_numeric(data["isoMonotono"],errors="coerce").median())
    matrix = bundle["preprocessor"].transform(input_df[bundle["features"]]).astype(np.float32)
    probabilities = bundle["classifier"].predict_proba(matrix)[:,1]
    amounts = np.clip(bundle["regressor"].predict(matrix),0,15000)

    raw = pd.read_csv(app.ACOUSTIC_DATA_PATH)
    keys = raw["Image_Name"].astype(str).str.extract(r"PPN_(\d+)_P(\d+)_",expand=True)
    raw["_point"] = pd.to_numeric(keys[0],errors="coerce"); raw["_period"] = pd.to_numeric(keys[1],errors="coerce")
    amap = {"Biofonía":"B","Geofonía":"G","Actividad humana":"MH","Silencio":"SI","Tráfico motorizado":"TM","Voces":"VI"}
    agroups = {(int(k[0]),int(k[1])):g for k,g in raw.groupby(["_point","_period"])}
    visual_map = {"Personas":"Personas (%)","Edificios":"Edificios (%)","Espacio peatonal":"Espacio peatonal (%)","Vegetación":"Parques y vegetación (%)","Vías":"Vías (%)","Vehículos":"Vehículos (%)","Cielo":"Cielo (%)","Otros":"Otros elementos (%)"}

    predictions, evidence, available = {}, {}, []
    for i,(key,point,period,minute,view) in enumerate(valid):
        env=env_rows[i]; probability=float(probabilities[i]); amount=float(amounts[i]); expected=probability*amount
        traffic=min(100.0,100*np.mean([env["TM_media"],env["vehiculos_visual"],env["vias_visual"]]))
        nature=min(100.0,100*np.mean([env["B_media"],env["G_media"],env["vegetacion_visual"]]))
        predictions[key]={"point":point,"period":f"P{period}","minute":minute,"probability_pay":probability*100,"amount_if_pay":amount,"expected_dap":expected,"interval80":[max(0,expected-bundle["interval_q80"]),expected+bundle["interval_q80"]],"interval90":[max(0,expected-bundle["interval_q90"]),expected+bundle["interval_q90"]],"confidence":"Alta" if abs(probability-.5)>.30 else ("Media" if abs(probability-.5)>.15 else "Baja"),"traffic":traffic,"nature":nature,"balance":nature-traffic,"profile":{"edad":profile["edad"],"ingresos":profile["ingresos_num"],"personas_hogar":profile["personasHogar"]},"scope":"Valoración ambiental estandarizada; no corresponde a una tasación individual."}
        ag=agroups.get((point,period)); acoustic=[]
        for label,col in amap.items():
            val=pd.to_numeric(ag[col],errors="coerce").mean() if ag is not None else np.nan
            acoustic.append({"label":label,"value":None if pd.isna(val) else float(val)*100})
        evidence[key]={"point":point,"period":f"P{period}","minute":minute,"visual":[{"label":label,"value":float(view[col])*100} for label,col in visual_map.items()],"acoustic":acoustic,"visual_scope":f"Bloque exacto {max(0,minute-2)}–{minute} minutos.","acoustic_scope":"Taxonomía consolidada para el punto y periodo; no representa exclusivamente este bloque.","observations":int(observation_cache.get((point,period),0)),"acoustic_segments":0 if ag is None else len(ag)}
        available.append({"key":key,"point":point,"period":f"P{period}","minute":minute})

    environmental=json.loads(app.ENVIRONMENTAL_JSON_PATH.read_text(encoding="utf-8")); names={int(x["puntoId"]):x for x in json.loads(app.POINT_NAMES_PATH.read_text(encoding="utf-8"))}
    for record in environmental:
        geo=names.get(int(record["puntoId"]),{}); record["nombre_tecnico"]=record.get("puntoNombre"); record["puntoNombre"]=geo.get("nombre_geografico",record.get("puntoNombre"))
        for field in ("direccion_completa","calle","barrio","lugar_cercano"): record[field]=geo.get(field)
    payloads={"predictions.json":predictions,"evidence.json":evidence,"available.json":available,"environmental.json":environmental}
    for name,payload in payloads.items(): (OUT/name).write_text(json.dumps(payload,ensure_ascii=False,separators=(",",":"),default=native),encoding="utf-8")
    print(json.dumps({"combinations":len(available),"files":{k:(OUT/k).stat().st_size for k in payloads}},indent=2))

if __name__=="__main__": main()
