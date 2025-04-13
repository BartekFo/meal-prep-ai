import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { Skeleton } from "../skeleton";
import { NavUserUi } from "./nav-user-ui";

export async function NavUser() {
	const supabase = await createClient();
	const { data: user } = await supabase.auth.getUser();

	return (
		<Suspense fallback={<Skeleton className="h-10 w-10 rounded-full" />}>
			<NavUserUi
				user={{
					avatar: user.user?.user_metadata.avatar_url,
					email: user.user?.email ?? "",
					name: user.user?.user_metadata.name ?? "",
				}}
			/>
		</Suspense>
	);
}
