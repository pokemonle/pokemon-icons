import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stringify } from "svgson";
import { PACKAGES_DIR, readSvgs } from "./helpers.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const ROOT_DIR = path.resolve(__dirname, "..");

/**
 * Build icons
 *
 * @param {Object} params
 * @param {string} params.name - Package name
 * @param {Function} params.componentTemplate - Template for the icon component
 * @param {Function} params.indexItemTemplate - Template for the index item
 * @param {boolean} params.key - Whether to add a key attribute to the icon component
 * @param {boolean} params.pascalCase - Whether to convert the icon name to PascalCase
 * @param {("ts" | "svelte")} params.extension - File extension for generated icon components
 * @returns {Promise<void>}
 */
export const buildIcons = async ({
	name,
	componentTemplate,
	indexItemTemplate,
	key = true,
	pascalCase = false,
	extension = "ts",
}) => {
	const DIST_DIR = path.resolve(PACKAGES_DIR, name);
	// clear all files in dist
	await Promise.all(
		(await fs.readdir(path.resolve(DIST_DIR, "src/icons")))
			.filter((f) => f !== ".gitkeep")
			.map((file) => fs.unlink(path.resolve(DIST_DIR, "src/icons", file))),
	);

	const svgFiles = readSvgs();

	const index = [];

	const ps = [];

	for (const svgFile of svgFiles) {
		const children = svgFile.obj.children
			.map(({ name, attributes }) => {
				if (key) {
					attributes.key = `svg-${name}`;
				}

				if (pascalCase) {
					for (const [key, value] of Object.entries(attributes)) {
						if (key.includes("-")) {
							delete attributes[key];
							attributes[key.replace(/-([a-z])/g, (g) => g[1].toUpperCase())] =
								value;
						}
					}
				}

				return [name, attributes];
			})
			.filter(([_, attributes]) => {
				return !attributes.d || attributes.d !== "M0 0h24v24H0z";
			});

		// process.stdout.write(`Building ${i}/${svgFiles.length}: ${svgFile.name.padEnd(42)}\r`)

		const component = componentTemplate({
			name: svgFile.name,
			namePascal: svgFile.namePascal,
			children,
			stringify,
			svg: svgFile,
			attributes: svgFile.obj.attributes,
		});

		const filePath = path.resolve(
			DIST_DIR,
			"src/icons",
			`${svgFile.namePascal}.${extension}`,
		);

		ps.push(fs.writeFile(filePath, component, "utf-8"));

		index.push(
			indexItemTemplate({
				name: svgFile.name,
				namePascal: svgFile.namePascal,
			}),
		);
	}

	await Promise.all(ps);

	await fs.writeFile(
		path.resolve(DIST_DIR, "./src/icons.ts"),
		index.join("\n"),
		"utf-8",
	);
};

/**
 * copy README.md to docs/pages/integrations/{name}.mdx
 */
export const copyDocs = async (name) => {
	const DIST_DIR = path.resolve(PACKAGES_DIR, name);
	const DOCS_DIR = path.resolve(ROOT_DIR, "apps/docs/docs/pages/integrations");
	const pureName = name.replace("icons-", "");
	await fs.copyFile(
		path.resolve(DIST_DIR, "README.md"),
		path.resolve(DOCS_DIR, `${pureName}.mdx`),
	);
	// prepend warning to the top of the file
	const warning =
		"{/* WARNING: This is an auto-generated file from the build script. Do not edit directly. */}\n\n";
	await fs.writeFile(
		path.resolve(DOCS_DIR, `${pureName}.mdx`),
		warning +
			(await fs.readFile(path.resolve(DOCS_DIR, `${pureName}.mdx`), "utf-8")),
		"utf-8",
	);
};
