# Implementación operativa del proyecto

## Qué ya está implementado

La base del proyecto ya quedó resuelta. Cualquier documento o ajuste futuro debe partir de estas realidades:

- el frontend usa `Vite + React + TypeScript`;
- el proyecto compila a `dist/`;
- la app es una SPA estática;
- existe un laboratorio interactivo para los tres escenarios lineales;
- las fórmulas y resultados ya están conectados a una lógica real;
- el pipeline de imágenes didácticas ya existe y usa `gpt-image-2`;
- Vercel ya está configurado para desplegar con `pnpm`.

## Contrato técnico que debe conservarse

### Flujo local

Los comandos válidos del proyecto son:

```powershell
corepack pnpm install
corepack pnpm dev
corepack pnpm build
corepack pnpm preview
corepack pnpm test
corepack pnpm generate:images
```

No conviene volver a documentar `npm` como flujo principal mientras el proyecto siga declarando `pnpm` y `vercel.json` siga usando `pnpm`.

### Contrato de build

- `build` ejecuta verificación TypeScript y luego `vite build`.
- La salida productiva es `dist/`.
- El deploy esperado en Vercel es estático.

### Contrato de contenido

La ruta principal de la app sigue esta prioridad:

1. Panorama del tema.
2. Modelo lineal y supuestos.
3. Consumidor indiferente.
4. Demandas y ganancias.
5. Funciones de reacción y equilibrio.
6. Escenarios comparativos.
7. Resumen.
8. Extensiones.

Las extensiones de costo cuadrático y tres empresas permanecen como contenido secundario, no como núcleo del recorrido.

## Contrato del pipeline de imágenes

### Qué sí existe

- Manifiesto en `src/content/image-manifest.ts`.
- Script en `scripts/generate-didactic-images.ts`.
- Modelo configurado: `gpt-image-2`.
- Directorio objetivo: `public/generated/hotelling/`.

### Qué no debe asumirse

No debe asumirse que las imágenes finales ya existen en el repositorio.

Estado real hoy:

- el pipeline está listo;
- los prompts y metadatos ya están definidos;
- en `public/generated/hotelling/` no hay PNG finales, solo `.gitkeep`.

### Regla honesta para documentar o desplegar

- Si hay `OPENAI_API_KEY`, se pueden generar imágenes antes del deploy.
- Si no hay `OPENAI_API_KEY`, la generación no corre.
- Si no se generan las imágenes, la app sigue operativa gracias al fallback visual de `SummaryImageCard`.

Esa nota debe mantenerse explícita en la documentación para no prometer assets inexistentes.

## Validación mínima que sí refleja la app

Para hablar del proyecto como funcional, la referencia mínima debe seguir siendo:

- `corepack pnpm build`
- `corepack pnpm test`
- vista previa con `corepack pnpm preview`

El smoke test actual verifica coherencia entre contenido, cálculos y manifiesto, pero no reemplaza una revisión visual del frontend ni confirma la existencia física de los PNG generados.

## Criterio para futuras actualizaciones de estos documentos

Si otro agente modifica la app en paralelo, estos archivos deben actualizarse sin revertir trabajo ajeno y sin volver a un lenguaje de proyecto incompleto.

La regla práctica es esta:

- documentar solo lo que ya exista;
- distinguir entre «implementado», «configurado» y «pendiente de generar»;
- no presentar el pipeline de imágenes como entregado si siguen faltando los PNG;
- no ocultar que el fallback visual es parte del comportamiento actual del producto.
