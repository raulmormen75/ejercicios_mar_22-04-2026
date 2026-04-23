import process from "node:process";
import { imageManifest } from "../src/content/image-manifest";
import { lessonModules, scenarios } from "../src/content/lesson-content";
import { computeLinearEquilibrium } from "../src/content/calculations";

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

const manifestBySection = new Map(imageManifest.map((image) => [image.sectionId, image]));

for (const module of lessonModules) {
  assert(
    manifestBySection.has(module.id),
    `Falta una imagen de síntesis para la sección "${module.id}".`,
  );
}

for (const scenario of scenarios) {
  const recalculated = computeLinearEquilibrium(scenario.params);
  assert(
    JSON.stringify(recalculated) === JSON.stringify(scenario.equilibrium),
    `Los resultados del ${scenario.id} no coinciden con la fórmula implementada.`,
  );
  assert(
    manifestBySection.has(scenario.id),
    `Falta la imagen de síntesis del ${scenario.id}.`,
  );
}

assert(manifestBySection.has("resumen"), "Falta la imagen de síntesis del resumen.");
assert(manifestBySection.has("anexo-cuadratico"), "Falta la imagen de la extensión cuadrática.");
assert(manifestBySection.has("tres-empresas"), "Falta la imagen de la extensión con tres empresas.");

console.log("Smoke check completado: contenido, escenarios e imágenes están alineados.");
process.exit(0);
