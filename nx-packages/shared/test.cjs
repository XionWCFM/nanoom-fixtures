if (require("./index.cjs") !== "shared") throw new Error("shared export failed");
if (process.env.NANOOM_A7_FAIL === "1") throw new Error("intentional A7 rerun failure");
console.log("pnpm+nx shared: success");
