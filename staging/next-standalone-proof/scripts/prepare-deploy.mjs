import { cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { rawRemoveIfExists } from "./raw-remove.mjs";

const scriptPath = fileURLToPath(import.meta.url);
const projectDirectory = path.resolve(path.dirname(scriptPath), "..");
const standaloneRoot = path.join(projectDirectory, ".next", "standalone");
const standaloneApp = path.join(
  standaloneRoot,
  "staging",
  "next-standalone-proof",
);

export function prepareDeploy(outputPath) {
  const outputDirectory = path.resolve(
    outputPath || path.join(projectDirectory, "deploy"),
  );

  for (const requiredPath of [
    path.join(standaloneApp, "server.js"),
    path.join(standaloneRoot, "node_modules"),
    path.join(projectDirectory, ".next", "static"),
    path.join(projectDirectory, "public"),
  ]) {
    if (!existsSync(requiredPath)) {
      throw new Error(`Missing build artifact: ${requiredPath}`);
    }
  }

  rawRemoveIfExists(outputDirectory);
  mkdirSync(outputDirectory, { recursive: true });

  cpSync(standaloneApp, outputDirectory, { recursive: true });
  cpSync(path.join(projectDirectory, "package.json"), path.join(outputDirectory, "package.json"));
  cpSync(path.join(projectDirectory, "package-lock.json"), path.join(outputDirectory, "package-lock.json"));
  cpSync(path.join(standaloneRoot, "node_modules"), path.join(outputDirectory, "node_modules"), {
    recursive: true,
  });
  cpSync(path.join(projectDirectory, ".next", "static"), path.join(outputDirectory, ".next", "static"), {
    recursive: true,
  });
  cpSync(path.join(projectDirectory, "public"), path.join(outputDirectory, "public"), {
    recursive: true,
  });
  cpSync(path.join(projectDirectory, "data"), path.join(outputDirectory, "data"), {
    recursive: true,
  });
  cpSync(path.join(projectDirectory, "db"), path.join(outputDirectory, "db"), {
    recursive: true,
  });
  cpSync(path.join(projectDirectory, "lib"), path.join(outputDirectory, "lib"), {
    recursive: true,
  });
  cpSync(path.join(projectDirectory, "scripts"), path.join(outputDirectory, "scripts"), {
    recursive: true,
  });
  cpSync(path.join(projectDirectory, "tests"), path.join(outputDirectory, "tests"), {
    recursive: true,
  });

  console.log(`[prepare-deploy] ready: ${outputDirectory}`);
  return outputDirectory;
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  prepareDeploy(process.argv[2]);
}

