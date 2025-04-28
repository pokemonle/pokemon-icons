import * as _Toast from "@radix-ui/react-toast";
import { useState } from "react";

export function Toast({
	trigger,
	title,
	description,
	duration = 3000,
}: {
	trigger: React.ReactNode;
	title?: React.ReactNode;
	description?: React.ReactNode;
	duration?: number;
}) {
	const [open, setOpen] = useState(false);
	return (
		<_Toast.Provider duration={duration} swipeDirection="right">
			<div onClick={() => setOpen(true)} onKeyDown={() => setOpen(true)}>
				{trigger}
			</div>
			<_Toast.Root
				className="bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 p-4 rounded-lg"
				open={open}
				onOpenChange={setOpen}
			>
				{title && (
					<_Toast.Title className="text-lg font-semibold">{title}</_Toast.Title>
				)}
				{description && (
					<_Toast.Description className="text-sm text-zinc-500 dark:text-zinc-400">
						{description}
					</_Toast.Description>
				)}
			</_Toast.Root>
			<_Toast.Viewport className="fixed bottom-5 right-5" />
		</_Toast.Provider>
	);
}
