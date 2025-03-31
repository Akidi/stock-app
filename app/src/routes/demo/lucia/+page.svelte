<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageServerData } from './$types';
	import { toastStore } from '$lib/stores/toast.store';
	

	let { data }: { data: PageServerData } = $props();

	const handleSubmit: SubmitFunction = () => {
		return async ({ update, result }) => {
			await update();
			if (result.type === "success" && result.data?.toast) {
				toastStore.add(result.data.toast);
			}
		}
	}
</script>

<h1>Hi, {data.user.username}!</h1>
<p>Your user ID is {data.user.id}.</p>
<form method="post" action="?/logout" use:enhance={handleSubmit}>
	<button>Sign out</button>
</form>
