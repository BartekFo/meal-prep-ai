export function Heading1({
	children,
	...props
}: { children: React.ReactNode } & React.ComponentProps<"h1">) {
	return (
		<h1 className="scroll-m-20 font-extrabold text-4xl tracking-tight lg:text-5xl">
			{children}
		</h1>
	);
}

export function Heading2({
	children,
	...props
}: { children: React.ReactNode } & React.ComponentProps<"h2">) {
	return (
		<h2 className="scroll-m-20 border-b pb-2 font-semibold text-3xl tracking-tight first:mt-0">
			{children}
		</h2>
	);
}

export function Heading3({
	children,
	...props
}: { children: React.ReactNode } & React.ComponentProps<"h3">) {
	return (
		<h3
			className="scroll-m-20 font-semibold text-2xl tracking-tight"
			{...props}
		>
			{children}
		</h3>
	);
}

export function Heading4({
	children,
	...props
}: { children: React.ReactNode } & React.ComponentProps<"h4">) {
	return (
		<h4 className="scroll-m-20 font-semibold text-xl tracking-tight" {...props}>
			{children}
		</h4>
	);
}

export function Text({
	children,
	...props
}: { children: React.ReactNode } & React.ComponentProps<"p">) {
	return (
		<p className="leading-7 [&:not(:first-child)]:mt-6" {...props}>
			{children}
		</p>
	);
}
