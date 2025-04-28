import fs from "node:fs";
import path, { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import svgson from "svgson";

const getCurrentDirPath = () => {
	return path.dirname(fileURLToPath(import.meta.url));
};

export const HOME_DIR = resolve(getCurrentDirPath(), "..");

export const ICONS_SRC_DIR = resolve(HOME_DIR, "src/_icons");
export const ICONS_DIR = resolve(HOME_DIR, "icons");
export const PACKAGES_DIR = resolve(HOME_DIR, "packages");

/**
 * Reads SVGs from directory
 *
 * @param directory
 * @returns {string[]}
 */
export const readSvgDirectory = (directory) => {
	return fs
		.readdirSync(directory)
		.filter((file) => path.extname(file) === ".svg");
};

export const readSvgs = () => {
	const svgFiles = readSvgDirectory(ICONS_DIR);

	return svgFiles.map((svgFile) => {
		const name = basename(svgFile, ".svg");
		const namePascal = toPascalCase(`icon ${name}`);
		const contents = readSvg(svgFile, ICONS_DIR).trim();
		const path = resolve(ICONS_DIR, svgFile);
		const obj = svgson.parseSync(contents);

		return {
			name,
			namePascal,
			contents,
			obj,
			path,
		};
	});
};

/**
 * Read SVG
 *
 * @param fileName
 * @param directory
 * @returns {string}
 */
export const readSvg = (fileName, directory) => {
	return fs.readFileSync(path.join(directory, fileName), "utf-8");
};

/**
 * @param {string} string
 * @returns {string}
 */
const toCamelCase = (string) => {
	return string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) =>
		p2 ? p2.toUpperCase() : p1.toLowerCase(),
	);
};

/**
 * @param {string} string
 * @returns {string}
 */
const toPascalCase = (string) => {
	const camelCase = toCamelCase(string);

	return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
