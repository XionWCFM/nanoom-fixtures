import core from "@pnpm-nx/core";
if (core !== "shared") throw new Error(`unexpected dependency: ${core}`);
console.log("pnpm+nx app: success");
