import { defineConfig } from "vocs";

export default defineConfig({
	title: "Pokemonle Icons",
	sidebar: [
		{
			text: "Getting Started",
			link: "/getting-started",
		},
		{
			text: "integrations",
			items: [
				{
					text: "SVG",
					link: "/integrations/svg",
				},
				{
					text: "React",
					link: "/integrations/react",
				},
				{
					text: "Vue",
					link: "/integrations/vue",
				},
				{
					text: "Svelte",
					link: "/integrations/svelte",
				},
				{
					text: "Iconify JSON",
					link: "/integrations/iconify-json",
				},
			],
		},
	],
});
