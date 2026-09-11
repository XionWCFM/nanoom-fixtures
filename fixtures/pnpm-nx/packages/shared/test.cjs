if (require("./index.cjs") !== "shared") throw new Error("shared export failed");
console.log("pnpm+nx shared: success");
