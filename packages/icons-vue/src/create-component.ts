import { type FunctionalComponent, h } from "vue";
import type { IconNode, IconProps } from "./types";

const createComponent =
	(iconNode: IconNode): FunctionalComponent<IconProps> =>
	(
		{ color = "currentColor", size = 24, class: classes, ...rest }: IconProps,
		{ attrs, slots },
	) => {
		const children = [
			...iconNode.map((child) => h(...child)),
			...(slots.default ? [slots.default()] : []),
		];
		return h(
			"svg",
			{
				width: size,
				height: size,
				...attrs,
				...rest,
			},
			children,
		);
	};

export default createComponent;
