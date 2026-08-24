import { expect, test } from "vitest";
import { shared } from "./index";

test("exposes the shared fixture name", () => {
  expect(shared.name).toBe("shared-v4");
});
