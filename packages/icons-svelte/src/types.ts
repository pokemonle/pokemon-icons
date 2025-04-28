import type { SVGAttributes } from "svelte/elements";

export type IconNode = [elementName: string, attrs: Record<string, string>][];

export type IconProps = {
	color?: string;
	size?: number | string;
	iconNode: IconNode;
} & Partial<SVGAttributes<SVGElement>>;
