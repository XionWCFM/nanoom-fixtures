import { appendFile, readdir } from "node:fs/promises";

const scenarios = {
  small: { workspaceCount: 12, affectedPercent: 9.375, concurrency: 3 },
  medium: { workspaceCount: 64, affectedPercent: 50, concurrency: 12 },
  full: { workspaceCount: 128, affectedPercent: 100, concurrency: 24 },
};

const scenario = process.argv[2];
const spec = scenarios[scenario];
if (!spec) throw new Error("usage: scale-scenario.mjs <small|medium|full> [--apply]");

const services = (await readdir(new URL("../services/", import.meta.url), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && entry.name.startsWith("next-app-"))
  .map((entry) => entry.name)
  .sort();
if (services.length !== 128) throw new Error(`expected 128 services, found ${services.length}`);

const changedFiles = services
  .slice(0, spec.workspaceCount)
  .map((service) => `services/${service}/app/page.tsx`);

if (process.argv.includes("--apply")) {
  const marker = `\n// nanoom scale scenario: ${scenario}\n`;
  await Promise.all(
    changedFiles.map((file) => appendFile(new URL(`../${file}`, import.meta.url), marker)),
  );
}

console.log(JSON.stringify({ scenario, changedFiles, ...spec, expectedTier: scenario }));
