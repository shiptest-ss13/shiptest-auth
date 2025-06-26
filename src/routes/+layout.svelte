<script lang="ts">
	import "../app.css";
	import { SignIn, SignOut } from "@auth/sveltekit/components";
	import { page } from "$app/state";

	let { children } = $props();
</script>

<div class="my-4 mx-auto max-w-[800px] w-full bg-white rounded-lg shadow-lg">
	<div
		class="flex flex-row items-center justify-between px-4 py-2 bg-gray-500 rounded-t-lg"
	>
		<h2 class="text-nowrap text-2xl m-1 mr-8">Shiptest 2FA</h2>
		<nav class="w-full">
			<ul class="flex flex-row items-center gap-4">
				<a href="/">Home</a>
				<a href="/verify">Verify</a>
				<a href="https://shiptest.net">Shiptest Homepage</a>
			</ul>
		</nav>
		{#if page.data.session}
			<div>
				<SignOut>
					<div
						slot="submitButton"
						class="hover:underline text-nowrap italic"
					>
						Sign out "{page.data.session.user?.byondkey}"
					</div>
				</SignOut>
			</div>
		{:else}
			<div>
				<SignIn provider="authentik">
					<div
						slot="submitButton"
						class="hover:underline text-nowrap italic"
					>
						Sign in
					</div>
				</SignIn>
			</div>
		{/if}
	</div>

	<main class="p-4">
		{@render children()}
	</main>
</div>

<style>
	a {
		color: inherit;
		background-color: transparent;
		text-decoration: none;
		font-style: italic;
		height: 100%;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
