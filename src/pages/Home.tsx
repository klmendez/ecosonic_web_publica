import { Link } from "react-router-dom";
import {
  ArrowRight,
  AudioWaveform,
  ScanLine,
  Users,
  MapPinned,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="homeHero">
        <div className="wrap heroGrid">
          <div>
            <div className="kicker">Inteligencia del paisaje sonoro</div>
            <h1>
              La ciudad también tiene un <em>valor sonoro.</em>
            </h1>
            <p>
              Una plataforma multimodal para comprender, comparar y estimar el
              valor de los servicios ecosistémicos del paisaje sonoro urbano en
              Popayán.
            </p>
            <div className="authors">
              Elaborado por <b>Karen Méndez y Angiee Argote</b>
            </div>
            <div className="actions">
              <Link className="button primary" to="/explorador">
                Explorar resultados
              </Link>
              <Link className="button ghost" to="/modelo">
                Conocer el método
              </Link>
            </div>
          </div>
          <div className="orb">
            <div className="pulse" />
          </div>
        </div>
        <div className="wrap statStrip">
          <div>
            <b>50</b>
            <span>puntos urbanos</span>
          </div>
          <div>
            <b>1.240</b>
            <span>frames segmentados</span>
          </div>
          <div>
            <b>1.175</b>
            <span>mels ponderados</span>
          </div>
          <div>
            <b>96</b>
            <span>evaluaciones humanas</span>
          </div>
        </div>
      </section>
      <section className="homeEvaluation">
        <div className="wrap">
          <div className="evaluationLead">
            <div><small>HUMAN-IN-THE-LOOP</small><h2>¿Quieres ayudarnos a evaluar el modelo?</h2></div>
            <p>Recorre una experiencia real, conoce la estimación y dinos si ese valor representa lo que aportarías por mejorar el paisaje sonoro.</p>
            <Link className="button evaluationButton" to="/explorador#evaluar-modelo">Participar en la evaluación <ArrowRight size={16}/></Link>
          </div>
          <div className="evaluationTimeline">
            <div className="evaluationStep visualStep"><small>01 · OBSERVA</small><div className="stepMedia panorama"><img src="/media/frames/punto_01_P1_2min.webp" alt="Frame panorámico segmentado"/></div><b>Explora el entorno</b><span>Selecciona punto, periodo y ventana.</span></div>
            <i>→</i>
            <div className="evaluationStep audioStep"><small>02 · ESCUCHA VISUALMENTE</small><div className="stepMedia"><img src="/media/mels/punto_01_P1_2min.webp" alt="Mel-espectrograma ponderado"/></div><b>Revisa su huella acústica</b><span>Compara fuentes y composición sonora.</span></div>
            <i>→</i>
            <div className="evaluationStep predictionStep"><small>03 · COMPARA</small><div className="miniPrediction"><span>DAP estimada</span><strong>$3.407</strong><em>94,7% probabilidad de pagar</em></div><b>Conoce la predicción</b><span>Valor, monto e incertidumbre.</span></div>
            <i>→</i>
            <div className="evaluationStep responseStep"><small>04 · VALIDA</small><div className="responsePreview"><b>Sí, confirmo</b><b>No aportaría</b><b>Otro monto</b></div><b>Comparte tu decisión</b><span>Respuesta y seguridad de 1 a 5.</span></div>
          </div>
        </div>
      </section>
      <section className="section homeLayers">
        <div className="wrap">
          <div className="compactHead">
            <div>
              <div className="kicker dark">Cuatro fuentes de evidencia</div>
              <h2>Una misma ciudad, leída por capas</h2>
            </div>
            <p>
              Cada modalidad conserva su significado antes de integrarse en la
              estimación monetaria.
            </p>
          </div>
          <div className="layerRail">
            <div>
              <AudioWaveform />
              <small>01 · SONIDO</small>
              <b>Taxonomía acústica</b>
              <p>
                Biofonía, geofonía, actividad humana, silencio, tráfico y voces.
              </p>
            </div>
            <div>
              <ScanLine />
              <small>02 · VISIÓN</small>
              <b>Segmentación 360°</b>
              <p>
                Vegetación, vías, vehículos, cielo, personas y espacio peatonal.
              </p>
            </div>
            <div>
              <Users />
              <small>03 · EXPERIENCIA</small>
              <b>Percepción humana</b>
              <p>
                Molestia, agrado, tranquilidad, restauración y disposición a
                pagar.
              </p>
            </div>
            <div>
              <MapPinned />
              <small>04 · TERRITORIO</small>
              <b>Contexto espacial</b>
              <p>
                Proximidad a zonas verdes, presión urbana y prioridad ambiental.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="homeFindings">
        <div className="wrap findingLayout">
          <div>
            <small>HALLAZGO CENTRAL</small>
            <strong>0,219</strong>
            <span>R² fuera de muestra del modelo combinado</span>
          </div>
          <div>
            <h2>
              El modelo explica una parte real, pero no total, de la variación
              económica.
            </h2>
            <p>
              La arquitectura de dos etapas superó las regresiones directas. El
              resultado se presenta con incertidumbre y se utiliza para comparar
              ambientes, no como tasación individual definitiva.
            </p>
            <Link to="/modelo">
              Ver evaluación completa <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="homeQuestion">
        <div className="wrap questionGrid">
          <small>PROPÓSITO DE LA INVESTIGACIÓN</small>
          <h2>¿Cómo ponderar el valor monetario de los servicios ecosistémicos asociados al paisaje sonoro del municipio de Popayán mediante un modelo automático?</h2>
          <p>EcoSonic conecta lo que se escucha, lo que se observa y lo que sienten las personas. El resultado no es solo una cifra: es una lectura explicable del ambiente.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="compactHead">
            <div>
              <div className="kicker dark">Empieza a explorar</div>
              <h2>Tres formas de entrar al estudio</h2>
            </div>
          </div>
          <div className="editorialGrid">
            <Link to="/mapas">
              <small>01 · CARTOGRAFÍA</small>
              <h3>¿Cómo suena Popayán?</h3>
              <p>
                Compara fuentes sonoras y franjas horarias sobre el territorio.
              </p>
              <ArrowRight />
            </Link>
            <Link to="/explorador">
              <small>02 · EVIDENCIA</small>
              <h3>¿Qué contiene cada paisaje?</h3>
              <p>
                Consulta imágenes, estadísticas y salidas del modelo por punto.
              </p>
              <ArrowRight />
            </Link>
            <Link to="/valoracion">
              <small>03 · SIMULACIÓN</small>
              <h3>¿Cuál es su valor estimado?</h3>
              <p>
                Carga un frame y un mel para calcular una valoración
                estandarizada.
              </p>
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
