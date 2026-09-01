import { readFile, writeFile } from "node:fs/promises";

const [version] = process.argv.slice(2);
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version ?? "")) {
  throw new Error("A valid semantic version is required");
}

const configPath = new URL("../../litellm/config.yaml", import.meta.url);
const config = await readFile(configPath, "utf8");
const currentVersion = config.match(/^version:\s*["']?([^"'\s]+)["']?\s*$/m)?.[1];
if (!currentVersion) {
  throw new Error("Unable to find the add-on version");
}
if (currentVersion === version) {
  console.log(`Add-on version is already ${version}`);
  process.exit(0);
}

const updated = config.replace(/^version:\s*.*$/m, `version: "${version}"`);
await writeFile(configPath, updated, "utf8");
