import { useEffect, useState } from "react";
import { Bars, PageHero } from "../App";
import type { Environmental, Evidence, Prediction } from "../types";
import { HumanFeedback } from "../components/HumanFeedback";
import {getEnvironmental,getEvidence,getPredictions,keyFor} from "../staticData";
const periods: Record<string, string> = {
  P1: "8:00am - 10:00am",
  P2: "10:00am - 12:00m",
  P3: "12:00m - 2:00pm",
  P4: "2:00pm - 4:00pm",
  P5: "4:00pm - 6:00pm",
};
export default function Explorer() {
  const [env, setEnv] = useState<Environmental[]>([]);
  const [point, setPoint] = useState(1);
  const [period, setPeriod] = useState("P1");
  const [minute, setMinute] = useState(2);
  const [stats, setStats] = useState<Evidence>();
  const [prediction, setPrediction] = useState<Prediction>();
  const [error, setError] = useState("");
  useEffect(() => {
    getEnvironmental().then(setEnv);
  }, []);
  useEffect(() => {
    setStats(undefined);
    setError("");
    getEvidence().then((catalog) => {
        const d=catalog[keyFor(point,period,minute)];if(!d)throw Error("No hay evidencia completa para este bloque.");setStats(d);
      })
      .catch((e) => setError(e.message));
  }, [point, period, minute]);
  useEffect(() => {
    setPrediction(undefined);
    getPredictions().then((catalog) => setPrediction(catalog[keyFor(point,period,minute)]))
      .catch(() => setPrediction(undefined));
  }, [point, period, minute]);
  useEffect(()=>{if(prediction&&window.location.hash==="#evaluar-modelo")setTimeout(()=>document.getElementById("evaluar-modelo")?.scrollIntoView({behavior:"smooth",block:"center"}),120)},[prediction]);
  const x = env.find((v) => v.puntoId === point);
  const stem = `punto_${String(point).padStart(2, "0")}_${period}_${minute}min.webp`;
  return (
    <>
      <PageHero
        kicker="Evidencia por lugar"
        title="50 puntos, múltiples formas de habitar el sonido."
        text="Selecciona un lugar y un momento para estudiar conjuntamente el entorno, el frame segmentado y la huella acústica."
      />
      <section className="section">
        <div className="wrap explorerWorkspace">
          <aside className="explorerSidebar">
            <div className="kicker dark">Configurar exploración</div>
            <h2>Selecciona la evidencia</h2>
            <label className="field">
              Lugar
              <select value={point} onChange={(e) => setPoint(+e.target.value)}>
                {env.map((x) => (
                  <option value={x.puntoId} key={x.puntoId}>
                    {x.puntoNombre}
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
                {Object.entries(periods).map(([code, label]) => (
                  <option value={code} key={code}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Ventana temporal
              <select
                value={minute}
                onChange={(e) => setMinute(+e.target.value)}
              >
                {[2, 4, 6, 8, 10].map((value) => (
                  <option key={value} value={value}>
                    Hasta el minuto {value}
                  </option>
                ))}
              </select>
            </label>
            {x && (
              <>
                <div className="placeContext">
                  <small>CONTEXTO DEL LUGAR</small>
                  <strong>{x.tipo_entorno}</strong>
                  <p>
                    {[x.calle, x.barrio].filter(Boolean).join(" · ") ||
                      x.direccion_completa}
                    <br />
                    Zona verde a {Math.round(x.dist_to_green)} metros
                    <br />
                    {x.n_evaluaciones} evaluaciones humanas
                  </p>
                </div>
                <div className="sidebarIndices">
                  {[
                    ["Presencia natural", x.indice_naturaleza_integrado],
                    ["Presión del tráfico", x.indice_presion_trafico],
                    [
                      "Prioridad de intervención",
                      x.indice_prioridad_intervencion,
                    ],
                  ].map(([name, value]) => (
                    <div key={String(name)}>
                      <span>{name}</span>
                      <div>
                        <i style={{ width: `${Number(value)}%` }} />
                      </div>
                      <b>{Math.round(Number(value))}/100</b>
                    </div>
                  ))}
                </div>
                <p className="explorerRecommendation">{x.recomendacion}</p>
              </>
            )}
          </aside>
          <div className="explorerContent">
            <div className="explorerHeading">
              <div>
                <small>EVIDENCIA ACTIVA</small>
                <h2>
                  {x
                    ? `Punto ${String(point).padStart(2, "0")} · ${x.puntoNombre}`
                    : "Cargando lugar…"}
                </h2>
              </div>
              <span>
                {periods[period]} · bloque {Math.max(0, minute - 2)}–{minute}{" "}
                minutos
              </span>
            </div>
            <nav className="explorerSteps" aria-label="Pasos para explorar y evaluar un punto">
              <div className="current"><small>01</small><b>Selecciona</b><span>Lugar, franja y ventana</span></div>
              <i>→</i>
              <div><small>02</small><b>Compara</b><span>Frame, mel y estadísticas</span></div>
              <i>→</i>
              <div><small>03</small><b>Interpreta</b><span>DAP y salidas ambientales</span></div>
              <i>→</i>
              <div><small>04</small><b>Evalúa</b><span>Confirma o propone un valor</span></div>
            </nav>
            <div className="mediaPair">
              <figure>
                <div className="mediaViewport">
                  <img
                    src={`/media/frames/${stem}`}
                    alt="Segmentación semántica del entorno"
                  />
                </div>
                <figcaption>
                  <small>EVIDENCIA VISUAL · SEGMENTACIÓN SEMÁNTICA</small>
                  <b>Composición del entorno</b>
                  <span>
                    Composición ponderada del bloque exacto seleccionado.
                  </span>
                </figcaption>
              </figure>
              <figure>
                <div className="mediaViewport mel">
                  <img
                    src={`/media/mels/${stem}`}
                    alt="Mel-espectrograma ponderado"
                  />
                </div>
                <figcaption>
                  <small>EVIDENCIA ACÚSTICA · MEL PONDERADO</small>
                  <b>Huella acústica del bloque</b>
                  <span>
                    Representación tiempo–frecuencia del paisaje sonoro.
                  </span>
                </figcaption>
              </figure>
              {x && <figure className="pointMap">
                <div className="pointMapViewport">
                  <iframe loading="lazy" title={`Mapa del punto ${point}`} src={`https://www.openstreetmap.org/export/embed.html?bbox=${x.longitude-0.002}%2C${x.latitude-0.0015}%2C${x.longitude+0.002}%2C${x.latitude+0.0015}&layer=mapnik&marker=${x.latitude}%2C${x.longitude}`}/>
                </div>
                <figcaption>
                  <small>UBICACIÓN DEL PUNTO · PUNTO {String(point).padStart(2,"0")}</small>
                  <b>{x.calle||x.direccion_completa}</b>
                  <a href={`https://www.google.com/maps?q=${x.latitude},${x.longitude}`} target="_blank" rel="noreferrer">Abrir ubicación en Google Maps ↗</a>
                </figcaption>
              </figure>}
            </div>
            <section className="modelOutputs">
              <div className="outputIntro">
                <small>SALIDAS DEL MODELO</small>
                <h3>Valoración ambiental estandarizada</h3>
                <p>
                  Estimación para el perfil representativo del estudio,
                  manteniendo constantes sus características personales.
                </p>
              </div>
              {prediction ? (
                <div className="outputMetrics">
                  <div className="primaryOutput">
                    <span>DAP esperada</span>
                    <b>
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(prediction.expected_dap)}
                    </b>
                  </div>
                  <div>
                    <span>Probabilidad de pagar</span>
                    <b>{prediction.probability_pay.toFixed(1)}%</b>
                  </div>
                  <div>
                    <span>Monto si paga</span>
                    <b>
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(prediction.amount_if_pay)}
                    </b>
                  </div>
                  <div>
                    <span>Confianza</span>
                    <b>{prediction.confidence}</b>
                  </div>
                  <div>
                    <span>Intervalo del 80%</span>
                    <b>
                      {Math.round(prediction.interval80[0]).toLocaleString(
                        "es-CO",
                      )}
                      –
                      {Math.round(prediction.interval80[1]).toLocaleString(
                        "es-CO",
                      )}{" "}
                      COP
                    </b>
                  </div>
                  <div>
                    <span>Presencia natural</span>
                    <b>{prediction.nature.toFixed(1)}/100</b>
                  </div>
                  <div>
                    <span>Presión vehicular</span>
                    <b>{prediction.traffic.toFixed(1)}/100</b>
                  </div>
                </div>
              ) : (
                <div className="outputLoading">
                  Calculando salidas del modelo…
                </div>
              )}
            </section>
            {prediction&&<HumanFeedback point={point} period={period} minute={minute} amount={prediction.expected_dap} place={x?.puntoNombre||`Punto ${point}`}/>}
            <div className="explorerCharts">
              <div>
                <div className="chartHeading">
                  <div>
                    <small>LECTURA DEL FRAME</small>
                    <h3>Composición visual</h3>
                  </div>
                  <span>{stats?.visual_scope}</span>
                </div>
                {stats ? (
                  <Bars data={stats.visual} />
                ) : (
                  <p>{error || "Calculando estadísticas visuales…"}</p>
                )}
              </div>
              <div>
                <div className="chartHeading">
                  <div>
                    <small>LECTURA DEL SONIDO</small>
                    <h3>Taxonomía acústica</h3>
                  </div>
                  <span>
                    {stats
                      ? `Promedio de ${stats.acoustic_segments.toLocaleString("es-CO")} segmentos.`
                      : ""}
                  </span>
                </div>
                {stats ? (
                  <Bars data={stats.acoustic} audio />
                ) : (
                  <p>{error || "Calculando estadísticas acústicas…"}</p>
                )}
              </div>
            </div>
            <p className="explorerNote">
              La composición visual corresponde al bloque exacto. La taxonomía
              acústica está consolidada para el lugar y la franja horaria y no
              representa exclusivamente la ventana visual seleccionada.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
