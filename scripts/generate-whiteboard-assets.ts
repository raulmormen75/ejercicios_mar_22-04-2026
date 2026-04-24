import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  HOTELLING_IMAGE_OUTPUT_DIR,
  HOTELLING_IMAGE_PUBLIC_DIR,
  imageManifest,
} from "../src/content/image-manifest";

const palette = ["#1C2A3A", "#6E1F28", "#C6A75E", "#2E2E2E", "#0B0B0B"];

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function wrapText(value: string, maxLength = 52) {
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

  return lines.slice(0, 3);
}

function textBlock(lines: string[], x: number, y: number, size: number, color: string, weight = 700) {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * (size + 12)}" font-family="Manrope, Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${escapeXml(line)}</text>`,
    )
    .join("\n");
}

function createSvg(imageIndex: number) {
  const spec = imageManifest[imageIndex];
  const title = wrapText(spec.caption, 58);
  const lines = spec.sketchLines.slice(0, 5);
  const lineItems = lines
    .map((line, index) => {
      const y = 420 + index * 82;
      const color = palette[index % palette.length];
      const bulletX = 155 + (index % 2) * 18;
      return `
        <circle cx="${bulletX}" cy="${y - 10}" r="12" fill="${color}" opacity="0.9" />
        <path d="M210 ${y - 22} C 360 ${y - 54}, 560 ${y + 32}, 760 ${y - 10}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" opacity="0.75" />
        ${textBlock([line], 825, y, 38, color, 800)}
      `;
    })
    .join("\n");

  const accent = palette[imageIndex % palette.length];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024" role="img" aria-label="${escapeXml(spec.alt)}">
  <defs>
    <pattern id="grid-${imageIndex}" width="42" height="42" patternUnits="userSpaceOnUse">
      <path d="M42 0H0V42" fill="none" stroke="#1C2A3A" stroke-width="1" opacity="0.06" />
    </pattern>
    <filter id="soft-shadow-${imageIndex}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="22" stdDeviation="22" flood-color="#1C2A3A" flood-opacity="0.14" />
    </filter>
  </defs>
  <rect width="1536" height="1024" rx="44" fill="#FFFDF8" />
  <rect x="0" y="0" width="1536" height="1024" fill="url(#grid-${imageIndex})" />
  <rect x="78" y="70" width="1380" height="884" rx="36" fill="#FFFFFF" stroke="#1C2A3A" stroke-opacity="0.14" stroke-width="3" filter="url(#soft-shadow-${imageIndex})" />
  <path d="M146 218 C 310 120, 554 136, 748 178 S 1094 258, 1322 166" fill="none" stroke="${accent}" stroke-width="12" stroke-linecap="round" opacity="0.24" />
  <circle cx="1284" cy="196" r="86" fill="${accent}" opacity="0.1" />
  <text x="142" y="150" font-family="Manrope, Arial, sans-serif" font-size="28" font-weight="900" letter-spacing="4" fill="#6E1F28">SÍNTESIS VISUAL</text>
  ${textBlock(title, 142, 222, 48, "#1C2A3A", 900)}
  <line x1="142" y1="342" x2="1390" y2="342" stroke="#C6A75E" stroke-width="6" stroke-linecap="round" opacity="0.95" />
  <path d="M185 770 C 370 690, 558 810, 725 740 S 1030 662, 1302 770" fill="none" stroke="#6E1F28" stroke-width="7" stroke-linecap="round" stroke-dasharray="18 18" opacity="0.45" />
  ${lineItems}
  <rect x="116" y="862" width="1304" height="48" rx="24" fill="#F2F2EE" stroke="#1C2A3A" stroke-opacity="0.08" />
  <text x="150" y="894" font-family="Manrope, Arial, sans-serif" font-size="24" font-weight="800" fill="#2E2E2E">Apunte tipo pizarrón blanco: una idea, flechas y resultado destacado.</text>
</svg>
`;
}

await mkdir(HOTELLING_IMAGE_OUTPUT_DIR, { recursive: true });

for (let index = 0; index < imageManifest.length; index += 1) {
  const image = imageManifest[index];
  if (!image.assetPath) {
    continue;
  }

  const fileName = image.assetPath.replace(`${HOTELLING_IMAGE_PUBLIC_DIR}/`, "");
  await writeFile(path.join(HOTELLING_IMAGE_OUTPUT_DIR, fileName), createSvg(index), "utf8");
}

console.log(`Assets SVG generados en ${HOTELLING_IMAGE_OUTPUT_DIR}.`);
