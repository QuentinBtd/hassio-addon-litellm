import { spawnSync } from "node:child_process";

const [version] = process.argv.slice(2);
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version ?? "")) {
  throw new Error("A valid semantic version is required");
}

const repository = process.env.GITHUB_REPOSITORY;
if (!repository) {
  throw new Error("GITHUB_REPOSITORY is required");
}

const image = `ghcr.io/${repository.toLowerCase()}:${version}`;
const result = spawnSync(
  "docker",
  [
    "buildx",
    "build",
    "--platform",
    "linux/amd64,linux/arm64",
    "--build-arg",
    `BUILD_VERSION=${version}`,
    "--tag",
    image,
    "--provenance=mode=max",
    "--sbom=true",
    "--push",
    "litellm"
  ],
  { stdio: "inherit" }
);

if (result.error) {
  throw result.error;
}
if (result.status !== 0) {
  throw new Error(`Image build failed with exit code ${result.status}`);
}

console.log(`Published ${image}`);
