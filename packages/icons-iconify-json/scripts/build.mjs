import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
	cleanupSVG,
	importDirectory,
	isEmptyColor,
	parseColors,
	runSVGO,
} from "@iconify/tools";
import { ICONS_DIR } from "../../../scripts/helpers.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const iconSet = await importDirectory(ICONS_DIR, {
	prefix: "open",
});

// Validate, clean up, fix palette and optimize
iconSet.forEach((name, type) => {
	if (type !== "icon") {
		return;
	}

	const svg = iconSet.toSVG(name);
	if (!svg) {
		// Invalid icon
		iconSet.remove(name);
		return;
	}

	// Clean up and optimize icons
	try {
		// Clean up icon code
		cleanupSVG(svg);

		// Assume icon is monotone: replace color with currentColor, add if missing
		// If icon is not monotone, remove this code
		// parseColors(svg, {
		// 	defaultColor: "currentColor",
		// 	callback: (attr, colorStr, color) => {
		// 		return !color || isEmptyColor(color) ? colorStr : "currentColor";
		// 	},
		// });

		// Optimise
		runSVGO(svg);
	} catch (err) {
		// Invalid icon
		console.error(`Error parsing ${name}:`, err);
		iconSet.remove(name);
		return;
	}

	// Update icon
	iconSet.fromSVG(name, svg);
});

// set information
iconSet.info = {
	name: "Pokemonle",
	author: {
		name: "Pokemonle",
		url: "https://github.com/pokemonle",
	},
	license: {
		title: "MIT",
		spdx: "MIT",
		url: "https://github.com/pokemonle/pokemon-icons/blob/main/LICENSE",
	},
	samples: ["bug", "dark", "dragon", "electric"],
	height: 1024,
	category: "Logos",
	palette: false,
};

// Export
console.log("Exporting icon set");
await fs.mkdir(path.resolve(__dirname, "../dist"), { recursive: true });
await Promise.all([
	fs.writeFile(
		path.resolve(__dirname, "../dist/icons.json"),
		JSON.stringify(iconSet.export()),
	),
	fs.writeFile(
		path.resolve(__dirname, "../dist/chars.json"),
		JSON.stringify(iconSet.chars()),
	),
	fs.writeFile(
		path.resolve(__dirname, "../dist/info.json"),
		JSON.stringify(iconSet.info),
	),
]);

// generate entry files
await Promise.all([
	fs.writeFile(
		path.resolve(__dirname, "../dist/index.js"),
		`\
const icons = require("./icons.json");
const info = require("./info.json");
const metadata = {};
const chars = require("./chars.json");

exports.icons = icons;
exports.info = info;
exports.metadata = metadata;
exports.chars = chars;
`,
	),
	fs.writeFile(
		path.resolve(__dirname, "../dist/index.mjs"),
		`\
import icons from "./icons.json" with { type: "json" };
import info from "./info.json" with { type: "json" };
import chars from "./chars.json" with { type: "json" };
const metadata = {};

export { icons, info, metadata, chars };
`,
	),
	fs.writeFile(
		path.resolve(__dirname, "../dist/index.d.ts"),
		`\
import type { IconifyJSON, IconifyInfo, IconifyMetaData, IconifyChars } from '@iconify/types';

export { IconifyJSON, IconifyInfo, IconifyMetaData, IconifyChars };

export declare const icons: IconifyJSON;
export declare const info: IconifyInfo;
export declare const metadata: IconifyMetaData;
export declare const chars: IconifyChars;
`,
	),
]);

// copy readme
import { copyDocs } from "../../../scripts/build-icons.mjs";
copyDocs("icons-iconify-json");

console.log("Done");
