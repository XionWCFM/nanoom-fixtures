import { expect, test } from "vitest";
import { app } from "./index";

test("connects the app to core", () => {
  expect(app).toEqual({ message: "shared-v3 app", ready: true });
});
