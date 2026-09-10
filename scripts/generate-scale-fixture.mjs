import { mkdir, writeFile } from "node:fs/promises";

const count = Number(process.argv[2] ?? 128);
if (!Number.isInteger(count) || count < 100) throw new Error("workspace count must be at least 100");

for (let index = 0; index < count; index += 1) {
  const id = String(index).padStart(3, "0");
  const root = new URL(`../services/next-app-${id}/`, import.meta.url);
  await mkdir(new URL("app/", root), { recursive: true });
  await writeFile(
    new URL("package.json", root),
    `${JSON.stringify(
      {
        name: `@nanoom-scale/next-app-${id}`,
        version: "1.0.0",
        private: true,
        scripts: { build: "next build" },
        dependencies: {
          next: "16.3.4",
          react: "19.2.0",
          "react-dom": "19.2.0",
        },
      },
      null,
      2,
    )}\n`,
  );
  await writeFile(
    new URL("app/layout.tsx", root),
    `export default function Layout({ children }: { children: React.ReactNode }) { return <html><body>{children}</body></html>; }\n`,
  );
  await writeFile(
    new URL("app/page.tsx", root),
    `export default function Page() { return <main>next-app-${id}</main>; }\n`,
  );
  await writeFile(new URL("next.config.ts", root), "import type { NextConfig } from 'next';\nexport default {} satisfies NextConfig;\n");
  await writeFile(
    new URL("tsconfig.json", root),
    `${JSON.stringify({ compilerOptions: { jsx: "preserve", strict: true, noEmit: true }, include: ["**/*.ts", "**/*.tsx", ".next/types/**/*.ts"] }, null, 2)}\n`,
  );
}

console.log(`generated ${count} Next.js workspaces`);
