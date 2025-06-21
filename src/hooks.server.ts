import {
	redirect,
	type Handle,
	type RequestEvent,
	type ResolveOptions,
} from "@sveltejs/kit";
import { handle as authenticationHandle } from "./auth.server";
import { sequence } from "@sveltejs/kit/hooks";
import MariaDB from "mariadb";

import { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } from "$env/static/private";

// Initialize the MariaDB connection pool
const pool = MariaDB.createPool({
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
});

async function databaseHandle({
	event,
	resolve,
}: {
	event: RequestEvent;
	resolve: (
		event: RequestEvent,
		opts?: ResolveOptions
	) => Response | Promise<Response>;
}) {
	const connection = await pool.getConnection();

	try {
		// Attach the connection to the event locals for use in routes
		event.locals.db = connection;

		// Proceed with the request
		return resolve(event);
	} catch (error) {
		console.error("Database connection error:", error);
		throw new Error("Database connection failed");
	} finally {
		if (connection) {
			connection.release(); // Release the connection back to the pool
		}
	}
	return resolve(event);
}

async function authorizationHandle({
	event,
	resolve,
}: {
	event: RequestEvent;
	resolve: (
		event: RequestEvent,
		opts?: ResolveOptions
	) => Response | Promise<Response>;
}) {
	// Protect any routes under /authenticated
	if (event.url.pathname.startsWith("/authenticated")) {
		const session = await event.locals.auth();
		if (!session) {
			// Redirect to the signin page
			throw redirect(303, "/auth/signin");
		}
	}

	// If the request is still here, just proceed as normally
	return resolve(event);
}

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle: Handle = sequence(
	authenticationHandle,
	authorizationHandle,
	databaseHandle
);
