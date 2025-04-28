import type { SVGAttributes } from "vue";

export type IconNode = [elementName: string, attrs: Record<string, string>][];

export type IconProps = {
	color?: string;
	size?: number | string;
	class?: string;
} & Partial<SVGAttributes>;
