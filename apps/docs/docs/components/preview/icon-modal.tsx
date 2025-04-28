import * as Dialog from "@radix-ui/react-dialog";
import { Toast } from "../toast";

export function IconModal({
	name,
	component,
}: { name: string; component: React.ReactNode }) {
	const reactUsage = `<${name} />`;
	const id = name
		.replace(/([A-Z])/g, "-$1")
		.toLowerCase()
		.replace("icon", "")
		.replace(/^-*/, "");
	const urlUsage = `https://unpkg.com/@pokemonle/icons-svg@latest/icons/${id}.svg`;
	return (
		<Dialog.Root>
			<Dialog.Trigger>{component}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/50" />
				<Dialog.Content className="w-[90vw] max-w-[450px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 p-6 rounded-lg">
					<Dialog.Title className="text-lg font-semibold">{name}</Dialog.Title>
					<Dialog.Description className="text-sm text-zinc-500 dark:text-zinc-400">
						Use this icon in your project
					</Dialog.Description>

					<div className="flex items-center justify-center">{component}</div>

					<div className="mt-4">
						<h2 className="text-lg font-semibold">ID</h2>
						<Toast
							trigger={
								<pre
									className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg cursor-pointer overflow-x-auto"
									onClick={() => {
										navigator.clipboard.writeText(id);
									}}
									onKeyUp={() => {
										navigator.clipboard.writeText(id);
									}}
								>
									{id}
								</pre>
							}
							description="Copied to clipboard"
						/>
					</div>

					<div className="mt-4">
						<h2 className="text-lg font-semibold">React</h2>
						<Toast
							trigger={
								<pre
									className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg cursor-pointer overflow-x-auto"
									onClick={() => {
										navigator.clipboard.writeText(reactUsage);
									}}
									onKeyUp={() => {
										navigator.clipboard.writeText(reactUsage);
									}}
								>
									{reactUsage}
								</pre>
							}
							description="Copied to clipboard"
						/>
					</div>

					<div className="mt-4">
						<h2 className="text-lg font-semibold">SVG CDN</h2>
						<Toast
							trigger={
								<pre
									className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg cursor-pointer overflow-x-auto"
									onClick={() => {
										navigator.clipboard.writeText(urlUsage);
									}}
									onKeyUp={() => {
										navigator.clipboard.writeText(urlUsage);
									}}
								>
									{urlUsage}
								</pre>
							}
							description="Copied to clipboard"
						/>
					</div>

					<Dialog.Close className="absolute top-5 right-5" asChild>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							className="lucide lucide-x"
						>
							<title>Close</title>
							<path d="M18 6 6 18" />
							<path d="m6 6 12 12" />
						</svg>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
