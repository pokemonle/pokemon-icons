import fs from "node:fs/promises";
import path from "node:path";
import { optimize } from "svgo";
import { ICONS_DIR, readSvgDirectory } from "./helpers.mjs";

const svgoAddTitle = {
	name: "addTitle",
	type: "visitor",
	active: true,
	fn: (ast, params, { path: svgPath } = {}) => {
		return {
			element: {
				enter: (node, parentNode) => {
					const isRoot = node.name === "svg" && parentNode.type === "root";
					if (isRoot && svgPath) {
						const hasTitle = node.children.some(
							(child) => child.type === "element" && child.name === "title",
						);
						if (!hasTitle) {
							const filename = path.parse(svgPath).name;
							const title = {
								type: "element",
								name: "title",
								attributes: {},
								children: [],
							};
							Object.defineProperty(title, "parentNode", {
								writable: true,
								value: node,
							});
							const text = {
								type: "text",
								value: filename,
								attributes: {},
								children: [],
							};
							Object.defineProperty(text, "parentNode", {
								writable: true,
								value: title,
							});
							title.children.push(text);
							node.children.unshift(title);
						}
					}
				},
			},
		};
	},
};

const svgFiles = readSvgDirectory(ICONS_DIR);

const ps = [];

for (const svgFile of svgFiles) {
	const data = await fs.readFile(path.join(ICONS_DIR, svgFile), "utf-8");
	const result = optimize(data, {
		path: path.join(ICONS_DIR, svgFile),
		// js2svg: { indent: 2, pretty: true },
		multipass: true,
		plugins: [
			{
				name: "preset-default",
				params: {
					overrides: {
						mergePaths: false,
						removeViewBox: false,
					},
				},
			},
			{
				name: "prefixIds",
				params: {
					// https://svgo.dev/docs/plugins/prefix-ids/
				},
			},
			// { name: 'removeXlink' },
			{
				name: "removeDimensions",
			},
			{
				name: "cleanupAttrs",
			},
			svgoAddTitle,
		],
	});

	ps.push(fs.writeFile(path.join(ICONS_DIR, svgFile), result.data, "utf-8"));
}

await Promise.all(ps);
