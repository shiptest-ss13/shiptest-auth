<script lang="ts">
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

{#if data.session}
	<p class="text-center text-2xl">
		Verified as {data.session.user?.byondkey}.
	</p>
{:else}
	<p class="text-center text-2xl">You are not logged in.</p>
{/if}
