<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth/auth-client';
	const session = authClient.useSession();

	if ($session.data) {
		goto('/dashboard');
	} else {
		goto('/login');
	}
</script>
