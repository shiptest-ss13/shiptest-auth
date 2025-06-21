import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
	locals,
	params,
	getClientAddress,
}) => {
	const auth = await locals.auth();

	if (!auth) {
		throw redirect(303, "/signin");
	}

	const connection = locals.db;

	if (!connection) {
		throw error(500, "Database connection not established");
	}

	const code = params.code;
	if (!code) {
		throw error(400, "Verification code is required");
	}

	const query = await connection.query(
		"SELECT * FROM admin_connections WHERE id = ? AND ip = INET_ATON(?) LIMIT 1",
		[code, getClientAddress()]
	);

	if (!query) {
		if (
			(
				await connection.query(
					"SELECT * FROM admin_connections WHERE id = ? LIMIT 1",
					[code]
				)
			).length > 0
		) {
			throw error(
				403,
				`Browser address does not match the connection's source address (${getClientAddress()})`
			);
		}

		throw error(404, "Verification code not found");
	}

	const result = query[0] as {
		id: number;
		ckey: string;
		ip: number;
		verification_time: Date | null;
	};

	if (result.ckey !== auth.user?.ckey && !result.ckey.startsWith("guest")) {
		throw error(403, "You do not have permission to verify this code");
	}

	if (result.verification_time) {
		throw error(400, "You have already verified!");
	}

	const verification = await connection.query(
		"UPDATE admin_connections SET verification_time = NOW() WHERE id = ?",
		[code]
	);
	if (verification.affectedRows === 0) {
		throw error(404, "Verification could not be completed");
	}

	return {
		ckey: query[0].ckey,
	};
};
