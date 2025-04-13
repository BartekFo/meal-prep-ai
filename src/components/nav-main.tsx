"use client";

import { BookOpen, Home } from "lucide-react";

import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { routes } from "@/lib/constants/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain() {
	const pathname = usePathname();
	return (
		<SidebarGroup>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton asChild isActive={pathname === routes.dashboard}>
						<Link href={routes.dashboard}>
							<Home />
							<span>Dashboard</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem>
					<SidebarMenuButton asChild isActive={pathname === routes.recipes}>
						<Link href={routes.recipes}>
							<BookOpen />
							<span>Recipes</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}
