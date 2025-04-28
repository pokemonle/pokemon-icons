#!/usr/bin/env node

import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildIcons, copyDocs } from "../../../scripts/build-icons.mjs";

const componentTemplate = ({ type, name, children, stringify }) => {
	return `\
<script lang="ts">
import Icon from '../Icon.svelte';
import type { IconNode, IconProps } from '../types';

const { children, ...props }: IconProps = $props();
const iconNode: IconNode = ${JSON.stringify(children)};
</script>
<Icon {...props} iconNode={iconNode} />
`;
};

const indexItemTemplate = ({ name, namePascal }) => `\
export { default as ${namePascal} } from './icons/${namePascal}.svelte';`;

// 1. Build icons
process.stdout.write("Building...");
await buildIcons({
	name: "icons-svelte",
	componentTemplate,
	indexItemTemplate,
	extension: "svelte",
});
process.stdout.write(" DONE!\n");

// 2. Format
// process.stdout.write("Formatting...");
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// execSync(`npx biome format ${resolve(root, "src")} --write`, { cwd: root });
// process.stdout.write(" DONE!\n");

// 3. Compile
process.stdout.write("Compiling...");
execSync("npx svelte-package --input ./src --output ./dist", { cwd: root });
process.stdout.write(" DONE!\n");

// 4. Copy README.md to docs/pages/integrations/{name}.mdx
process.stdout.write("Copying README.md to docs/pages/integrations/...");
await copyDocs("icons-svelte");
process.stdout.write(" DONE!\n");
