import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import OpenAI from "openai";
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
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    ids: new Set<string>(),
    statuses: new Set<string>(),
    includeAll: false,
    force: false,
    dryRun: false,
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

async function exists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const rootDir = process.cwd();
  const outputDir = path.join(rootDir, HOTELLING_IMAGE_OUTPUT_DIR);
  await fs.mkdir(outputDir, { recursive: true });

  const selectedImages = imageManifest.filter((image) => {
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

  if (!selectedImages.length) {
    throw new Error("No hay imágenes seleccionadas con los filtros actuales.");
  }

  if (!options.dryRun && !process.env.OPENAI_API_KEY) {
    throw new Error("Falta OPENAI_API_KEY. Exporta tu clave antes de correr el script.");
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG,
    project: process.env.OPENAI_PROJECT,
  });

  for (const image of selectedImages) {
    const outputPath = path.join(outputDir, `${image.id}.png`);
    const fileAlreadyExists = await exists(outputPath);

    if (fileAlreadyExists && !options.force) {
      console.log(`[skip] ${image.id} ya existe. Usa --force para regenerarla.`);
      continue;
    }

    if (options.dryRun) {
      console.log(
        `[dry-run] ${image.id} | status=${image.status} | size=${image.size} | quality=${image.quality}`,
      );
      continue;
    }

    const result = await client.images.generate({
      model: HOTELLING_IMAGE_MODEL,
      prompt: `${whiteboardVisualDirection}\n\n${image.prompt}`,
      size: image.size,
      quality: image.quality,
    });

    const base64Image = result.data[0]?.b64_json;
    if (!base64Image) {
      throw new Error(`La API no devolvió una imagen para ${image.id}.`);
    }

    await fs.writeFile(outputPath, Buffer.from(base64Image, "base64"));
    console.log(`[ok] ${image.id} -> ${outputPath}`);
  }
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
