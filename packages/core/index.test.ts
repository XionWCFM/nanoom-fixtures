import { expect, test } from "vitest";
import { core } from "./index";

test("reports a ready core fixture", () => {
  expect(core).toEqual({ name: "shared-v5", ready: true });
});
