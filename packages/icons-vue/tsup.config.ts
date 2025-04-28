import { defineConfig } from "tsup";

export default defineConfig((options) => ({
	entry: ["./src/**/*"],
	bundle: false,
	outDir: "dist",
	clean: true,
	sourcemap: true,
	treeshake: true,
	format: ["cjs", "esm"],
	platform: "node",
	dts: true,
	target: "node18",
	external: ["vue"],
}));
