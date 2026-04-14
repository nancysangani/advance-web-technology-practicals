import { cpSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const distPath = resolve("dist");
const srcPath = resolve("src");

rmSync(distPath, { recursive: true, force: true });
mkdirSync(distPath, { recursive: true });
cpSync(srcPath, distPath, { recursive: true });

console.log("Backend build complete: src copied to dist");
