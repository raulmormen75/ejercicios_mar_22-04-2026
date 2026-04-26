import type { LessonModule, ScenarioDefinition } from "../types";
import { computeLinearEquilibrium } from "./calculations";

export const lessonModules: LessonModule[] = [
  {
    id: "panorama",
    title: "Panorama del tema",
    eyebrow: "Qué vamos a resolver",
    goal: "Entender por qué la distancia cambia la competencia cuando dos empresas venden en una misma calle.",
    intuition:
      "El consumidor no solo compara precios. También compara qué tan lejos está cada empresa. Por eso, el costo total de comprar combina precio y traslado.",
    formulas: ["\\text{Costo total}=p+td", "U_i=S-p_i-td_i"],
    steps: [
      {
        label: "Idea inicial",
        math: "\\text{costo total en A}=p_A+t(x-a)",
        description: "El alumno debe leer esta expresión como «precio más costo por desplazarse hasta A».",
      },
      {
        label: "Comparación central",
        math: "\\text{costo total en B}=p_B+t(b-x)",
        description: "La compra cambia de empresa cuando ambas expresiones cuestan lo mismo.",
      },
    ],
    summaryImageId: "panorama-costo-total",
    summaryCaption: "La primera síntesis visual muestra que competir aquí significa mover una frontera de mercado, no solo un precio.",
    takeaways: [
      {
        title: "El precio no trabaja solo",
        text: "Si una empresa está más lejos, debe compensar esa desventaja con un precio más atractivo.",
      },
      {
        title: "La calle se divide",
        text: "Encontrar al consumidor indiferente permite saber qué parte del mercado compra en cada empresa.",
      },
    ],
  },
  {
    id: "modelo-lineal",
    title: "Modelo lineal y supuestos",
    eyebrow: "Qué estamos suponiendo",
    goal: "Fijar una sola convención para resolver bien la tarea: costo lineal de transporte.",
    intuition:
      "La tarea pide costo lineal. Por ello, toda la ruta principal usa td y deja td^2 como una extensión separada.",
    assumptions: [
      "La calle tiene longitud L.",
      "Las empresas están en a y b, con a < b.",
      "Los consumidores están distribuidos de forma uniforme.",
      "El mercado está cubierto y cada persona compra en una empresa.",
      "No se mezcla la versión lineal con la cuadrática dentro del mismo recorrido.",
    ],
    formulas: ["x^*=\\frac{a+b}{2}+\\frac{p_B-p_A}{2t}"],
    summaryImageId: "modelo-lineal-supuestos",
    summaryCaption: "La advertencia central es sencilla: una convención clara evita mezclar resultados incompatibles.",
    takeaways: [
      {
        title: "Un solo lenguaje matemático",
        text: "La versión lineal organiza toda la explicación principal y mantiene la tarea consistente.",
      },
      {
        title: "Los supuestos importan",
        text: "Las fórmulas de demanda y equilibrio dependen de esta estructura y no funcionan igual fuera de ella.",
      },
    ],
  },
  {
    id: "consumidor-indiferente",
    title: "Consumidor indiferente",
    eyebrow: "Frontera de mercado",
    goal: "Resolver el punto x* donde comprar en A o en B cuesta exactamente lo mismo.",
    intuition:
      "Este punto divide el mercado en dos zonas. A la izquierda domina A y a la derecha domina B, salvo que un precio cambie la frontera.",
    formulas: [
      "p_A+t(x-a)=p_B+t(b-x)",
      "x^*=\\frac{a+b}{2}+\\frac{p_B-p_A}{2t}",
    ],
    steps: [
      {
        label: "Igualar costos",
        math: "p_A+t(x-a)=p_B+t(b-x)",
        description: "Aquí nace la frontera de mercado.",
      },
      {
        label: "Aislar x",
        math: "2tx=p_B-p_A+t(a+b)",
        description: "La ecuación queda lista para interpretar posición y precios dentro de una sola expresión.",
      },
      {
        label: "Leer el resultado",
        math: "x^*=\\frac{a+b}{2}+\\frac{p_B-p_A}{2t}",
        description: "La mitad de la calle se corrige por la diferencia de precios.",
      },
    ],
    summaryImageId: "consumidor-indiferente",
    summaryCaption: "x* es la frontera que se mueve cuando cambian los precios relativos.",
    takeaways: [
      {
        title: "Si los precios son iguales",
        text: "El consumidor indiferente queda a la mitad entre las empresas.",
      },
      {
        title: "Si B cobra más",
        text: "A empuja la frontera hacia la derecha y gana más mercado.",
      },
    ],
  },
  {
    id: "demandas-ganancias",
    title: "Demandas y ganancias",
    eyebrow: "Traducir la frontera en ventas",
    goal: "Usar x* para obtener cantidades vendidas y después ganancias.",
    intuition:
      "Una vez localizada la frontera, el resto es medir cuánto mercado queda a cada lado y multiplicar por el margen.",
    formulas: [
      "q_A=x^*",
      "q_B=L-x^*",
      "\\pi_A=(p_A-c_A)q_A",
      "\\pi_B=(p_B-c_B)q_B",
    ],
    summaryImageId: "demandas-desde-xstar",
    summaryCaption: "La demanda no aparece de la nada: sale directamente de la posición del consumidor indiferente.",
    takeaways: [
      {
        title: "La frontera se vuelve cantidad",
        text: "Si x* se mueve a favor de una empresa, su demanda también lo hace.",
      },
      {
        title: "La ganancia combina dos fuerzas",
        text: "Importa tanto el margen por unidad como el tamaño del mercado que cada empresa captura.",
      },
    ],
  },
  {
    id: "reacciones-equilibrio",
    title: "Funciones de reacción y equilibrio",
    eyebrow: "Precios que se responden entre sí",
    goal: "Ver cómo cada empresa escoge su mejor precio dado el precio de la otra y cómo eso lleva al equilibrio de Nash.",
    intuition:
      "Cada empresa reacciona al precio rival. El equilibrio aparece cuando ninguna quiere moverse de ese punto.",
    formulas: [
      "p_A=\\frac{t(a+b)+p_B+c_A}{2}",
      "p_B=\\frac{t(2L-a-b)+p_A+c_B}{2}",
    ],
    summaryImageId: "funciones-reaccion",
    summaryCaption: "Las dos rectas de reacción muestran un diálogo estratégico entre precios.",
    takeaways: [
      {
        title: "Reaccionar no es improvisar",
        text: "Cada fórmula resume el mejor precio posible si el rival mantiene el suyo.",
      },
      {
        title: "El equilibrio es un cruce",
        text: "Ese cruce da los precios de Nash y permite calcular el resto del ejercicio.",
      },
    ],
  },
];

export const scenarios: ScenarioDefinition[] = [
  {
    id: "escenario-1",
    title: "Escenario 1: simetría total",
    shortLabel: "Caso base",
    statement:
      "La calle mide 100 metros. La empresa A está en x=0 y la empresa B en x=100. Las dos tienen costo marginal 10 y el transporte cuesta t=2 por cada metro. Como todo es simétrico, vamos a comprobar si el mercado se divide exactamente a la mitad.",
    params: {
      L: 100,
      a: 0,
      b: 100,
      cA: 10,
      cB: 10,
      t: 2,
    },
    equilibrium: computeLinearEquilibrium({
      L: 100,
      a: 0,
      b: 100,
      cA: 10,
      cB: 10,
      t: 2,
    }),
    solutionSteps: [
      {
        label: "1. 📌 Datos del ejercicio",
        math: "L=100,\\ a=0,\\ b=100,\\ c_A=10,\\ c_B=10,\\ t=2",
        description: "Estos son los datos que vienen en el enunciado. A y B están en los extremos, y ninguna tiene ventaja de costos.",
      },
      {
        label: "2. 🧮 Reacciones de precios",
        math: "R_A=t(a+b)+c_A=2(0+100)+10=210,\\quad R_B=t(2L-a-b)+c_B=2(200-0-100)+10=210",
        description: "Primero calculamos los valores que entran a las respuestas de cada empresa. Salen iguales porque el caso está balanceado.",
      },
      {
        label: "3. 💰 Precios de equilibrio",
        math: "p_A^*=\\frac{2R_A+R_B}{3}=\\frac{2(210)+210}{3}=210,\\quad p_B^*=\\frac{R_A+2R_B}{3}=\\frac{210+2(210)}{3}=210",
        description: "Ahora usamos esos valores para encontrar los precios. Como ambos lados son iguales, las dos empresas cobran 210.",
      },
      {
        label: "4. ✅ Comprobación rápida",
        math: "\\frac{2(0+100)+210+10}{2}=210,\\quad \\frac{2(200-0-100)+210+10}{2}=210",
        description: "Si una empresa ve que la otra cobra 210, su mejor respuesta también es cobrar 210. Por eso el precio queda estable.",
      },
      {
        label: "5. 📍 Consumidor indiferente y demanda",
        math: "x^*=\\frac{0+100}{2}+\\frac{210-210}{2(2)}=50,\\quad q_A=50,\\quad q_B=100-50=50",
        description: "El consumidor indiferente es quien está justo donde comprar en A o en B cuesta lo mismo. Aquí queda en 50, así que cada empresa atiende 50 consumidores.",
      },
      {
        label: "6. ✅ Ganancias",
        math: "\\pi_A=(210-10)(50)=10{,}000,\\quad \\pi_B=(210-10)(50)=10{,}000",
        description: "La ganancia sale de restar el costo al precio y multiplicar por los consumidores. Como todo es igual, ambas ganan 10,000.",
      },
    ],
    equilibriumInterpretation:
      "Este escenario confirma la intuición: si las empresas están igual de ubicadas y tienen los mismos costos, ninguna queda con ventaja. A y B cobran 210, atienden 50 consumidores y ganan 10,000.",
    whyItChanges:
      "Ambas empresas están en extremos opuestos y tienen los mismos costos. Por eso, todo queda repartido en partes iguales.",
    verificationNote:
      "El consumidor indiferente cae en x*=50 y confirma una división exacta del mercado.",
  },
  {
    id: "escenario-2",
    title: "Escenario 2: asimetría en costos",
    shortLabel: "Ventaja tecnológica",
    statement:
      "La calle mide 60 metros. A está en x=0 y B en x=60. A tiene costo marginal 20 y B tiene costo marginal 32. Como A produce más barato, veremos cómo esa ventaja mueve el mercado hacia su lado.",
    params: {
      L: 60,
      a: 0,
      b: 60,
      cA: 20,
      cB: 32,
      t: 1,
    },
    equilibrium: computeLinearEquilibrium({
      L: 60,
      a: 0,
      b: 60,
      cA: 20,
      cB: 32,
      t: 1,
    }),
    solutionSteps: [
      {
        label: "1. 📌 Datos del ejercicio",
        math: "L=60,\\ a=0,\\ b=60,\\ c_A=20,\\ c_B=32,\\ t=1",
        description: "Aquí la diferencia importante está en los costos: A produce más barato que B.",
      },
      {
        label: "2. 🧮 Reacciones de precios",
        math: "R_A=t(a+b)+c_A=1(0+60)+20=80,\\quad R_B=t(2L-a-b)+c_B=1(120-0-60)+32=92",
        description: "Calculamos los valores base de cada respuesta. El de B queda más alto porque B tiene mayor costo.",
      },
      {
        label: "3. 💰 Precios de equilibrio",
        math: "p_A^*=\\frac{2R_A+R_B}{3}=\\frac{2(80)+92}{3}=84,\\quad p_B^*=\\frac{R_A+2R_B}{3}=\\frac{80+2(92)}{3}=88",
        description: "A puede cobrar menos porque producir le cuesta menos. B cobra más porque su costo es mayor.",
      },
      {
        label: "4. ✅ Comprobación rápida",
        math: "\\frac{1(0+60)+88+20}{2}=84,\\quad \\frac{1(120-0-60)+84+32}{2}=88",
        description: "Si B cobra 88, a A le conviene cobrar 84. Si A cobra 84, a B le conviene cobrar 88. Por eso esos precios se sostienen.",
      },
      {
        label: "5. 📍 Consumidor indiferente y demanda",
        math: "x^*=\\frac{0+60}{2}+\\frac{88-84}{2(1)}=32,\\quad q_A=32,\\quad q_B=60-32=28",
        description: "La mitad de la calle sería 30, pero la frontera se mueve a 32. Eso significa que A atiende más consumidores que B.",
      },
      {
        label: "6. ✅ Ganancias",
        math: "\\pi_A=(84-20)(32)=2{,}048,\\quad \\pi_B=(88-32)(28)=1{,}568",
        description: "A gana más porque tiene menor costo, vende más y mantiene un buen margen por unidad.",
      },
    ],
    equilibriumInterpretation:
      "Este escenario muestra la ventaja de costos. A cobra 84, vende 32 unidades y gana 2,048. B cobra 88, vende 28 unidades y gana 1,568. La ventaja de A no solo baja su precio: también le permite ganar más mercado.",
    whyItChanges:
      "A produce más barato, puede cobrar menos y empuja la frontera de mercado hacia el lado de B.",
    verificationNote:
      "El punto x*=32 deja ver que la frontera ya no cae en la mitad de la calle.",
  },
  {
    id: "escenario-3",
    title: "Escenario 3: ubicaciones interiores",
    shortLabel: "Agrupamiento equilibrado",
    statement:
      "La calle mide 100 metros, pero las empresas ya no están en los extremos: A está en x=20 y B en x=80. Ambas tienen costo marginal 0 y el transporte cuesta t=1. Aunque están más cerca del centro, siguen ubicadas de forma simétrica.",
    params: {
      L: 100,
      a: 20,
      b: 80,
      cA: 0,
      cB: 0,
      t: 1,
    },
    equilibrium: computeLinearEquilibrium({
      L: 100,
      a: 20,
      b: 80,
      cA: 0,
      cB: 0,
      t: 1,
    }),
    solutionSteps: [
      {
        label: "1. 📌 Datos del ejercicio",
        math: "L=100,\\ a=20,\\ b=80,\\ c_A=0,\\ c_B=0,\\ t=1",
        description: "La diferencia con el primer caso es la ubicación: las empresas están dentro de la calle, no en los extremos.",
      },
      {
        label: "2. 🧮 Reacciones de precios",
        math: "R_A=t(a+b)+c_A=1(20+80)+0=100,\\quad R_B=t(2L-a-b)+c_B=1(200-20-80)+0=100",
        description: "Calculamos los valores base. Salen iguales porque A y B están a la misma distancia del centro.",
      },
      {
        label: "3. 💰 Precios de equilibrio",
        math: "p_A^*=\\frac{2R_A+R_B}{3}=\\frac{2(100)+100}{3}=100,\\quad p_B^*=\\frac{R_A+2R_B}{3}=\\frac{100+2(100)}{3}=100",
        description: "Como los valores base son iguales, los precios de equilibrio también son iguales: 100 y 100.",
      },
      {
        label: "4. ✅ Comprobación rápida",
        math: "\\frac{1(20+80)+100+0}{2}=100,\\quad \\frac{1(200-20-80)+100+0}{2}=100",
        description: "Si una empresa cobra 100, la mejor respuesta de la otra también es 100. El equilibrio queda estable.",
      },
      {
        label: "5. 📍 Consumidor indiferente y demanda",
        math: "x^*=\\frac{20+80}{2}+\\frac{100-100}{2(1)}=50,\\quad q_A=50,\\quad q_B=100-50=50",
        description: "El consumidor indiferente vuelve a quedar en el centro. A atiende 50 consumidores y B atiende 50.",
      },
      {
        label: "6. ✅ Ganancias",
        math: "\\pi_A=(100-0)(50)=5{,}000,\\quad \\pi_B=(100-0)(50)=5{,}000",
        description: "Como venden lo mismo y no tienen costo marginal, las dos empresas ganan 5,000.",
      },
    ],
    equilibriumInterpretation:
      "Este escenario enseña que moverse hacia el interior no rompe la simetría si ambas empresas quedan balanceadas. A y B cobran 100, atienden 50 consumidores y ganan 5,000.",
    whyItChanges:
      "Las empresas dejan los extremos, pero conservan una simetría perfecta respecto al centro.",
    verificationNote:
      "El equilibrio vuelve a repartir la calle de forma pareja, con x*=50.",
  },
];

export const advancedNotes = {
  cuadratico: {
    title: "Costo cuadrático",
    summary:
      "Esta ruta muestra por qué td² produce resultados muy distintos y por qué no debe mezclarse con la convención lineal.",
    formulas: [
      "p_A+t(x-a)^2=p_B+t(b-x)^2",
      "x^*=\\frac{p_B-p_A}{2t(b-a)}+\\frac{a+b}{2}",
    ],
    observations: [
      "La sensibilidad de la demanda depende ahora de la distancia entre empresas.",
      "Usar metros y elevar al cuadrado puede disparar los precios y volverlos poco intuitivos.",
      "Si se normaliza la calle, también debe revisarse la interpretación de t.",
    ],
    summaryImageId: "anexo-cuadratico",
  },
  tresEmpresas: {
    title: "Referencia con tres empresas",
    summary:
      "El caso con tres empresas se usa como referencia complementaria y deja ver la ventaja natural de la firma del centro.",
    formulas: [
      "q_1=\\frac{1}{4}+\\frac{p_2-p_1}{60}",
      "q_2=\\frac{1}{2}+\\frac{p_1+p_3-2p_2}{60}",
      "q_3=\\frac{1}{4}+\\frac{p_2-p_3}{60}",
    ],
    observations: [
      "Las tres empresas pueden cobrar el mismo precio y aun así vender cantidades distintas.",
      "La empresa central cubre mercado por ambos lados.",
      "Este caso se deja como apoyo, no como parte obligatoria del recorrido principal.",
    ],
    summaryImageId: "tres-empresas",
  },
};
