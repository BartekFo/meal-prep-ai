import { Heading3 } from "@/components/typography";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Sandwich } from "lucide-react";
import Link from "next/link";

export function AppLogo() {
	return (
		<SidebarMenu>
			<SidebarMenuItem className="py-4">
				<SidebarMenuButton asChild className="flex items-center gap-2">
					<Link href="/dashboard">
						<Sandwich className="h-6 w-6" />
						<span>
							<Heading3>Meal Preaping AI</Heading3>
						</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
