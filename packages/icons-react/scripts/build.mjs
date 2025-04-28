#!/usr/bin/env node

import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { transform as transformReact } from "@svgr/core";
import { copyDocs } from "../../../scripts/build-icons.mjs";
import { readSvgs } from "../../../scripts/helpers.mjs";

const componentTemplate = ({ name, namePascal, children, attributes }) => `\
import createReactComponent from '../createReactComponent';
export default createReactComponent('${name}', '${namePascal}', ${JSON.stringify(
	attributes,
)}, ${JSON.stringify(children)});`;

const indexItemTemplate = ({ name, namePascal }) => `\
export { default as ${namePascal} } from './icons/${namePascal}';`;

// 1. Build icons
process.stdout.write("Building...");
const DIST_DIR = resolve(".");
// clear all files in dist
await Promise.all(
	(await fs.readdir(resolve(DIST_DIR, "src/icons")))
		.filter((f) => f !== ".gitkeep")
		.map((file) => fs.unlink(resolve(DIST_DIR, "src/icons", file))),
);

const svgFiles = readSvgs();
const index = [];
let ps = [];
// svgr
for (const svgFile of svgFiles) {
	ps.push({
		name: svgFile.namePascal,
		code: await transformReact(svgFile.contents, {
			typescript: true,
			icon: true,
			plugins: [
				// '@svgr/plugin-svgo',
				"@svgr/plugin-jsx",
			],
		}),
	});
}
const svgrResults = await Promise.all(ps);

ps = [];

for (const { name, code } of svgrResults) {
	const filePath = resolve(DIST_DIR, "src/icons", `${name}.tsx`);
	ps.push(fs.writeFile(filePath, code, "utf-8"));
	index.push(
		indexItemTemplate({
			name,
			namePascal: name,
		}),
	);
}

await Promise.all(ps);

ps = [];

await fs.writeFile(
	resolve(DIST_DIR, "./src/icons.ts"),
	index.join("\n"),
	"utf-8",
);

process.stdout.write(" DONE!\n");

// 2. Format
// process.stdout.write('Formatting...')
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// execSync(`npx biome format ${resolve(root, 'src')} --write`, { cwd: root })
// process.stdout.write(' DONE!\n')

// 3. Compile
process.stdout.write("Compiling...");
execSync("npx tsup", { cwd: root });
process.stdout.write(" DONE!\n");

// 4. Copy README.md to docs/pages/integrations/{name}.mdx
process.stdout.write("Copying README.md to docs/pages/integrations/...");
await copyDocs("icons-react");
process.stdout.write(" DONE!\n");
