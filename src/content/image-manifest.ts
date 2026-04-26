import type { SectionImageSpec } from "../types";

export const HOTELLING_IMAGE_MODEL = "gpt-image-2" as const;
export const HOTELLING_IMAGE_OUTPUT_DIR = "public/generated/hotelling" as const;
export const HOTELLING_IMAGE_PUBLIC_DIR = "/generated/hotelling" as const;
export const HOTELLING_HERO_IMAGE_PUBLIC_PATH = `${HOTELLING_IMAGE_PUBLIC_DIR}/panorama-costo-total.png` as const;

export const whiteboardVisualDirection = `
Estilo de apunte en pizarrón blanco sobre fondo marfil claro, como una lámina escrita con plumones.
Trazos manuales limpios, gruesos y legibles en azul, negro, rojo vino, verde y dorado sobrio.
Texto corto, grande y perfectamente legible; usar lettering impreso con apariencia de plumón, no letra deformada.
Composición horizontal 3:2 con dos zonas: columna izquierda de pasos numerados y zona derecha con el diagrama principal.
Usar títulos grandes, etiquetas breves, cajas redondeadas, flechas claras y una franja inferior de recordatorio.
Una sola idea visual por imagen, máximo dos fórmulas principales y hasta cinco etiquetas breves.
Sin personas, sin salón real, sin decoración extra, sin collages, sin estética infantil y sin apariencia SVG.
El objetivo es que parezca un apunte de profesor claro, académico y listo para estudiar en móvil.
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
    status: "generated",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/panorama-costo-total.svg`,
    generatedAssetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/panorama-costo-total.png`,
    sketchLines: [
      "1. ubica A, B y al consumidor",
      "2. suma precio + traslado",
      "3. costo total = p + td",
      "resultado: gana el menor costo total",
      "la frontera sale al igualar costos",
    ],
  },
  {
    id: "modelo-lineal-supuestos",
    sectionId: "modelo-lineal",
    placement: "after-section",
    prompt: `${whiteboardVisualDirection}
Explicar visualmente los supuestos del modelo lineal con la misma limpieza compositiva del panel de demandas y ganancias. Usar una columna izquierda con cuatro notas breves numeradas y, a la derecha, una calle ordenada con A, B, a, b, x*, calle L, consumidores uniformes, una caja de ruta principal td, otra de td^2 va aparte, una nota de costo total = precio + traslado, una caja de mercado cubierto y la fórmula final de x*. Priorizar alineación, espaciado uniforme y texto corto muy legible.`,
    alt: "Síntesis visual de los supuestos del modelo lineal y advertencia para no mezclar la versión cuadrática.",
    caption: "La ruta principal necesita una sola convención para no mezclar resultados incompatibles.",
    quality: "medium",
    size: "1536x1024",
    status: "generated",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/modelo-lineal-supuestos.svg`,
    generatedAssetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/modelo-lineal-supuestos.png`,
    sketchLines: [
      "1. usar costo lineal td",
      "2. no mezclar con td²",
      "3. a < b y calle L",
      "4. consumidores uniformes",
      "resultado: una sola convención",
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
    status: "generated",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/consumidor-indiferente.svg`,
    generatedAssetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/consumidor-indiferente.png`,
    sketchLines: [
      "1. iguala costo A = costo B",
      "2. despeja x",
      "3. aparece x*",
      "izquierda: compra A",
      "derecha: compra B",
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
    status: "generated",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/demandas-desde-xstar.svg`,
    generatedAssetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/demandas-desde-xstar.png`,
    sketchLines: [
      "1. mide desde 0 hasta x*",
      "2. qA = x*",
      "3. qB = L - x*",
      "4. margen x cantidad",
      "resultado: ganancia de cada empresa",
    ],
  },
  {
    id: "funciones-reaccion",
    sectionId: "reacciones-equilibrio",
    placement: "after-section",
    prompt: `${whiteboardVisualDirection}
Mostrar dos rectas de reacción que se cruzan. Explicar que RA es el mejor precio de A dado el precio de B, y que RB es el mejor precio de B dado el precio de A. Etiquetar RA, RB y equilibrio de Nash sin saturar el dibujo.`,
    alt: "Síntesis visual del cruce de funciones de reacción: RA es la mejor respuesta de A y RB la mejor respuesta de B.",
    caption: "Cada empresa responde al precio de la otra y el equilibrio aparece donde ambas respuestas coinciden.",
    quality: "medium",
    size: "1536x1024",
    status: "generated",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/funciones-reaccion.svg`,
    generatedAssetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/funciones-reaccion.png`,
    sketchLines: [
      "1. RA: precio óptimo de A dado pB",
      "2. RB: precio óptimo de B dado pA",
      "3. cruza RA con RB",
      "resultado: precios de Nash",
      "nadie mejora cambiando solo",
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
    status: "generated",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/escenario-1.svg`,
    generatedAssetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/escenario-1.png`,
    sketchLines: [
      "1. costos y posiciones iguales",
      "2. pA = pB = 210",
      "3. x* = 50",
      "qA = qB = 50",
      "resultado: πA = πB = 10000",
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
    status: "generated",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/escenario-2.svg`,
    generatedAssetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/escenario-2.png`,
    sketchLines: [
      "1. A tiene menor costo",
      "2. pA = 84 y pB = 88",
      "3. x* = 32",
      "qA = 32 y qB = 28",
      "resultado: A gana más mercado",
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
    status: "generated",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/escenario-3.svg`,
    generatedAssetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/escenario-3.png`,
    sketchLines: [
      "1. A está en 20 y B en 80",
      "2. siguen simétricas",
      "3. pA = pB = 100",
      "x* = 50",
      "resultado: qA = qB = 50",
    ],
  },
  {
    id: "resumen-comparacion",
    sectionId: "resumen",
    placement: "after-section",
    prompt: `${whiteboardVisualDirection}
Comparar visualmente los tres escenarios. Un bloque para simetría, otro para ventaja por costos y otro para simetría interior. Resaltar solo las diferencias principales.`,
    alt: "Síntesis visual comparativa de los tres escenarios lineales y sus diferencias principales.",
    caption: "El cierre compara qué cambia por costos y qué se mantiene por simetría.",
    quality: "medium",
    size: "1536x1024",
    status: "generated",
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/resumen-comparacion.svg`,
    generatedAssetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/resumen-comparacion.png`,
    sketchLines: [
      "1. si todo es igual: mitad y mitad",
      "2. si A cuesta menos: x* se mueve",
      "3. si se conserva simetría: vuelve al centro",
      "comparar precios, x* y ganancias",
      "resultado: costos explican la diferencia",
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
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/anexo-cuadratico.svg`,
    generatedAssetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/anexo-cuadratico.png`,
    sketchLines: [
      "1. aquí se usa td²",
      "2. cambia la sensibilidad",
      "3. las unidades importan",
      "precios pueden crecer mucho",
      "resultado: no mezclar con lineal",
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
    assetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/tres-empresas.svg`,
    generatedAssetPath: `${HOTELLING_IMAGE_PUBLIC_DIR}/tres-empresas.png`,
    sketchLines: [
      "1. ubica F1, F2 y F3",
      "2. F2 recibe demanda por ambos lados",
      "3. q2 > q1",
      "4. q2 > q3",
      "resultado: ventaja de estar al centro",
    ],
  },
];
