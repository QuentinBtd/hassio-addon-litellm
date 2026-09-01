const [version] = process.argv.slice(2);
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version ?? "")) {
  throw new Error("A valid semantic version is required");
}

const repository = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
if (!repository || !token) {
  throw new Error("GITHUB_REPOSITORY and GITHUB_TOKEN are required");
}

const headers = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  "X-GitHub-Api-Version": "2022-11-28"
};
const releaseResponse = await fetch(
  `https://api.github.com/repos/${repository}/releases?per_page=100`,
  { headers }
);
if (!releaseResponse.ok) {
  throw new Error(`Unable to list GitHub releases: ${releaseResponse.status}`);
}

const releases = await releaseResponse.json();
const release = releases.find(({ tag_name: tagName }) => tagName === `v${version}`);
if (!release) {
  throw new Error(`Unable to find GitHub release v${version}`);
}
if (!release.draft) {
  console.log(`GitHub release v${version} is already published`);
  process.exit(0);
}

const publishResponse = await fetch(
  `https://api.github.com/repos/${repository}/releases/${release.id}`,
  {
    method: "PATCH",
    headers,
    body: JSON.stringify({ draft: false })
  }
);
if (!publishResponse.ok) {
  throw new Error(`Unable to publish GitHub release: ${publishResponse.status}`);
}

console.log(`Published GitHub release v${version}`);
