import { PageHero } from "../App";
import { BrainCircuit, MapPinned } from "lucide-react";
import { useState } from "react";

const inputs = [
  [
    "Audio",
    "8 variables",
    "Biofonía, geofonía, actividad humana, voces, silencio y tráfico; se emplean medias y percentiles.",
  ],
  [
    "Visión",
    "6 variables",
    "Proporciones de personas, espacio peatonal, vegetación, vías, vehículos y cielo.",
  ],
  [
    "Interacciones",
    "3 variables",
    "Congruencia de tráfico, congruencia natural y balance naturaleza–tráfico.",
  ],
  [
    "Percepción",
    "9 variables",
    "Molestia, agrado, tranquilidad, caos, animación, monotonía y restauración.",
  ],
  [
    "Perfil humano",
    "10 variables",
    "Edad, ingreso, hogar, preocupación ambiental, género, educación, ocupación y familiaridad.",
  ],
  [
    "Tiempo",
    "5 ventanas",
    "Evidencia sincronizada a los minutos 2, 4, 6, 8 y 10 de cada experiencia.",
  ],
];
const architectureInfo={
  audio:{title:"Audio de la experiencia",type:"Entrada objetiva",detail:"Grabaciones sincronizadas con el punto y la franja, divididas en segmentos de dos segundos.",impact:"Conserva los eventos acústicos que luego permiten medir biofonía, tráfico, voces y otras fuentes."},
  frames:{title:"Frames panorámicos 360°",type:"Entrada objetiva",detail:"Imágenes extraídas cada 30 segundos de los recorridos inmersivos.",impact:"Aporta la composición física observable del entorno y permite separar vegetación, vías y vehículos."},
  survey:{title:"Firebase + realidad virtual",type:"Entrada subjetiva",detail:"96 evaluaciones vinculadas con experiencias A/B, percepción, restauración, perfil y DAP.",impact:"Conecta la evidencia ambiental con la respuesta humana y proporciona la variable económica objetivo."},
  time:{title:"Clave temporal",type:"Sincronización",detail:"Une punto, periodo y ventanas de 2, 4, 6, 8 y 10 minutos.",impact:"Evita mezclar evidencias de momentos diferentes y hace posible la fusión multimodal coherente."},
  mobilenet:{title:"MobileNetV2 1.4",type:"Red neuronal acústica",detail:"SavedModel de Urbanphony con entrada mel RGB 224 × 224, bloques convolucionales depthwise y seis salidas.",impact:"Transforma miles de píxeles del mel en probabilidades acústicas compactas e interpretables."},
  segformer:{title:"SegFormer-B0",type:"Transformer visual",detail:"Encoder jerárquico MiT-B0 y decoder MLP, preentrenado por NVIDIA sobre ADE20K.",impact:"Mejoró la especificidad visual frente a la segmentación inicial, separando vía, vehículos, personas y vegetación."},
  cleaning:{title:"Limpieza auditada",type:"Ciencia de datos",detail:"Corrige digitaciones, conserva ceros reales e imputa dentro de cada entrenamiento.",impact:"Reduce valores anómalos y fuga de información antes de ajustar los predictores."},
  weighting:{title:"Ponderación temporal",type:"Agregación",detail:"Combina 0, 30, 60, 90 y 120 segundos con pesos 10–20–40–20–10%.",impact:"Da mayor importancia al centro de la ventana y reduce el efecto de eventos transitorios extremos."},
  acousticFeatures:{title:"Características acústicas",type:"Variables objetivas",detail:"Probabilidades medias y percentil 90 de las seis categorías acústicas.",impact:"Representan presión vehicular, naturaleza, actividad humana, voces y silencio en formato tabular."},
  visualFeatures:{title:"Características visuales",type:"Variables objetivas",detail:"Proporciones de personas, vegetación, vías, vehículos, cielo y espacio peatonal.",impact:"Permiten comparar lo que se oye con lo que realmente aparece en la escena."},
  humanFeatures:{title:"Características humanas",type:"Variables subjetivas",detail:"Percepción, restauración, familiaridad y perfil socioeconómico.",impact:"Capturan la heterogeneidad de preferencias y capacidad económica entre participantes."},
  interactions:{title:"Interacciones multimodales",type:"Variables derivadas",detail:"Congruencia de tráfico, congruencia natural y balance naturaleza–tráfico.",impact:"Miden si sonido e imagen cuentan una historia ambiental coherente."},
  fusion:{title:"Fusión tardía de 37 variables",type:"Núcleo multimodal",detail:"Integra características ya interpretadas, en lugar de entregar imágenes crudas al predictor económico.",impact:"Fue más estable para 96 evaluaciones y evitó tratar miles de imágenes como etiquetas económicas independientes."},
  classifier:{title:"ExtraTreesClassifier",type:"Cabeza económica 1",detail:"Clasificador balanceado que estima la probabilidad de que la DAP sea mayor que cero.",impact:"Modelar por separado la decisión de pagar ayudó a representar correctamente los ceros observados."},
  regressor:{title:"Gradient Boosting Huber",type:"Cabeza económica 2",detail:"Regresor robusto que estima el monto únicamente entre respuestas con DAP positiva.",impact:"La pérdida Huber reduce la influencia de montos extremos y mejora la estabilidad del valor condicional."},
  dap:{title:"DAP esperada",type:"Salida monetaria",detail:"Producto entre la probabilidad de pagar y el monto estimado si paga.",impact:"La formulación de dos etapas alcanzó R² 0,219 fuera de muestra, frente a −0,153 de la regresión ambiental directa."},
  perception:{title:"Salidas perceptuales",type:"Cabezas auxiliares",detail:"ExtraTreesRegressor estima molestia, agrado, tranquilidad, caos y restauración.",impact:"Amplían la interpretación del lugar más allá del monto y permiten contrastar la predicción con experiencia humana."},
  uncertainty:{title:"Incertidumbre",type:"Salida de confiabilidad",detail:"Intervalos del 80% y 90% acompañados por un nivel de confianza.",impact:"Evita presentar la DAP como una cifra exacta y comunica la variabilidad observada."},
  territory:{title:"Rama territorial paralela",type:"Diagnóstico complementario",detail:"NDVI, NDBI, LST, cobertura y distancia verde producen índices ambientales por punto.",impact:"Ayuda a interpretar naturaleza, tráfico y prioridad, aunque se excluyó de la DAP porque redujo el R²."},
  librosa:{title:"Librosa",type:"Procesamiento acústico",detail:"Genera mel-espectrogramas RGB de 224 × 224 a partir de los segmentos de audio.",impact:"Convierte la señal sonora en la representación tiempo–frecuencia que puede recibir MobileNetV2."},
  opencv:{title:"OpenCV / Pillow",type:"Procesamiento visual",detail:"Lee, ajusta, combina y guarda los frames panorámicos 360°, las máscaras y las composiciones ponderadas.",impact:"Prepara imágenes uniformes y trazables antes y después de la inferencia con SegFormer."},
  pandas:{title:"Pandas / NumPy",type:"Ciencia de datos",detail:"Ejecuta limpieza, normalización, agrupación, auditoría y unión de todas las modalidades.",impact:"Construye la base tabular coherente que alimenta la fusión de 37 variables."},
  joblib:{title:"Joblib",type:"Despliegue",detail:"Serializa y recupera el paquete predictivo final con sus preprocesadores y estimadores.",impact:"Permite que la aplicación reproduzca la predicción entrenada sin volver a ajustar el modelo."},
  react:{title:"React / TypeScript",type:"Interfaz y Human-in-the-Loop",detail:"Implementa la exploración de evidencias, mapas, predicciones y validación humana interactiva.",impact:"Acerca las salidas a usuarios y recopila confirmaciones, rechazos, montos alternativos y seguridad."},
  sklearn:{title:"scikit-learn",type:"Aprendizaje automático tabular",detail:"Implementa ExtraTreesClassifier para pagar/no pagar, Gradient Boosting con pérdida Huber para el monto y ExtraTreesRegressor para salidas perceptuales.",impact:"Permite separar los ceros del monto positivo y construir el modelo económico final validado con GroupKFold."},
} as const;
type ArchitectureKey=keyof typeof architectureInfo;
const architectureMeta:Partial<Record<ArchitectureKey,{technology:string;implementation:string;status:string}>>={
  audio:{technology:"Audio digital",implementation:"Segmentación en fragmentos de 2 segundos",status:"Entrada objetiva"},
  frames:{technology:"Video e imágenes panorámicas",implementation:"Extracción cada 30 s",status:"Entrada objetiva"},
  survey:{technology:"Firebase + entorno VR",implementation:"Encuestas A/B y experiencias inmersivas",status:"Entrada subjetiva"},
  mobilenet:{technology:"TensorFlow / Keras",implementation:"MobileNetV2 1.4 · CNN_TAX_URBAN",status:"Reutilizado"},
  segformer:{technology:"PyTorch / Transformers",implementation:"SegFormer-B0 · ADE20K",status:"Preentrenado"},
  classifier:{technology:"scikit-learn",implementation:"ExtraTreesClassifier balanceado",status:"Modelo final · etapa 1"},
  regressor:{technology:"scikit-learn",implementation:"GradientBoostingRegressor · Huber",status:"Modelo final · etapa 2"},
  dap:{technology:"scikit-learn + Joblib",implementation:"Hurdle: probabilidad × monto",status:"Salida económica final"},
  perception:{technology:"scikit-learn",implementation:"ExtraTreesRegressor",status:"Modelo auxiliar"},
  librosa:{technology:"Librosa",implementation:"Mel-espectrogramas RGB 224 × 224",status:"Procesamiento acústico"},
  opencv:{technology:"OpenCV / Pillow",implementation:"Frames 360°, máscaras y composiciones",status:"Procesamiento visual"},
  pandas:{technology:"Pandas / NumPy",implementation:"Limpieza, unión y auditoría",status:"Ciencia de datos"},
  cleaning:{technology:"Pandas + scikit-learn",implementation:"Imputación, normalización y codificación",status:"Preprocesamiento"},
  joblib:{technology:"Joblib",implementation:"modelo_dap_dos_etapas_final.joblib",status:"Despliegue"},
  react:{technology:"React / TypeScript",implementation:"Exploración + Human-in-the-Loop",status:"Interfaz actual"},
  sklearn:{technology:"scikit-learn",implementation:"ExtraTrees + Gradient Boosting Huber",status:"Modelo económico final"},
  territory:{technology:"Earth Engine + rásteres",implementation:"NDVI · NDBI · LST · distancia verde",status:"Complementario"},
};

export default function Model() {
  const[activeArchitecture,setActiveArchitecture]=useState<ArchitectureKey>("fusion");
  const[dialogOpen,setDialogOpen]=useState(false);
  const showNode=(key:ArchitectureKey)=>{setActiveArchitecture(key);setDialogOpen(true)};
  const node=(key:ArchitectureKey,title:string,className="")=><button type="button" className={`archNode ${className} ${activeArchitecture===key&&dialogOpen?"active":""}`} onMouseEnter={()=>showNode(key)} onFocus={()=>showNode(key)} onBlur={()=>setDialogOpen(false)} onClick={()=>showNode(key)} aria-pressed={activeArchitecture===key&&dialogOpen}><b>{title}</b></button>;
  const activeInfo=architectureInfo[activeArchitecture];
  const activeMeta=architectureMeta[activeArchitecture];
  return (
    <>
      <PageHero
        kicker="Modelo multimodal"
        title="Cómo se construye una valoración explicable."
        text="El sistema no entrega las imágenes directamente a un único algoritmo: primero transforma audio y visión en variables ambientales, luego estima la decisión y el monto de pago."
      />
      <section className="modelOverview">
        <div className="wrap modelOverviewGrid">
          <div>
            <small>IDEA PRINCIPAL</small>
            <h2>Dos preguntas económicas, una salida monetaria.</h2>
            <p>
              La disposición a pagar contiene muchos ceros reales. Por eso se
              separa la decisión de pagar del monto que ofrecería una persona si
              decide hacerlo.
            </p>
          </div>
          <div className="formula">
            <span>Probabilidad de pagar</span>
            <i>×</i>
            <span>Monto si paga</span>
            <i>=</i>
            <strong>DAP esperada</strong>
          </div>
        </div>
      </section>
      <section className="architecture">
        <div className="wrap">
          <div className="compactHead">
            <div><div className="kicker dark">Arquitectura multimodal detallada</div><h2>De la experiencia inmersiva a múltiples salidas</h2></div>
            <p>Una sola lectura de izquierda a derecha muestra las redes, la fusión tardía y las cabezas de predicción.</p>
          </div>
          <div className="architectureCanvas" onMouseLeave={()=>setDialogOpen(false)} onMouseMove={e=>{if(!(e.target as HTMLElement).closest("button,.architectureDialog"))setDialogOpen(false)}}>
          <svg className="archConnections" viewBox="0 0 1200 360" preserveAspectRatio="none" aria-hidden="true">
            <defs><marker id="flowHead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z"/></marker></defs>
            <g className="flowSet inputFlow">
              <path d="M150 92 C210 92 230 82 290 82"/><path d="M150 145 C215 145 225 137 290 137"/><path d="M150 198 C210 198 230 193 290 193"/><path d="M150 251 C215 251 225 248 290 248"/>
            </g>
            <g className="flowSet featureFlow">
              <path d="M430 82 C485 82 500 92 550 92"/><path d="M430 137 C490 137 495 145 550 145"/><path d="M430 193 C485 193 500 198 550 198"/><path d="M430 248 C490 248 495 251 550 251"/>
            </g>
            <g className="flowSet fusionIn">
              <path d="M690 92 C745 92 735 130 790 155"/><path d="M690 145 C750 145 745 158 790 174"/><path d="M690 198 C750 198 745 192 790 191"/><path d="M690 251 C745 251 735 220 790 207"/>
            </g>
            <g className="flowSet outputFlow">
              <path d="M910 180 C960 180 958 78 1010 78"/><path d="M910 182 C965 182 960 128 1010 128"/><path d="M910 184 C970 184 970 180 1010 180"/><path d="M910 186 C965 186 960 232 1010 232"/><path d="M910 188 C960 188 958 282 1010 282"/>
            </g>
          </svg>
          <div className="fullArchitecture" role="img" aria-label="Arquitectura multimodal detallada desde audio, visión y encuesta hasta las salidas económicas, perceptuales y ambientales">
            <div className="archColumn inputsColumn">
              <small>01 · ENTRADAS</small>
              {node("audio","Audio")}
              {node("frames","Frames 360°")}
              {node("survey","Firebase + VR")}
              {node("time","Tiempo")}
            </div>
            <i className="archArrow">→</i>
            <div className="archColumn networksColumn">
              <small>02 · REDES Y PROCESOS</small>
              {node("mobilenet","MobileNetV2 1.4","neural")}
              {node("segformer","SegFormer-B0","neural")}
              {node("cleaning","Limpieza auditada")}
              {node("weighting","Ponderación temporal")}
            </div>
            <i className="archArrow">→</i>
            <div className="archColumn featuresColumn">
              <small>03 · CARACTERÍSTICAS</small>
              {node("acousticFeatures","Variables acústicas")}
              {node("visualFeatures","Variables visuales")}
              {node("humanFeatures","Variables humanas")}
              {node("interactions","Interacciones")}
            </div>
            <i className="archArrow">→</i>
            <button type="button" className={`fusionCore ${activeArchitecture==="fusion"&&dialogOpen?"active":""}`} onMouseEnter={()=>showNode("fusion")} onFocus={()=>showNode("fusion")} onBlur={()=>setDialogOpen(false)} onClick={()=>showNode("fusion")} aria-pressed={activeArchitecture==="fusion"&&dialogOpen}>
              <BrainCircuit/>
              <b>Fusión multimodal</b>
            </button>
            <i className="archArrow splitArrow">→</i>
            <div className="archColumn outputsColumn">
              <small>05 · CABEZAS Y SALIDAS</small>
              {node("classifier","ExtraTreesClassifier","outputHead")}
              {node("regressor","Gradient Boosting Huber","outputHead")}
              {node("dap","DAP esperada","finalDap")}
              {node("perception","Salidas perceptuales")}
              {node("uncertainty","Incertidumbre")}
            </div>
          </div>
          <button type="button" className={`territorialBranch ${activeArchitecture==="territory"&&dialogOpen?"active":""}`} onMouseEnter={()=>showNode("territory")} onFocus={()=>showNode("territory")} onBlur={()=>setDialogOpen(false)} onClick={()=>showNode("territory")} aria-pressed={activeArchitecture==="territory"&&dialogOpen}><MapPinned/><b>Rama territorial paralela</b></button>
          <div className="architectureTools"><small>MODELOS Y TECNOLOGÍAS · SELECCIONA PARA CONOCER SU FUNCIÓN</small><div>{node("mobilenet","TensorFlow / Keras")}{node("segformer","PyTorch / Transformers")}{node("sklearn","scikit-learn")}{node("librosa","Librosa")}{node("opencv","OpenCV / Pillow")}{node("pandas","Pandas / NumPy")}{node("joblib","Joblib")}{node("react","React / TypeScript")}</div></div>
          {dialogOpen&&<div className="architectureDialog" role="dialog" aria-live="polite" aria-label={`Información sobre ${activeInfo.title}`} onMouseLeave={()=>setDialogOpen(false)}><button className="dialogClose" onClick={()=>setDialogOpen(false)} aria-label="Cerrar información">×</button><div className="dialogTitle"><small>QUÉ ES · {activeInfo.type}</small><h3>{activeInfo.title}</h3>{activeMeta&&<span className="statusTag">{activeMeta.status}</span>}</div>{activeMeta&&<div><small>MODELO Y TECNOLOGÍA</small><b>{activeMeta.technology}</b><p>{activeMeta.implementation}</p></div>}<div><small>QUÉ HACE</small><p>{activeInfo.detail}</p></div><div><small>CÓMO AYUDA AL MODELO</small><p>{activeInfo.impact}</p></div></div>}
          </div>
          <p className="discardedModels"><b>Modelos evaluados y no conservados:</b> CNN pequeñas, ResNet50 con frame + mel, Ridge, Random Forest, ExtraTrees directo y dos etapas con satélite.</p>
        </div>
      </section>
      <section className="weightedTimeline">
        <div className="wrap timelineLayout">
          <div><div className="kicker dark">Agregación temporal</div><h2>Una ventana de dos minutos no pesa todos los instantes igual</h2><p>El centro recibe mayor importancia para reducir la influencia de eventos transitorios en los extremos. El mismo criterio sincroniza frames y mels.</p></div>
          <div className="timelineGraphic">
            <div className="timeLine"/>
            {[["0 s","10%"],["30 s","20%"],["60 s","40%"],["90 s","20%"],["120 s","10%"]].map(([time,weight],i)=><div className={`timeNode t${i+1}`} key={time}><b>{weight}</b><i/><span>{time}</span></div>)}
            <p>x̄w = 0,10x₀ + 0,20x₃₀ + 0,40x₆₀ + 0,20x₉₀ + 0,10x₁₂₀</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="compactHead">
            <div>
              <div className="kicker dark">Entradas del modelo</div>
              <h2>37 variables con significado ambiental y humano</h2>
            </div>
            <p>
              Los píxeles se convierten primero en proporciones y probabilidades
              interpretables.
            </p>
          </div>
          <div className="featureGrid">
            {inputs.map(([name, count, text]) => (
              <div key={name}>
                <small>{name}</small>
                <b>{count}</b>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="trainingSection">
        <div className="wrap">
          <div className="compactHead light">
            <div>
              <div className="kicker">Entrenamiento y prueba</div>
              <h2>
                Cómo se evitó evaluar al modelo con personas que ya conocía
              </h2>
            </div>
            <p>
              Las particiones se construyeron por participante, no por fila.
            </p>
          </div>
          <ol className="trainingFlow">
            <li>
              <b>Datos auditados</b>
              <p>
                96 evaluaciones de 42 participantes, conservando los ceros
                económicamente válidos.
              </p>
            </li>
            <li>
              <b>GroupKFold</b>
              <p>
                Cinco particiones mantienen todas las respuestas de una persona
                en un solo lado.
              </p>
            </li>
            <li>
              <b>Preprocesamiento interno</b>
              <p>
                Imputación y codificación se ajustan únicamente con el conjunto
                de entrenamiento.
              </p>
            </li>
            <li>
              <b>Predicción fuera de muestra</b>
              <p>
                Cada métrica se calcula sobre personas no vistas durante el
                ajuste correspondiente.
              </p>
            </li>
          </ol>
        </div>
      </section>
      <section className="metrics">
        <div className="wrap">
          <div className="compactHead light">
            <div>
              <div className="kicker">Resultados</div>
              <h2>Qué tan bien funciona</h2>
            </div>
            <p>
              Las métricas describen capacidades diferentes y deben leerse
              juntas.
            </p>
          </div>
          <div className="metricStrip">
            {[
              ["0,219", "R² combinado"],
              ["0,374", "R² del monto positivo"],
              ["$1.522", "Error absoluto medio"],
              ["$1.961", "Raíz del error cuadrático"],
              ["0,614", "Área bajo curva ROC"],
              ["42", "Participantes"],
            ].map(([v, l]) => (
              <div key={l}>
                <b>{v}</b>
                <span>{l}</span>
              </div>
            ))}
          </div>
          <div className="metricReading">
            <p>
              <b>R² 0,219:</b> el sistema capta una parte útil de la variación,
              pero queda variabilidad humana sin explicar.
            </p>
            <p>
              <b>Error de $1.522:</b> en promedio, la predicción se separa esa
              cantidad del valor observado.
            </p>
            <p>
              <b>ROC-AUC 0,614:</b> la identificación de quién paga es mejor que
              el azar, aunque todavía moderada.
            </p>
          </div>
          <div className="modelComparison">
            <div><small>COMPARACIÓN FUERA DE MUESTRA</small><h3>Por qué se conservó el modelo de dos etapas</h3><p>Un R² negativo significa que el experimento fue peor que predecir siempre la media. El satélite se descartó como entrada económica, aunque se mantuvo para el diagnóstico territorial.</p></div>
            <div className="r2Plot">
              {[['Regresión ambiental','-0,153',-15.3,'bad'],['ResNet50 + mel','0,137',13.7,'mid'],['Dos etapas final','0,219',21.9,'best'],['Dos etapas + satélite','-0,185',-18.5,'bad']].map(([name,value,width,state])=><div key={String(name)}><span>{name}</span><i className={String(state)}><b style={{width:`${Math.abs(Number(width))*3}%`}}/></i><strong>{value}</strong></div>)}
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap interpretation">
          <div>
            <small>QUÉ ENTREGA</small>
            <h3>Una comparación estandarizada</h3>
            <p>
              DAP esperada, probabilidad, monto condicional, intervalos,
              confianza y perfiles de naturaleza y tráfico.
            </p>
          </div>
          <div>
            <small>QUÉ NO ENTREGA</small>
            <h3>Una tasación individual definitiva</h3>
            <p>
              La web fija un perfil humano representativo para comparar
              ambientes sin confundir diferencias del lugar con diferencias
              personales.
            </p>
          </div>
          <div>
            <small>INCERTIDUMBRE</small>
            <h3>Rangos del 80 % y 90 %</h3>
            <p>
              La cifra puntual siempre se acompaña de intervalos empíricos para
              comunicar la variabilidad observada.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
