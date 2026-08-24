import { existsSync } from "node:fs";

const selected = process.argv[2];
const closures = {
  "@nanoom-fixture/app": ["app", "core", "shared", "typescript-configs"],
  "@nanoom-fixture/core": ["core", "shared", "typescript-configs"],
  "@nanoom-fixture/shared": ["shared", "typescript-configs"],
};

if (!closures[selected]) throw new Error(`unknown fixture workspace: ${selected}`);

const required = [
  "node_modules/.bin/turbo",
  "node_modules/.bin/vitest",
  ...closures[selected].map((name) => `node_modules/@nanoom-fixture/${name}/package.json`),
];
const missing = required.filter((path) => !existsSync(path));
const unrelated = "node_modules/@nanoom-fixture/unrelated/package.json";

if (missing.length) throw new Error(`focused install is missing: ${missing.join(", ")}`);
if (existsSync(unrelated))
  throw new Error(`focused install leaked unrelated workspace: ${unrelated}`);

console.log(`focused install: ${selected}`);
console.log("  why: root dev tools + selected workspace + transitive closure");
console.log(`  required: ${required.join(", ")}`);
console.log(`  unrelated absent: ${unrelated}`);
console.log("  result: success");
