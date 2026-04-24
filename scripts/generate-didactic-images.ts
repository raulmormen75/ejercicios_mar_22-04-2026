import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";
import {
  HOTELLING_IMAGE_MODEL,
  HOTELLING_IMAGE_OUTPUT_DIR,
  imageManifest,
  whiteboardVisualDirection,
} from "../src/content/image-manifest";

type CliOptions = {
  ids: Set<string>;
  statuses: Set<string>;
  includeAll: boolean;
  force: boolean;
  dryRun: boolean;
  concurrency: string;
};

const IMAGEGEN_CLI =
  process.env.IMAGEGEN_CLI ?? "C:\\Users\\spart\\.codex\\skills\\imagegen\\scripts\\image_gen.py";

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    ids: new Set<string>(),
    statuses: new Set<string>(),
    includeAll: false,
    force: false,
    dryRun: false,
    concurrency: "2",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--all") {
      options.includeAll = true;
      continue;
    }

    if (arg === "--force" || arg === "--overwrite") {
      options.force = true;
      continue;
    }

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--concurrency") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("Falta el valor para --concurrency.");
      }
      options.concurrency = value;
      index += 1;
      continue;
    }

    if (arg === "--id" || arg === "--ids" || arg === "--only") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error(`Falta el valor para ${arg}.`);
      }

      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item) => options.ids.add(item));
      index += 1;
      continue;
    }

    if (arg === "--status") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("Falta el valor para --status.");
      }

      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item) => options.statuses.add(item));
      index += 1;
      continue;
    }
  }

  return options;
}

function selectImages(options: CliOptions) {
  return imageManifest.filter((image) => {
    if (options.ids.size > 0) {
      return options.ids.has(image.id);
    }

    if (options.statuses.size > 0) {
      return options.statuses.has(image.status);
    }

    if (options.includeAll) {
      return true;
    }

    return image.status === "draft" || image.status === "approved";
  });
}

function buildPrompt(image: (typeof imageManifest)[number]) {
  const primaryRequest = image.prompt.replace(whiteboardVisualDirection, "").trim();

  return `
Use case: infographic-diagram
Asset type: imagen didáctica para una app web educativa de economía.
Primary request: ${primaryRequest}
Scene/background: pizarrón blanco limpio, superficie marfil clara, trazo de plumón visible y ordenado.
Style/medium: apunte visual profesional, juvenil y académico; no caricatura infantil; no salón; no personas.
Composition/framing: horizontal 1536x1024, lectura de izquierda a derecha, una idea central, flechas y círculos para guiar el procedimiento.
Color palette: negro profundo #0B0B0B, azul noche #1C2A3A, dorado sobrio #C6A75E, rojo vino #6E1F28, verde y azul moderados para diferenciar pasos.
Typography: títulos con apariencia editorial serif similar a Newsreader; etiquetas y notas con sans geométrica similar a Manrope; texto grande, limpio y muy legible.
Text rules: máximo dos fórmulas y cinco etiquetas cortas; no inventar resultados; no llenar la imagen de derivaciones completas.
Required visible notes: ${image.sketchLines.join(" | ")}.
Constraints: debe explicar cómo resolver el paso con claridad; debe coincidir con el contenido matemático validado de la app; sin logotipos, sin firma, sin marca personal, sin watermark.
Avoid: tipografía genérica tipo Arial, letras deformadas, texto pequeño, ruido visual, exceso de fórmulas, decoración sin función, errores en números o símbolos.
`.trim();
}

async function runImagegenCli(args: string[]) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn("python", [IMAGEGEN_CLI, ...args], {
      cwd: process.cwd(),
      env: process.env,
      shell: false,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`imagegen terminó con código ${code}.`));
    });
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const selectedImages = selectImages(options);

  if (!selectedImages.length) {
    throw new Error("No hay imágenes seleccionadas con los filtros actuales.");
  }

  if (!options.dryRun && !process.env.OPENAI_API_KEY) {
    throw new Error(
      "Falta OPENAI_API_KEY. Configúrala localmente antes de generar imágenes reales con OpenAI Images.",
    );
  }

  const tmpDir = path.join(process.cwd(), "tmp", "imagegen");
  const batchPath = path.join(tmpDir, "hotelling-images.jsonl");

  await mkdir(tmpDir, { recursive: true });
  await mkdir(path.join(process.cwd(), HOTELLING_IMAGE_OUTPUT_DIR), { recursive: true });

  const jobs = selectedImages.map((image) =>
    JSON.stringify({
      prompt: buildPrompt(image),
      model: HOTELLING_IMAGE_MODEL,
      size: image.size,
      quality: image.quality,
      output_format: "png",
      out: `${image.id}.png`,
    }),
  );

  await writeFile(batchPath, `${jobs.join("\n")}\n`, "utf8");

  const args = [
    "generate-batch",
    "--input",
    batchPath,
    "--out-dir",
    HOTELLING_IMAGE_OUTPUT_DIR,
    "--model",
    HOTELLING_IMAGE_MODEL,
    "--output-format",
    "png",
    "--concurrency",
    options.concurrency,
    "--no-augment",
    "--fail-fast",
  ];

  if (options.force) {
    args.push("--force");
  }

  if (options.dryRun) {
    args.push("--dry-run");
  }

  try {
    await runImagegenCli(args);
  } finally {
    await rm(batchPath, { force: true });
  }

  console.log(
    options.dryRun
      ? "Dry-run completado. No se generaron imágenes reales."
      : `Imágenes generadas en ${HOTELLING_IMAGE_OUTPUT_DIR}. Revisa cada PNG antes de cambiar su status a generated.`,
  );
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
