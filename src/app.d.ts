// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: import("mariadb").Connection;
			drizzle: import("./lib/server/db").Db;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
