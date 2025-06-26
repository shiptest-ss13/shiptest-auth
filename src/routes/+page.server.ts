import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	const query = await event.locals.drizzle.query.player.findMany({
		where: (player, { eq }) => eq(player.ckey, "marksuckerberg"),
	});

	return {
		coolStuff: JSON.stringify(query, null, 4),
	};
};
