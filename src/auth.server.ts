import { CLIENT_ID, CLIENT_SECRET, ISSUER } from "$env/static/private";
import { SvelteKitAuth, type SvelteKitAuthConfig } from "@auth/sveltekit";
import Authentik from "@auth/sveltekit/providers/authentik";

declare module "@auth/sveltekit" {
	interface User {
		ckey?: string;
		byondkey?: string;
	}
}

declare module "@auth/core/jwt" {
	interface JWT {
		ckey?: string;
		byondkey?: string;
	}
}

const provider = Authentik({
	clientId: CLIENT_ID,
	clientSecret: CLIENT_SECRET,
	issuer: ISSUER,
	authorization: {
		params: {
			scope: "openid profile email",
		},
	},
	profile(profile) {
		return {
			id: profile.sub,
			name: profile.name ?? profile.preferred_username,
			ckey: profile.ckey,
			byondkey: profile.byondkey,
			email: profile.email,
			image: profile.picture,
		};
	},
});

const authOptions = {
	providers: [provider],
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.ckey = user.ckey;
				token.byondkey = user.byondkey;
			}
			return token;
		},
		session({ session, token }) {
			if (token.ckey) {
				session.user.ckey = token.ckey;
			}
			if (token.byondkey) {
				session.user.byondkey = token.byondkey;
			}
			return session;
		},
	},
} satisfies SvelteKitAuthConfig;

export const { handle, signIn, signOut } = SvelteKitAuth(authOptions);
