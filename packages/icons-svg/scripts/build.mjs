#!/usr/bin/env node

import fs from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { copyDocs } from "../../../scripts/build-icons.mjs";

// copy icons

const DIST_DIR = resolve(".", "icons");
const SRC_DIR = resolve(
	dirname(fileURLToPath(import.meta.url)),
	"../../../icons",
);

await fs.rm(DIST_DIR, { recursive: true, force: true });
await fs.mkdir(DIST_DIR);

const files = await fs.readdir(SRC_DIR);

await Promise.all(
	files.map((file) =>
		fs.copyFile(resolve(SRC_DIR, file), resolve(DIST_DIR, file)),
	),
);

// Copy README.md to docs/pages/integrations/{name}.mdx
await copyDocs("icons-svg");

console.log("Done!");
