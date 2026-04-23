# App didáctica: Modelo de Hotelling

Aplicación web educativa construida con `Vite + React + TypeScript` para explicar el modelo de Hotelling con una ruta principal lineal, tres escenarios comparativos y extensiones separadas para el caso cuadrático y la referencia con tres empresas.

## Estado real de la app

- La app ya está implementada y funciona como SPA estática.
- El recorrido principal ya existe: panorama, modelo lineal, consumidor indiferente, demandas y ganancias, funciones de reacción, laboratorio de escenarios, resumen y extensiones.
- Las fórmulas se renderizan con `KaTeX`.
- El bloque de escenarios permite mover precios con sliders y recalcular `x*`, demandas y ganancias en vivo.
- Cada sección tiene una tarjeta de síntesis visual con botón de ampliación.
- Si no existe la imagen PNG final de una sección, la interfaz usa un fallback visual tipo pizarrón para no romper la experiencia.

## Stack real

- `React 19`
- `Vite 7`
- `TypeScript 5`
- `KaTeX` y `react-katex`
- `OpenAI` SDK para generación previa de imágenes didácticas
- `tsx` para scripts operativos
- `pnpm` como gestor de paquetes y también como flujo esperado en Vercel

## Scripts reales del proyecto

En local conviene usar `corepack pnpm` para respetar la versión declarada en `package.json`.

```powershell
corepack pnpm install
corepack pnpm dev
corepack pnpm build
corepack pnpm preview
corepack pnpm test
corepack pnpm generate:images
```

Scripts disponibles:

- `dev`: levanta Vite en desarrollo.
- `build`: valida TypeScript y genera `dist/`.
- `preview`: sirve la versión compilada.
- `test`: ejecuta `scripts/smoke-check.ts`.
- `test:run`: alias del mismo smoke check.
- `generate:images`: genera imágenes didácticas a partir del manifiesto.

## Pipeline de imágenes didácticas

La generación previa de imágenes usa `gpt-image-2`.

- Manifiesto: `src/content/image-manifest.ts`
- Script: `scripts/generate-didactic-images.ts`
- Salida esperada: `public/generated/hotelling/`

Ejemplos:

```powershell
$env:OPENAI_API_KEY="tu_api_key"
corepack pnpm generate:images
corepack pnpm generate:images -- --only consumidor-indiferente
corepack pnpm generate:images -- --overwrite
corepack pnpm generate:images -- --dry-run
```

Nota honesta sobre el estado actual:

- En este workspace no hay PNG generados dentro de `public/generated/hotelling/`; actualmente solo está `.gitkeep`.
- Si falta `OPENAI_API_KEY`, el script no puede generar imágenes reales y termina con error.
- Eso no deja inutilizable a la app: `SummaryImageCard` ya trae degradación visual mediante un fallback local basado en `sketchLines`.
- Si se quiere desplegar con imágenes finales, hay que generarlas antes del build o incluirlas por otro flujo explícito.

## Despliegue en Vercel

El despliegue está configurado como sitio estático con `pnpm`.

`vercel.json` ya declara:

- `framework`: `vite`
- `installCommand`: `pnpm install --frozen-lockfile`
- `buildCommand`: `pnpm build`
- `outputDirectory`: `dist`

Flujo recomendado:

1. `corepack pnpm install`
2. `corepack pnpm build`
3. Generar imágenes antes del deploy solo si se quieren PNG finales en producción.
4. Importar el repositorio en Vercel o desplegar con el flujo que use el equipo.

Si no se generan imágenes antes del deploy, la app sigue funcionando con el fallback visual ya implementado.

## Verificación realizada en este workspace

Estado comprobado el `22 de abril de 2026`:

- `corepack pnpm build` completó sin errores.
- `corepack pnpm test` completó sin errores.
- Se revisó la salida compilada con `pnpm preview` y captura en navegador real headless.

## Estructura útil para ubicarse rápido

- `src/App.tsx`: composición principal de la experiencia.
- `src/content/lesson-content.ts`: contenido didáctico y escenarios.
- `src/content/calculations.ts`: fórmulas y cálculo del equilibrio lineal.
- `src/content/image-manifest.ts`: manifiesto de imágenes didácticas.
- `src/components/ScenarioLab.tsx`: laboratorio interactivo.
- `src/components/SummaryImageCard.tsx`: imágenes y fallback visual.
- `scripts/generate-didactic-images.ts`: generación previa de PNG con `gpt-image-2`.
- `scripts/smoke-check.ts`: comprobación rápida de contenido, fórmulas y manifiesto.
