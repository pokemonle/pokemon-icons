export function Card({
	title,
	href,
	icon,
}: {
	title: string;
	href: string;
	icon?: string;
}) {
	return (
		<a
			href={href}
			className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg shadow-lg p-4 flex items-center justify-between"
		>
			<div>
				<h3 className="text-lg font-semibold">{title}</h3>
			</div>
			{icon}
		</a>
	);
}
