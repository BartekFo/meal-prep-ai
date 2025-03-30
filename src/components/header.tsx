"use client";

import { usePathname } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

function generateBreadcrumbs(pathname: string) {
	const segments = pathname.split("/").filter(Boolean); // Filtruje puste segmenty
	return segments.map((segment, index) => {
		const href = `/${segments.slice(0, index + 1).join("/")}`;
		const label = segment
			.replace(/-/g, " ")
			.replace(/\b\w/g, (char) => char.toUpperCase()); // Formatowanie
		return { label, href };
	});
}

export function Header() {
	const pathname = usePathname();
	const breadcrumbs = generateBreadcrumbs(pathname);

	return (
		<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbs.map((breadcrumb) => (
							<BreadcrumbItem key={breadcrumb.href}>
								<BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
							</BreadcrumbItem>
						))}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	);
}
