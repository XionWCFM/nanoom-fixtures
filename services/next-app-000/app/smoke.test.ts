import { readFileSync } from "node:fs";
import { expect, test } from "vitest";

const workspaceName = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
).name;

test("workspace identity", () => expect(workspaceName).toBe("@nanoom-scale/next-app-000"));
