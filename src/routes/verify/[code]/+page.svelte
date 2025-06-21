<script lang="ts">
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

{#if data.ckey}
	<p>Verification of {data.ckey} successful.</p>
{/if}
