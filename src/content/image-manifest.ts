import type { SectionImageSpec } from "../types";

export const HOTELLING_IMAGE_MODEL = "gpt-image-2" as const;
export const HOTELLING_IMAGE_OUTPUT_DIR = "public/generated/hotelling" as const;
export const HOTELLING_IMAGE_PUBLIC_DIR = "/generated/hotelling" as const;

export const whiteboardVisualDirection = `
Estilo de apuntes en pizarrón blanco limpio.
Trazos de plumón azul, negro, rojo, verde y naranja.
Escritura manual legible, flechas, círculos, llaves y subrayados.
Composición horizontal, clara y didáctica.
Sin personas, sin salón real, sin decoración extra, sin collages.
Una sola idea visual por imagen, máximo dos fórmulas y hasta cinco etiquetas breves.
`.trim();

export const imageManifest: SectionImageSpec[] = [
  {
    id: "panorama-costo-total",
    sectionId: "panorama",
    placement: "after-section",
    prompt: `${whiteboardVisualDirection}
Mostrar una calle recta con empresa A y empresa B. Señalar un consumidor entre ambas. Resaltar que el costo total de comprar combina precio y traslado. Incluir solo la fórmula costo total = p + td.`,
    alt: "Síntesis visual del costo total como suma de precio y transporte dentro de una calle con dos empresas.",
    caption: "El problema empieza cuando el alumno ve que distancia y precio se convierten en una sola decisión.",
    quality: "medium",
    size: "1536x1024",
    status: "draft",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/panorama-costo-total.png`,
    sketchLines: [
      "calle recta",
      "empresa A y empresa B",
      "costo total = p + td",
      "precio + traslado",
      "la frontera depende del costo total",
    ],
  },
  {
    id: "modelo-lineal-supuestos",
    sectionId: "modelo-lineal",
    placement: "after-section",
    prompt: `${whiteboardVisualDirection}
Explicar visualmente que la ruta principal usa costo lineal td y no debe mezclarse con td^2. Dibujar una advertencia breve, una calle con a < b y notas de consumidores uniformes.`,
    alt: "Síntesis visual de los supuestos del modelo lineal y advertencia para no mezclar la versión cuadrática.",
    caption: "La ruta principal necesita una sola convención para no mezclar resultados incompatibles.",
    quality: "medium",
    size: "1536x1024",
    status: "draft",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/modelo-lineal-supuestos.png`,
    sketchLines: [
      "usar td",
      "no mezclar con td²",
      "a < b",
      "mercado cubierto",
      "consumidores uniformes",
    ],
  },
  {
    id: "consumidor-indiferente",
    sectionId: "consumidor-indiferente",
    placement: "after-section",
    prompt: `${whiteboardVisualDirection}
Mostrar cómo el consumidor indiferente divide el mercado. Dibujar la calle, la línea vertical de x* y escribir solo la igualdad de costos y la fórmula final de x* de forma breve.`,
    alt: "Síntesis visual del consumidor indiferente como frontera de mercado entre A y B.",
    caption: "La frontera x* resume el corazón del ejercicio.",
    quality: "medium",
    size: "1536x1024",
    status: "draft",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/consumidor-indiferente.png`,
    sketchLines: [
      "igualar costos",
      "aparece x*",
      "mercado de A",
      "mercado de B",
      "el precio mueve la frontera",
    ],
  },
  {
    id: "demandas-desde-xstar",
    sectionId: "demandas-ganancias",
    placement: "after-section",
    prompt: `${whiteboardVisualDirection}
Explicar que qA sale de x* y qB sale de L - x*. Dibujar una calle segmentada y resaltar que las ganancias combinan margen y cantidad.`,
    alt: "Síntesis visual de cómo la demanda y la ganancia salen directamente de x*.",
    caption: "La cantidad vendida aparece al medir la calle desde la frontera.",
    quality: "medium",
    size: "1536x1024",
    status: "draft",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/demandas-desde-xstar.png`,
    sketchLines: [
      "qA = x*",
      "qB = L - x*",
      "frontera -> ventas",
      "margen x cantidad",
      "ganancia",
    ],
  },
  {
    id: "funciones-reaccion",
    sectionId: "reacciones-equilibrio",
    placement: "after-section",
    prompt: `${whiteboardVisualDirection}
Mostrar dos rectas de reacción que se cruzan. Etiquetar solo RA, RB y equilibrio de Nash. Mantener el dibujo claro y con una sola idea visual.`,
    alt: "Síntesis visual del cruce de funciones de reacción que produce el equilibrio de Nash.",
    caption: "Cada empresa responde al precio de la otra y el equilibrio aparece donde ambas respuestas coinciden.",
    quality: "medium",
    size: "1536x1024",
    status: "draft",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/funciones-reaccion.png`,
    sketchLines: [
      "RA",
      "RB",
      "cruce",
      "ninguna quiere cambiar",
      "equilibrio de Nash",
    ],
  },
  {
    id: "escenario-1",
    sectionId: "escenario-1",
    placement: "after-section",
    prompt: `${whiteboardVisualDirection}
Resumir el escenario 1 con simetría total. Dibujar extremos opuestos, x*=50, precios iguales y mercado dividido en mitades.`,
    alt: "Síntesis visual del escenario 1 con simetría total y reparto igual del mercado.",
    caption: "Cuando todo es simétrico, el resultado también lo es.",
    quality: "medium",
    size: "1536x1024",
    status: "draft",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/escenario-1.png`,
    sketchLines: [
      "simetría total",
      "pA = pB",
      "x* = 50",
      "qA = qB",
      "misma ganancia",
    ],
  },
  {
    id: "escenario-2",
    sectionId: "escenario-2",
    placement: "after-section",
    prompt: `${whiteboardVisualDirection}
Resumir el escenario 2 con ventaja de costos para A. Dibujar la frontera movida hacia B, pA menor, qA mayor y una nota breve de ventaja tecnológica.`,
    alt: "Síntesis visual del escenario 2 donde A tiene menores costos y desplaza la frontera de mercado.",
    caption: "Una ventaja de costos le permite a A cobrar menos y ganar más mercado.",
    quality: "medium",
    size: "1536x1024",
    status: "draft",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/escenario-2.png`,
    sketchLines: [
      "cA < cB",
      "pA < pB",
      "x* se mueve",
      "qA > qB",
      "A gana ventaja",
    ],
  },
  {
    id: "escenario-3",
    sectionId: "escenario-3",
    placement: "after-section",
    prompt: `${whiteboardVisualDirection}
Resumir el escenario 3 con ubicaciones interiores simétricas. Dibujar a=20, b=80, x*=50 y una nota breve sobre agrupamiento espacial balanceado.`,
    alt: "Síntesis visual del escenario 3 con ubicaciones interiores pero simetría respecto al centro.",
    caption: "Mover las empresas hacia el interior no rompe el equilibrio si la simetría se conserva.",
    quality: "medium",
    size: "1536x1024",
    status: "draft",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/escenario-3.png`,
    sketchLines: [
      "a = 20",
      "b = 80",
      "x* = 50",
      "simetría interior",
      "mercado repartido",
    ],
  },
  {
    id: "resumen-comparacion",
    sectionId: "resumen",
    placement: "after-section",
    prompt: `${whiteboardVisualDirection}
Comparar visualmente los tres escenarios. Un bloque para simetría, otro para ventaja por costos y otro para simetría interior. Resaltar solo las diferencias clave.`,
    alt: "Síntesis visual comparativa de los tres escenarios lineales y sus diferencias clave.",
    caption: "El cierre compara qué cambia por costos y qué se mantiene por simetría.",
    quality: "medium",
    size: "1536x1024",
    status: "draft",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/resumen-comparacion.png`,
    sketchLines: [
      "escenario 1 = simétrico",
      "escenario 2 = ventaja de costos",
      "escenario 3 = simetría interior",
      "mirar x*",
      "mirar ganancias",
    ],
  },
  {
    id: "anexo-cuadratico",
    sectionId: "anexo-cuadratico",
    placement: "after-section",
    prompt: `${whiteboardVisualDirection}
Mostrar que la versión cuadrática usa td^2 y cambia la sensibilidad de la demanda. Incluir una advertencia breve sobre unidades y resultados muy grandes.`,
    alt: "Síntesis visual de la extensión cuadrática y su advertencia de unidades.",
    caption: "La ruta cuadrática se deja aparte porque cambia la escala del problema.",
    quality: "medium",
    size: "1536x1024",
    status: "draft",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/anexo-cuadratico.png`,
    sketchLines: [
      "usar td²",
      "sensibilidad distinta",
      "ojo con las unidades",
      "precios muy grandes",
      "no mezclar con lineal",
    ],
  },
  {
    id: "tres-empresas",
    sectionId: "tres-empresas",
    placement: "after-section",
    prompt: `${whiteboardVisualDirection}
Mostrar tres empresas sobre la calle y resaltar que la empresa central cubre mercado por ambos lados. Etiquetar q2 mayor que q1 y q3.`,
    alt: "Síntesis visual del caso con tres empresas donde la firma central vende más.",
    caption: "La empresa del centro puede ganar mercado por ambos lados aun con precios iguales.",
    quality: "medium",
    size: "1536x1024",
    status: "draft",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/tres-empresas.png`,
    sketchLines: [
      "F1 - F2 - F3",
      "la del centro vende más",
      "q2 > q1",
      "q2 > q3",
      "ventaja de posición",
    ],
  },
];
