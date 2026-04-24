import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  HOTELLING_IMAGE_OUTPUT_DIR,
  HOTELLING_IMAGE_PUBLIC_DIR,
  imageManifest,
} from "../src/content/image-manifest";

type VisualKind =
  | "street-cost"
  | "assumptions"
  | "indifferent"
  | "demand"
  | "reaction"
  | "scenario-1"
  | "scenario-2"
  | "scenario-3"
  | "comparison"
  | "quadratic"
  | "three-firms";

const palette = {
  ink: "#0B0B0B",
  graphite: "#2E2E2E",
  night: "#1C2A3A",
  gold: "#C6A75E",
  wine: "#6E1F28",
  green: "#2F8A4C",
  blue: "#355C9B",
  orange: "#C27E00",
  paper: "#FFFDF8",
  soft: "#F2F2EE",
};

const fontPaths = {
  manrope: path.resolve("node_modules", "@fontsource", "manrope", "files", "manrope-latin-800-normal.woff2"),
  newsreader: path.resolve(
    "node_modules",
    "@fontsource",
    "newsreader",
    "files",
    "newsreader-latin-700-normal.woff2",
  ),
};

const embeddedFonts = {
  manrope: (await readFile(fontPaths.manrope)).toString("base64"),
  newsreader: (await readFile(fontPaths.newsreader)).toString("base64"),
};

const font = {
  body: "ManropeHotelling, Arial, sans-serif",
  title: "NewsreaderHotelling, Georgia, serif",
};

const visualKindById: Record<string, VisualKind> = {
  "panorama-costo-total": "street-cost",
  "modelo-lineal-supuestos": "assumptions",
  "consumidor-indiferente": "indifferent",
  "demandas-desde-xstar": "demand",
  "funciones-reaccion": "reaction",
  "escenario-1": "scenario-1",
  "escenario-2": "scenario-2",
  "escenario-3": "scenario-3",
  "resumen-comparacion": "comparison",
  "anexo-cuadratico": "quadratic",
  "tres-empresas": "three-firms",
};

const titleByKind: Record<VisualKind, string> = {
  "street-cost": "Idea: elegir es comparar costos totales",
  assumptions: "Regla: resolver todo con costo lineal",
  indifferent: "Paso central: encontrar la frontera x*",
  demand: "Paso siguiente: convertir x* en demanda",
  reaction: "Equilibrio: cruzar respuestas de precios",
  "scenario-1": "Caso 1: simetría total",
  "scenario-2": "Caso 2: ventaja de costos para A",
  "scenario-3": "Caso 3: simetría con ubicaciones interiores",
  comparison: "Cierre: comparar qué mueve el resultado",
  quadratic: "Anexo: por qué td² cambia el problema",
  "three-firms": "Anexo: tres empresas y ventaja central",
};

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function wrapText(value: string, maxLength = 42) {
  const words = value.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function text(lines: string[], x: number, y: number, size: number, color: string, weight = 700, lineGap = 12) {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * (size + lineGap)}" font-family="${font.body}" font-size="${size}" font-weight="${weight}" fill="${color}">${escapeXml(line)}</text>`,
    )
    .join("\n");
}

function formula(value: string, x: number, y: number, width = 420) {
  return `
    <rect x="${x}" y="${y}" width="${width}" height="74" rx="24" fill="#FFFFFF" stroke="${palette.night}" stroke-opacity="0.16" stroke-width="3" />
    <text x="${x + 28}" y="${y + 48}" font-family="${font.body}" font-size="34" font-weight="900" fill="${palette.night}">${escapeXml(value)}</text>
  `;
}

function pill(label: string, x: number, y: number, color: string, width = 190) {
  return `
    <rect x="${x}" y="${y}" width="${width}" height="52" rx="26" fill="${color}" opacity="0.96" />
    <text x="${x + width / 2}" y="${y + 34}" text-anchor="middle" font-family="${font.body}" font-size="22" font-weight="900" fill="${color === palette.gold ? palette.ink : "#FFFFFF"}">${escapeXml(label)}</text>
  `;
}

function arrow(x1: number, y1: number, x2: number, y2: number, color: string) {
  return `<path d="M${x1} ${y1} C ${(x1 + x2) / 2} ${y1 - 40}, ${(x1 + x2) / 2} ${y2 + 40}, ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" marker-end="url(#arrow)" />`;
}

function stepNotes(lines: string[]) {
  return lines
    .slice(0, 5)
    .map((line, index) => {
      const y = 340 + index * 86;
      const color = [palette.blue, palette.ink, palette.wine, palette.green, palette.orange][index] ?? palette.night;
      return `
        <circle cx="126" cy="${y - 10}" r="18" fill="${color}" />
        <text x="126" y="${y - 3}" text-anchor="middle" font-family="${font.body}" font-size="18" font-weight="900" fill="#FFFFFF">${index + 1}</text>
        ${text(wrapText(line.replace(/^\d+\.\s*/, ""), 35), 166, y, 26, color, 850, 8)}
      `;
    })
    .join("\n");
}

function street(options: {
  xStar?: number;
  a?: number;
  b?: number;
  L?: number;
  leftLabel?: string;
  rightLabel?: string;
  centerLabel?: string;
}) {
  const L = options.L ?? 100;
  const toX = (value: number) => 620 + (value / L) * 760;
  const xStar = toX(options.xStar ?? L / 2);
  const a = toX(options.a ?? 0);
  const b = toX(options.b ?? L);

  return `
    <rect x="600" y="396" width="810" height="266" rx="34" fill="#FFFFFF" stroke="${palette.night}" stroke-opacity="0.12" stroke-width="3" />
    <line x1="620" y1="526" x2="1380" y2="526" stroke="${palette.graphite}" stroke-width="12" stroke-linecap="round" opacity="0.18" />
    <line x1="620" y1="526" x2="${xStar}" y2="526" stroke="${palette.gold}" stroke-width="18" stroke-linecap="round" opacity="0.9" />
    <line x1="${xStar}" y1="526" x2="1380" y2="526" stroke="${palette.blue}" stroke-width="18" stroke-linecap="round" opacity="0.36" />
    <line x1="${xStar}" y1="432" x2="${xStar}" y2="618" stroke="${palette.wine}" stroke-width="6" stroke-dasharray="14 14" />
    <circle cx="${a}" cy="526" r="22" fill="${palette.night}" />
    <circle cx="${b}" cy="526" r="22" fill="${palette.ink}" />
    <circle cx="${xStar}" cy="526" r="18" fill="${palette.gold}" stroke="${palette.wine}" stroke-width="5" />
    ${text(["A"], a - 10, 474, 30, palette.night, 900)}
    ${text(["B"], b - 10, 474, 30, palette.ink, 900)}
    ${text([options.leftLabel ?? "mercado de A"], 650, 382, 24, palette.gold, 900)}
    ${text([options.rightLabel ?? "mercado de B"], 1130, 382, 24, palette.blue, 900)}
    ${text([options.centerLabel ?? `x* = ${options.xStar ?? L / 2}`], xStar - 54, 664, 27, palette.wine, 900)}
  `;
}

function bodyFor(kind: VisualKind) {
  if (kind === "street-cost") {
    return `
      ${street({ xStar: 50, centerLabel: "consumidor compara" })}
      ${formula("Costo total = p + td", 654, 220, 520)}
      ${pill("precio", 650, 720, palette.night, 160)}
      ${pill("traslado", 850, 720, palette.gold, 170)}
      ${pill("decisión", 1070, 720, palette.wine, 180)}
      ${arrow(740, 720, 1140, 702, palette.wine)}
    `;
  }

  if (kind === "assumptions") {
    return `
      <rect x="650" y="250" width="300" height="210" rx="28" fill="#FFFFFF" stroke="${palette.green}" stroke-width="6" />
      ${text(["Ruta correcta", "usar td"], 704, 328, 36, palette.green, 900)}
      <rect x="1010" y="250" width="300" height="210" rx="28" fill="#FFFFFF" stroke="${palette.wine}" stroke-width="6" />
      ${text(["No mezclar", "con td²"], 1062, 328, 36, palette.wine, 900)}
      <line x1="1040" y1="286" x2="1280" y2="430" stroke="${palette.wine}" stroke-width="9" stroke-linecap="round" />
      <line x1="1280" y1="286" x2="1040" y2="430" stroke="${palette.wine}" stroke-width="9" stroke-linecap="round" />
      ${formula("x* = (a+b)/2 + (pB-pA)/2t", 700, 560, 620)}
      ${pill("a < b", 690, 710, palette.night, 140)}
      ${pill("L fijo", 860, 710, palette.gold, 140)}
      ${pill("mercado cubierto", 1030, 710, palette.blue, 250)}
    `;
  }

  if (kind === "indifferent") {
    return `
      ${street({ xStar: 50, centerLabel: "x* divide el mercado" })}
      ${formula("costo A = costo B", 660, 210, 500)}
      ${arrow(900, 292, 1000, 420, palette.wine)}
      ${formula("despejar x -> x*", 840, 710, 460)}
    `;
  }

  if (kind === "demand") {
    return `
      ${street({ xStar: 50, centerLabel: "frontera x*" })}
      ${formula("qA = x*", 660, 220, 300)}
      ${formula("qB = L - x*", 1000, 220, 360)}
      ${arrow(820, 292, 820, 455, palette.gold)}
      ${arrow(1180, 292, 1180, 455, palette.blue)}
      ${formula("π = margen × cantidad", 760, 720, 520)}
    `;
  }

  if (kind === "reaction") {
    return `
      <rect x="610" y="215" width="780" height="620" rx="32" fill="#FFFFFF" stroke="${palette.night}" stroke-opacity="0.16" stroke-width="3" />
      <line x1="720" y1="650" x2="1160" y2="650" stroke="${palette.ink}" stroke-width="5" />
      <line x1="720" y1="650" x2="720" y2="280" stroke="${palette.ink}" stroke-width="5" />
      <path d="M750 598 L1118 350" stroke="${palette.blue}" stroke-width="8" stroke-linecap="round" />
      <path d="M780 350 L1118 598" stroke="${palette.wine}" stroke-width="8" stroke-linecap="round" />
      <circle cx="936" cy="465" r="20" fill="${palette.gold}" stroke="${palette.ink}" stroke-width="4" />
      ${text(["RA"], 1128, 348, 31, palette.blue, 900)}
      ${text(["RB"], 1128, 606, 31, palette.wine, 900)}
      ${pill("Nash", 868, 490, palette.gold, 142)}
      <rect x="790" y="695" width="300" height="56" rx="22" fill="#FFFFFF" stroke="${palette.night}" stroke-opacity="0.16" stroke-width="3" />
      ${text(["RA = RB"], 874, 732, 30, palette.night, 900)}
      <rect x="1110" y="255" width="245" height="116" rx="24" fill="#F2F2EE" stroke="${palette.blue}" stroke-opacity="0.24" stroke-width="3" />
      ${text(["RA: mejor precio", "de A si B fijó pB"], 1132, 302, 21, palette.blue, 900, 6)}
      <rect x="1110" y="630" width="245" height="126" rx="24" fill="#F2F2EE" stroke="${palette.wine}" stroke-opacity="0.24" stroke-width="3" />
      ${text(["RB: mejor precio", "de B si A fijó pA"], 1132, 678, 21, palette.wine, 900, 6)}
    `;
  }

  if (kind === "scenario-1") {
    return `
      ${street({ xStar: 50, leftLabel: "50 para A", rightLabel: "50 para B", centerLabel: "x* = 50" })}
      ${formula("pA = pB = 210", 680, 220, 440)}
      ${pill("qA = qB", 720, 710, palette.gold, 190)}
      ${pill("πA = πB", 980, 710, palette.night, 190)}
    `;
  }

  if (kind === "scenario-2") {
    return `
      ${street({ L: 60, xStar: 32, leftLabel: "A gana 32", rightLabel: "B queda con 28", centerLabel: "x* = 32" })}
      ${formula("cA < cB", 680, 220, 300)}
      ${formula("pA = 84, pB = 88", 1020, 220, 390)}
      ${pill("qA > qB", 760, 720, palette.gold, 190)}
      ${pill("ventaja de A", 1010, 720, palette.wine, 220)}
    `;
  }

  if (kind === "scenario-3") {
    return `
      ${street({ a: 20, b: 80, xStar: 50, leftLabel: "A en 20", rightLabel: "B en 80", centerLabel: "x* = 50" })}
      ${formula("pA = pB = 100", 680, 220, 440)}
      ${pill("simetría", 740, 720, palette.gold, 190)}
      ${pill("qA = qB = 50", 990, 720, palette.night, 230)}
    `;
  }

  if (kind === "comparison") {
    const columns = [
      ["1", "simetría", "x* = 50"],
      ["2", "costo A menor", "x* = 32"],
      ["3", "simetría interior", "x* = 50"],
    ];
    return columns
      .map((column, index) => {
        const x = 650 + index * 240;
        return `
          <rect x="${x}" y="300" width="210" height="340" rx="30" fill="#FFFFFF" stroke="${[palette.gold, palette.wine, palette.blue][index]}" stroke-width="6" />
          ${pill(`Caso ${column[0]}`, x + 28, 330, [palette.gold, palette.wine, palette.blue][index], 154)}
          ${text([column[1]], x + 28, 445, 29, palette.night, 900)}
          ${text([column[2]], x + 28, 535, 31, palette.wine, 900)}
        `;
      })
      .join("\n");
  }

  if (kind === "quadratic") {
    return `
      <rect x="650" y="285" width="310" height="300" rx="32" fill="#FFFFFF" stroke="${palette.green}" stroke-width="6" />
      ${text(["Lineal", "td"], 735, 400, 46, palette.green, 900)}
      <rect x="1020" y="285" width="310" height="300" rx="32" fill="#FFFFFF" stroke="${palette.wine}" stroke-width="6" />
      ${text(["Cuadrático", "td²"], 1075, 400, 46, palette.wine, 900)}
      ${arrow(960, 440, 1020, 440, palette.orange)}
      ${formula("cambia la sensibilidad", 740, 700, 560)}
    `;
  }

  return `
    <line x1="650" y1="526" x2="1340" y2="526" stroke="${palette.graphite}" stroke-width="12" stroke-linecap="round" opacity="0.2" />
    <circle cx="740" cy="526" r="24" fill="${palette.night}" />
    <circle cx="995" cy="526" r="28" fill="${palette.gold}" stroke="${palette.ink}" stroke-width="4" />
    <circle cx="1245" cy="526" r="24" fill="${palette.ink}" />
    ${text(["F1"], 718, 470, 30, palette.night, 900)}
    ${text(["F2"], 972, 462, 34, palette.gold, 900)}
    ${text(["F3"], 1224, 470, 30, palette.ink, 900)}
    ${arrow(860, 420, 985, 500, palette.gold)}
    ${arrow(1120, 420, 1005, 500, palette.gold)}
    ${formula("q2 > q1 y q2 > q3", 760, 700, 560)}
  `;
}

function createSvg(imageIndex: number) {
  const spec = imageManifest[imageIndex];
  const kind = visualKindById[spec.id] ?? "street-cost";
  const steps = spec.sketchLines.slice(0, 5);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024" role="img" aria-label="${escapeXml(spec.alt)}">
  <defs>
    <style>
      @font-face {
        font-family: "ManropeHotelling";
        src: url("data:font/woff2;base64,${embeddedFonts.manrope}") format("woff2");
        font-weight: 800 900;
      }
      @font-face {
        font-family: "NewsreaderHotelling";
        src: url("data:font/woff2;base64,${embeddedFonts.newsreader}") format("woff2");
        font-weight: 700 900;
      }
      text {
        paint-order: stroke;
        stroke-linejoin: round;
      }
    </style>
    <marker id="arrow" viewBox="0 0 16 16" refX="12" refY="8" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M2 2 L14 8 L2 14 Z" fill="${palette.wine}" />
    </marker>
    <pattern id="grid-${imageIndex}" width="42" height="42" patternUnits="userSpaceOnUse">
      <path d="M42 0H0V42" fill="none" stroke="${palette.night}" stroke-width="1" opacity="0.06" />
    </pattern>
  </defs>
  <rect width="1536" height="1024" rx="44" fill="${palette.paper}" />
  <rect width="1536" height="1024" fill="url(#grid-${imageIndex})" />
  <rect x="70" y="64" width="1396" height="896" rx="40" fill="#FFFFFF" stroke="${palette.night}" stroke-opacity="0.12" stroke-width="3" />
  <text x="112" y="138" font-family="${font.body}" font-size="27" font-weight="900" letter-spacing="4" fill="${palette.wine}">APUNTE PARA RESOLVER</text>
  ${text(wrapText(titleByKind[kind], 28), 112, 205, 34, palette.night, 900, 8).replaceAll(font.body, font.title)}
  <line x1="112" y1="286" x2="1424" y2="286" stroke="${palette.gold}" stroke-width="7" stroke-linecap="round" />
  ${stepNotes(steps)}
  <path d="M548 190 C 548 420, 548 620, 548 838" stroke="${palette.night}" stroke-opacity="0.12" stroke-width="4" stroke-dasharray="14 18" />
  ${bodyFor(kind)}
  <rect x="112" y="850" width="1312" height="62" rx="31" fill="${palette.soft}" stroke="${palette.night}" stroke-opacity="0.1" />
  <text x="148" y="890" font-family="${font.body}" font-size="24" font-weight="900" fill="${palette.graphite}">Recuerda: identifica el paso, usa solo la fórmula necesaria y revisa qué resultado cambia.</text>
</svg>
`;
}

function stripTrailingWhitespace(value: string) {
  return value.replace(/[ \t]+$/gm, "");
}

await mkdir(HOTELLING_IMAGE_OUTPUT_DIR, { recursive: true });

for (let index = 0; index < imageManifest.length; index += 1) {
  const image = imageManifest[index];
  if (!image.assetPath) {
    continue;
  }

  const fileName = image.assetPath.replace(`${HOTELLING_IMAGE_PUBLIC_DIR}/`, "");
  await writeFile(path.join(HOTELLING_IMAGE_OUTPUT_DIR, fileName), stripTrailingWhitespace(createSvg(index)), "utf8");
}

console.log(`Assets SVG didácticos generados en ${HOTELLING_IMAGE_OUTPUT_DIR}.`);
