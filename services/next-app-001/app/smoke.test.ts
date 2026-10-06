import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import Page from "./page";

test("renders the workspace identity", () => {
  expect(renderToStaticMarkup(createElement(Page))).toBe("<main>next-app-001</main>");
});
