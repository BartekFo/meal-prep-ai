import { Heading3 } from "@/components/typography";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Sandwich } from "lucide-react";

export function AppLogo() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<div className="flex items-center gap-2 p-2 py-4">
					<Sandwich className="h-6 w-6" />
					<Heading3>Meal Preaping AI</Heading3>
				</div>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
