import { useEffect, useState } from "react";
import { PageHero } from "../App";
import type { MapData } from "../types";
import { getMaps } from "../staticData";
const labels: Record<string, { name: string; description: string }> = {
  B: {
    name: "Biofonía",
    description:
      "Sonidos producidos por organismos vivos, especialmente aves e insectos.",
  },
  G: {
    name: "Geofonía",
    description:
      "Sonidos naturales no biológicos, como viento, lluvia o movimiento del agua.",
  },
  MH: {
    name: "Actividad humana",
    description: "Actividad antrópica general distinta del tráfico motorizado.",
  },
  SI: {
    name: "Silencio relativo",
    description:
      "Escenarios con baja presencia de eventos acústicos dominantes.",
  },
  TM: {
    name: "Tráfico motorizado",
    description:
      "Vehículos, motocicletas y otros sonidos asociados a la movilidad.",
  },
  VI: {
    name: "Voces e interacción",
    description: "Conversaciones, voces y presencia social audible.",
  },
  BI: {
    name: "Biofonía",
    description: "Sonidos producidos por organismos vivos.",
  },
  GE: { name: "Geofonía", description: "Sonidos naturales no biológicos." },
  VM: {
    name: "Voces e interacción",
    description: "Voces y actividad social audible.",
  },
};
const friendly = (code: string) => labels[code]?.name || code;
export default function Maps() {
  const [data, setData] = useState<MapData>();
  const [error, setError] = useState("");
  const [cls, setCls] = useState("");
  const [period, setPeriod] = useState("");
  useEffect(() => {
    getMaps()
      .then((d: MapData) => {
        if (d.error) throw Error(d.error);
        setData(d);
        setCls(d.classes[0]);
        setPeriod(d.periods[0]?.id);
      })
      .catch((e) => setError(e.message));
  }, []);
  const map = data?.maps.find(
      (x) => x.class_name === cls && x.period === period,
    ),
    selected = labels[cls],
    summary = data?.period_means?.[period] ?? data?.class_means,
    periodLabel = data?.periods.find((x) => x.id === period)?.label;
  return (
    <>
      <PageHero
        kicker="Cartografía acústica"
        title="Escucha los patrones invisibles de la ciudad."
        text="Selecciona una fuente sonora y una franja horaria para observar cómo cambia su presencia estimada entre los puntos de Popayán."
      />
      <section className="section">
        <div className="wrap mapWorkspace">
          <aside className="mapSidebar">
            <div className="kicker dark">Configurar mapa</div>
            <h2>¿Qué quieres observar?</h2>
            <label className="field">
              Fuente sonora
              <select value={cls} onChange={(e) => setCls(e.target.value)}>
                {data?.classes.map((x) => (
                  <option key={x} value={x}>
                    {friendly(x)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Franja horaria
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                {data?.periods.map((x) => (
                  <option value={x.id} key={x.id}>
                    {x.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="selectedSound">
              <small>FUENTE SELECCIONADA</small>
              <strong>{friendly(cls) || "Cargando…"}</strong>
              <p>
                {selected?.description || "Preparando la información acústica."}
              </p>
            </div>
            <div className="scale">
              <small>LECTURA DEL COLOR</small>
              <div className="gradient" />
              <div>
                <span>Menor presencia</span>
                <span>Mayor presencia</span>
              </div>
            </div>
            <p className="mapHelp">
              El mapa representa probabilidades medias estimadas por la CNN
              acústica. No corresponde a niveles de presión sonora en decibeles.
            </p>
          </aside>
          <div className="mapContent">
            <div className="mapHeading">
              <div>
                <small>MAPA ACTIVO</small>
                <h2>
                  {friendly(cls)} {map ? `· ${map.period_label}` : ""}
                </h2>
              </div>
              <span>
                {data
                  ? `${data.maps.length} visualizaciones disponibles`
                  : "Generando mapas…"}
              </span>
            </div>
            <div className="mapArea">
              <div className="mapLabel">
                {map
                  ? `${friendly(map.class_name)} · ${map.period_label}`
                  : "Preparando mapas…"}
              </div>
              {map && (
                <img
                  src={map.href}
                  alt={`Distribución de ${friendly(map.class_name)}`}
                />
              )}
            </div>
            <p className="status">
              {error
                ? `No fue posible cargar: ${error}`
                : data
                  ? "Mapa preparado correctamente."
                  : "La primera generación puede tardar cerca de 20 segundos…"}
            </p>
            <div className="soundSummary">
              <div className="summaryTitle">
                <small>PROMEDIO DE LA FRANJA</small>
                <strong>{periodLabel || "Cargando…"}</strong>
              </div>
              {summary &&
                Object.entries(summary).map(([code, value]) => (
                  <button
                    key={code}
                    className={code === cls ? "active" : ""}
                    onClick={() => setCls(code)}
                  >
                    <span>{friendly(code)}</span>
                    <b>{(value * 100).toFixed(1)}%</b>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
