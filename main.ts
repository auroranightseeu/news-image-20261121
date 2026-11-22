// Copies the finished entry image into the submission output directory.
import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const src = resolve(import.meta.dirname, "entry.png");
const dest = join(outDir, "entry.png");

mkdirSync(outDir, { recursive: true });
copyFileSync(src, dest);

console.log(`entry.png (${statSync(dest).size} bytes) -> ${dest}`);
