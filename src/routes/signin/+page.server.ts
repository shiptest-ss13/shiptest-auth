/*import { generateCodeVerifier, generateState } from "arctic";
import { auth } from "$lib/server/auth";
import type { RequestEvent } from "./$types";

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const verifier = generateCodeVerifier();
	const url = auth.createAuthorizationURL(state, verifier, [
		"openid",
		"profile",
	]);

	event.cookies.set("oauth_state", state, {
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax",
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString(),
		},
	});
}
*/

import { signIn } from "../../auth.server";
import type { Actions } from "./$types";

export const actions = { default: signIn } satisfies Actions;
