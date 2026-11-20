/**
 * Back-compat wrapper — homepage desktop export.
 * Prefer: npm run export:all
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const script = resolve(fileURLToPath(new URL(".", import.meta.url)), "export-pages.mjs");
const child = spawn(process.execPath, [script, "homepage"], { stdio: "inherit" });
child.on("exit", (code) => process.exit(code || 0));
