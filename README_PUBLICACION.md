# ECOSONIC WEB PÚBLICA

Versión estática y reproducible del sistema de valoración del paisaje sonoro de Popayán.

## Contenido

- `src/`: interfaz React + TypeScript.
- `public/data/`: 1.165 predicciones reales precalculadas, estadísticas y datos territoriales.
- `public/media/`: frames y mels WebP conservando sus dimensiones originales.
- `public/maps/`: 30 cartografías acústicas precalculadas.
- `dist/`: sitio compilado, listo para publicar.
- `scripts/`: generación reproducible de catálogos, mapas y medios web.
- `netlify.toml`: configuración para rutas internas de React en Netlify.

## Ejecutar localmente

```bash
npm install
npm run dev
```

## Compilar

```bash
npm run build
```

## Publicar en Netlify

Conectar este directorio/repo y usar:

- Build command: `npm run build`
- Publish directory: `dist`

También se puede arrastrar únicamente la carpeta `dist` a Netlify Drop.

## Alcance predictivo

Las salidas no son simuladas. Fueron generadas con `modelo_dap_dos_etapas_final.joblib` para los bloques donde existen simultáneamente frame, mel y características visuales válidas. La versión web consulta esos resultados sin requerir un servidor Python.

La versión estática permite explorar los bloques estudiados, pero no realiza inferencia sobre imágenes externas nuevas. Las respuestas Human-in-the-Loop se guardan localmente en el navegador y no recopilan datos personales en un servidor.

Los scripts de regeneración aceptan como primer argumento la ruta local de `ULTIMO MODELO`; esa carpeta fuente no se publica en este repositorio.
