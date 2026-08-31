import { existsSync } from "node:fs";

const matrix = JSON.parse(process.argv[2]);
const names = [...new Set(matrix.items.map(({ name }) => name))];
const required = ["node_modules/.bin/nx"];
if (names.includes("@pnpm-nx/app")) required.push("packages/app/node_modules/@pnpm-nx/core");
if (names.some((name) => name === "@pnpm-nx/app" || name === "@pnpm-nx/core")) {
  required.push("packages/core/node_modules/@pnpm-nx/shared");
}
const missing = required.filter((path) => !existsSync(path));
if (missing.length) throw new Error(`focused install is missing: ${missing.join(", ")}`);
if (existsSync("packages/unrelated/node_modules"))
  throw new Error("unrelated workspace was installed");
console.log(`pnpm focused install: ${names.join(", ")}`);
