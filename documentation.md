# Documentación operativa

## Resumen fiel del estado actual

Este proyecto ya no es un cascarón ni un alcance pendiente. Hoy es una app `Vite + React + TypeScript` funcional, pensada como material didáctico sobre el modelo de Hotelling.

La experiencia ya implementada incluye:

- portada con navegación lateral;
- recorrido lineal del tema;
- fórmulas renderizadas con `KaTeX`;
- laboratorio de escenarios con interacción en precios;
- comparativo final;
- extensiones separadas para costo cuadrático y tres empresas;
- tarjetas de síntesis visual con fallback local si no existe la imagen final.

## Arquitectura funcional

### Entrada principal

- `src/main.tsx` monta la app y carga tipografías, `KaTeX` y `styles.css`.
- `src/App.tsx` arma la navegación, la portada, los módulos didácticos, el laboratorio de escenarios, el resumen y las extensiones.

### Contenido y lógica

- `src/content/lesson-content.ts` concentra módulos, escenarios y notas avanzadas.
- `src/content/calculations.ts` implementa:
  - equilibrio lineal;
  - resultados interactivos;
  - funciones de reacción;
  - ajuste de resultados dentro del intervalo del mercado.

### Componentes de UI

- `src/components/SectionBlock.tsx`: render de bloques teóricos.
- `src/components/StreetDiagram.tsx`: diagrama visual de la calle y la frontera.
- `src/components/FormulaBlock.tsx`: render compacto de fórmulas.
- `src/components/ScenarioLab.tsx`: pestañas por escenario, sliders y resultados en vivo.
- `src/components/SummaryImageCard.tsx`: tarjeta de síntesis visual, ampliación modal y fallback cuando no carga la imagen.

## Pipeline de imágenes didácticas

### Fuente de verdad

- `src/content/image-manifest.ts` define:
  - `HOTELLING_IMAGE_MODEL = "gpt-image-2"`
  - directorio de salida `public/generated/hotelling`
  - prompts, `alt`, captions, estado, tamaño y líneas de fallback por sección

### Script operativo

- `scripts/generate-didactic-images.ts`:
  - lee el manifiesto;
  - filtra por `--only`, `--status` o `--all`;
  - escribe PNG en `public/generated/hotelling/`;
  - exige `OPENAI_API_KEY`, salvo en `--dry-run`.

### Estado honesto del repositorio

- En este momento no hay imágenes PNG generadas dentro de `public/generated/hotelling/`.
- El directorio conserva solo `.gitkeep`.
- Por eso, el estado real es: pipeline listo, pero assets finales todavía no materializados en este workspace.

### Comportamiento de la app si faltan imágenes

La app no se rompe si esos PNG no existen.

`SummaryImageCard` intenta cargar `spec.assetPath`. Si la imagen no carga:

- mantiene `imageReady = false`;
- muestra el fallback `FallbackSketch`;
- conserva texto, takeaways y modal.

Eso permite desplegar la app sin bloquear la lectura, aunque visualmente quede en modo de respaldo.

## Scripts reales

Definidos en `package.json`:

- `pnpm dev`
- `pnpm build`
- `pnpm preview`
- `pnpm test`
- `pnpm test:run`
- `pnpm generate:images`

En local se recomienda `corepack pnpm ...` para respetar `packageManager: pnpm@10.31.0`.

## Pruebas y validación

### Smoke test incluido en el proyecto

`scripts/smoke-check.ts` valida:

- que cada módulo tenga una entrada en el manifiesto;
- que cada escenario recalcule exactamente su equilibrio esperado;
- que también existan entradas para resumen y extensiones.

Importante:

- este smoke test valida consistencia de contenido y manifiesto;
- no valida llamadas a OpenAI;
- no valida que los PNG existan físicamente;
- no sustituye una prueba visual completa del frontend.

### Verificación realizada para esta actualización documental

Comprobado el `22 de abril de 2026` en este workspace:

- `corepack pnpm build` exitoso;
- `corepack pnpm test` exitoso;
- `pnpm preview` levantado sobre la compilación;
- revisión visual de la app compilada en navegador headless.

## Despliegue en Vercel

`vercel.json` ya está alineado con el proyecto real:

- framework `vite`;
- instalación con `pnpm install --frozen-lockfile`;
- build con `pnpm build`;
- salida en `dist`.

Conclusión operativa:

- el deploy esperado es estático;
- `pnpm` es parte del contrato real del proyecto;
- la generación de imágenes es opcional para que la app funcione, pero necesaria si se quieren los PNG finales en producción.

## Qué no debe afirmar la documentación

Para mantener coherencia con el estado real, la documentación de este proyecto no debe decir que:

- la app todavía no existe;
- el stack sigue sin confirmarse;
- no hay `package.json` ni scripts;
- la generación de imágenes ya dejó assets finales versionados;
- el flujo depende de `npm` como camino principal;
- Vercel está pendiente de definirse.

Todo eso ya quedó superado por la implementación actual.
