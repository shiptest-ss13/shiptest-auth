<script>
	import { SignIn, SignOut } from "@auth/sveltekit/components";

	import { page } from "$app/state";
</script>

{#if page.data.session}
	<span class="signedInText">
		<p>Signed in as:</p>
		<ul>
			<li>
				CKEY: {page.data.session.user?.ckey}
			</li>
			<li>
				Byond Key: {page.data.session.user?.byondkey}
			</li>
			<li>
				Username: {page.data.session.user?.name}
			</li>
			<li>
				Email: {page.data.session.user?.email}
			</li>
		</ul>
	</span>
	<SignOut>
		<div slot="submitButton" class="buttonPrimary">Sign out</div>
	</SignOut>
{:else}
	<span>You are not signed in</span>
	<SignIn provider="authentik">
		<div slot="submitButton" class="buttonPrimary">Sign in</div>
	</SignIn>
{/if}
