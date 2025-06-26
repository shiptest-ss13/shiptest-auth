import {
	mysqlTable,
	index,
	varchar,
	int,
	datetime,
	smallint,
	mysqlEnum,
	text,
	timestamp,
	check,
	longtext,
	double,
	date,
	char,
	tinyint,
	bigint,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const achievements = mysqlTable(
	"achievements",
	{
		ckey: varchar({ length: 32 })
			.notNull()
			.references(() => player.ckey, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		achievementKey: varchar("achievement_key", { length: 32 })
			.notNull()
			.references(() => achievementMetadata.achievementKey, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		value: int(),
		lastUpdated: datetime("last_updated", { mode: "string" })
			.default("current_timestamp()")
			.notNull(),
	},
	(table) => [index("achievement_key").on(table.achievementKey)]
);

export const achievementMetadata = mysqlTable("achievement_metadata", {
	achievementKey: varchar("achievement_key", { length: 32 }).notNull(),
	achievementVersion: smallint("achievement_version").notNull(),
	achievementType: mysqlEnum("achievement_type", [
		"achievement",
		"score",
		"award",
	]),
	achievementName: varchar("achievement_name", { length: 64 }),
	achievementDescription: varchar("achievement_description", { length: 512 }),
});

export const admin = mysqlTable(
	"admin",
	{
		ckey: varchar({ length: 32 })
			.notNull()
			.references(() => player.ckey, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		rank: varchar({ length: 32 })
			.notNull()
			.references(() => adminRanks.rank, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		feedback: varchar({ length: 255 }),
	},
	(table) => [index("rank").on(table.rank)]
);

export const adminLog = mysqlTable(
	"admin_log",
	{
		id: int().autoincrement().notNull(),
		datetime: datetime({ mode: "string" }).notNull(),
		roundId: int("round_id")
			.notNull()
			.references(() => round.id, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		adminckey: varchar({ length: 32 })
			.notNull()
			.references(() => player.ckey, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		adminip: int().notNull(),
		operation: mysqlEnum([
			"add admin",
			"remove admin",
			"change admin rank",
			"add rank",
			"remove rank",
			"change rank flags",
		]).notNull(),
		target: varchar({ length: 32 }).notNull(),
		log: varchar({ length: 1000 }).notNull(),
	},
	(table) => [
		index("round_id").on(table.roundId),
		index("adminckey").on(table.adminckey),
	]
);

export const adminRanks = mysqlTable("admin_ranks", {
	rank: varchar({ length: 32 }).notNull(),
	flags: smallint().notNull(),
	excludeFlags: smallint("exclude_flags").notNull(),
	canEditFlags: smallint("can_edit_flags").notNull(),
});

export const ban = mysqlTable(
	"ban",
	{
		id: int().autoincrement().notNull(),
		bantime: datetime({ mode: "string" }).notNull(),
		serverIp: int("server_ip").notNull(),
		serverPort: smallint("server_port").notNull(),
		roundId: int("round_id")
			.notNull()
			.references(() => round.id, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		role: varchar({ length: 32 }),
		expirationTime: datetime("expiration_time", { mode: "string" }),
		appliesToAdmins: tinyint("applies_to_admins").default(0).notNull(),
		reason: varchar({ length: 2048 }).notNull(),
		ckey: varchar({ length: 32 }).references(() => player.ckey, {
			onDelete: "restrict",
			onUpdate: "restrict",
		}),
		ip: int(),
		computerid: varchar({ length: 32 }),
		aCkey: varchar("a_ckey", { length: 32 })
			.notNull()
			.references(() => player.ckey, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		aIp: int("a_ip").notNull(),
		aComputerid: varchar("a_computerid", { length: 32 }).notNull(),
		who: varchar({ length: 2048 }).notNull(),
		adminwho: varchar({ length: 2048 }).notNull(),
		edits: text(),
		unbannedDatetime: datetime("unbanned_datetime", { mode: "string" }),
		unbannedCkey: varchar("unbanned_ckey", { length: 32 }).references(
			() => player.ckey,
			{ onDelete: "restrict", onUpdate: "restrict" }
		),
		unbannedIp: int("unbanned_ip"),
		unbannedComputerid: varchar("unbanned_computerid", { length: 32 }),
		unbannedRoundId: int("unbanned_round_id").references(() => round.id, {
			onDelete: "restrict",
			onUpdate: "restrict",
		}),
	},
	(table) => [
		index("idx_ban_isbanned").on(
			table.ckey,
			table.role,
			table.unbannedDatetime,
			table.expirationTime
		),
		index("idx_ban_isbanned_details").on(
			table.ckey,
			table.ip,
			table.computerid,
			table.role,
			table.unbannedDatetime,
			table.expirationTime
		),
		index("idx_ban_count").on(
			table.bantime,
			table.aCkey,
			table.appliesToAdmins,
			table.unbannedDatetime,
			table.expirationTime
		),
		index("round_id").on(table.roundId),
		index("unbanned_round_id").on(table.unbannedRoundId),
		index("a_ckey").on(table.aCkey),
		index("unbanned_ckey").on(table.unbannedCkey),
	]
);

export const connectionLog = mysqlTable(
	"connection_log",
	{
		id: int().autoincrement().notNull(),
		datetime: datetime({ mode: "string" }),
		serverIp: int("server_ip").notNull(),
		serverPort: smallint("server_port").notNull(),
		roundId: int("round_id")
			.notNull()
			.references(() => round.id, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		ckey: varchar({ length: 32 }).references(() => player.ckey, {
			onDelete: "restrict",
			onUpdate: "restrict",
		}),
		ip: int().notNull(),
		computerid: varchar({ length: 45 }),
	},
	(table) => [
		index("round_id").on(table.roundId),
		index("ckey").on(table.ckey),
	]
);

export const death = mysqlTable(
	"death",
	{
		id: int().autoincrement().notNull(),
		pod: varchar({ length: 50 }).notNull(),
		xCoord: smallint("x_coord").notNull(),
		yCoord: smallint("y_coord").notNull(),
		zCoord: smallint("z_coord").notNull(),
		mapname: varchar({ length: 64 }).notNull(),
		serverIp: int("server_ip").notNull(),
		serverPort: smallint("server_port").notNull(),
		roundId: int("round_id")
			.notNull()
			.references(() => round.id, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		tod: datetime({ mode: "string" }).notNull(),
		job: varchar({ length: 32 }).notNull(),
		special: varchar({ length: 32 }),
		name: varchar({ length: 96 }).notNull(),
		byondkey: varchar({ length: 32 })
			.notNull()
			.references(() => player.ckey, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		laname: varchar({ length: 96 }),
		lakey: varchar({ length: 32 }),
		bruteloss: smallint().notNull(),
		brainloss: smallint().notNull(),
		fireloss: smallint().notNull(),
		oxyloss: smallint().notNull(),
		toxloss: smallint().notNull(),
		cloneloss: smallint().notNull(),
		staminaloss: smallint().notNull(),
		lastWords: varchar("last_words", { length: 255 }),
		suicide: tinyint().default(0).notNull(),
	},
	(table) => [
		index("round_id").on(table.roundId),
		index("byondkey").on(table.byondkey),
	]
);

export const discordLinks = mysqlTable(
	"discord_links",
	{
		id: int().autoincrement().notNull(),
		ckey: varchar({ length: 32 })
			.notNull()
			.references(() => player.ckey, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		discordId: bigint("discord_id", { mode: "number" }),
		timestamp: timestamp({ mode: "string" })
			.default("current_timestamp()")
			.notNull(),
		oneTimeToken: varchar("one_time_token", { length: 100 }).notNull(),
		valid: tinyint().default(0).notNull(),
	},
	(table) => [index("ckey").on(table.ckey)]
);

export const feedback = mysqlTable(
	"feedback",
	{
		id: int().autoincrement().notNull(),
		datetime: datetime({ mode: "string" }).notNull(),
		roundId: int("round_id").notNull(),
		keyName: varchar("key_name", { length: 32 }).notNull(),
		keyType: mysqlEnum("key_type", [
			"text",
			"amount",
			"tally",
			"nested tally",
			"associative",
		]).notNull(),
		version: tinyint().notNull(),
		json: longtext().notNull(),
	},
	(table) => [
		index("round_id").on(table.roundId),
		check("json", sql`json_valid(\`json\`)`),
	]
);

export const ipintel = mysqlTable(
	"ipintel",
	{
		ip: int().notNull(),
		date: timestamp({ mode: "string" })
			.default("current_timestamp()")
			.notNull(),
		intel: double().notNull(),
	},
	(table) => [index("idx_ipintel").on(table.ip, table.intel, table.date)]
);

export const legacyPopulation = mysqlTable(
	"legacy_population",
	{
		id: int().autoincrement().notNull(),
		playercount: int(),
		admincount: int(),
		time: datetime({ mode: "string" }).notNull(),
		serverIp: int("server_ip").notNull(),
		serverPort: smallint("server_port").notNull(),
		roundId: int("round_id")
			.notNull()
			.references(() => round.id, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
	},
	(table) => [index("round_id").on(table.roundId)]
);

export const library = mysqlTable(
	"library",
	{
		id: int().autoincrement().notNull(),
		author: varchar({ length: 45 }).notNull(),
		title: varchar({ length: 45 }).notNull(),
		content: text().notNull(),
		category: mysqlEnum([
			"Any",
			"Fiction",
			"Non-Fiction",
			"Adult",
			"Reference",
			"Religion",
		]).notNull(),
		ckey: varchar({ length: 32 })
			.default("'LEGACY'")
			.notNull()
			.references(() => player.ckey, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		datetime: datetime({ mode: "string" }).notNull(),
		deleted: tinyint(),
		roundIdCreated: int("round_id_created")
			.notNull()
			.references(() => round.id, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
	},
	(table) => [
		index("deleted_idx").on(table.deleted),
		index("idx_lib_id_del").on(table.id, table.deleted),
		index("idx_lib_del_title").on(table.deleted, table.title),
		index("idx_lib_search").on(
			table.deleted,
			table.author,
			table.title,
			table.category
		),
		index("ckey").on(table.ckey),
		index("round_id_created").on(table.roundIdCreated),
	]
);

export const mentor = mysqlTable("mentor", {
	ckey: varchar({ length: 32 })
		.notNull()
		.references(() => player.ckey, {
			onDelete: "restrict",
			onUpdate: "restrict",
		}),
});

export const mentorMemo = mysqlTable(
	"mentor_memo",
	{
		ckey: varchar({ length: 32 })
			.notNull()
			.references(() => player.ckey, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		memotext: text().notNull(),
		timestamp: datetime({ mode: "string" }).notNull(),
		lastEditor: varchar("last_editor", { length: 32 }).references(
			() => player.ckey,
			{ onDelete: "restrict", onUpdate: "restrict" }
		),
		edits: text(),
	},
	(table) => [index("last_editor").on(table.lastEditor)]
);

export const messages = mysqlTable(
	"messages",
	{
		id: int().autoincrement().notNull(),
		type: mysqlEnum([
			"memo",
			"message",
			"message sent",
			"note",
			"watchlist entry",
		]).notNull(),
		targetckey: varchar({ length: 32 })
			.notNull()
			.references(() => player.ckey, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		adminckey: varchar({ length: 32 })
			.notNull()
			.references(() => player.ckey, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		text: varchar({ length: 2048 }).notNull(),
		timestamp: datetime({ mode: "string" }).notNull(),
		server: varchar({ length: 32 }),
		serverIp: int("server_ip").notNull(),
		serverPort: smallint("server_port").notNull(),
		roundId: int("round_id")
			.notNull()
			.references(() => round.id, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		secret: tinyint().notNull(),
		expireTimestamp: datetime("expire_timestamp", { mode: "string" }),
		severity: mysqlEnum(["high", "medium", "minor", "none"]),
		lasteditor: varchar({ length: 32 }),
		edits: text(),
		deleted: tinyint().default(0).notNull(),
		deletedCkey: varchar("deleted_ckey", { length: 32 }).references(
			() => player.ckey,
			{ onDelete: "restrict", onUpdate: "restrict" }
		),
	},
	(table) => [
		index("idx_msg_ckey_time").on(
			table.targetckey,
			table.timestamp,
			table.deleted
		),
		index("idx_msg_type_ckeys_time").on(
			table.type,
			table.targetckey,
			table.adminckey,
			table.timestamp,
			table.deleted
		),
		index("idx_msg_type_ckey_time_odr").on(
			table.type,
			table.targetckey,
			table.timestamp,
			table.deleted
		),
		index("adminckey").on(table.adminckey),
		index("round_id").on(table.roundId),
		index("deleted_ckey").on(table.deletedCkey),
	]
);

export const player = mysqlTable(
	"player",
	{
		ckey: varchar({ length: 32 }).notNull(),
		byondKey: varchar("byond_key", { length: 32 }),
		firstseen: datetime({ mode: "string" }).notNull(),
		firstseenRoundId: int("firstseen_round_id")
			.notNull()
			.references(() => round.id, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		lastseen: datetime({ mode: "string" }).notNull(),
		lastseenRoundId: int("lastseen_round_id")
			.notNull()
			.references(() => round.id, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		ip: int().notNull(),
		computerid: varchar({ length: 32 }).notNull(),
		lastadminrank: varchar({ length: 32 }).default("'Player'").notNull(),
		// you can use { mode: 'date' }, if you want to have Date as type for this column
		accountjoindate: date({ mode: "string" }),
		flags: smallint().notNull(),
	},
	(table) => [
		index("idx_player_cid_ckey").on(table.computerid, table.ckey),
		index("idx_player_ip_ckey").on(table.ip, table.ckey),
		index("firstseen_round_id").on(table.firstseenRoundId),
		index("lastseen_round_id").on(table.lastseenRoundId),
	]
);

export const pollOption = mysqlTable(
	"poll_option",
	{
		id: int().autoincrement().notNull(),
		pollid: int().notNull(),
		text: varchar({ length: 255 }).notNull(),
		minval: int(),
		maxval: int(),
		descmin: varchar({ length: 32 }),
		descmid: varchar({ length: 32 }),
		descmax: varchar({ length: 32 }),
		defaultPercentageCalc: tinyint("default_percentage_calc")
			.default(1)
			.notNull(),
		deleted: tinyint().default(0).notNull(),
	},
	(table) => [index("idx_pop_pollid").on(table.pollid)]
);

export const pollQuestion = mysqlTable(
	"poll_question",
	{
		id: int().autoincrement().notNull(),
		polltype: mysqlEnum([
			"OPTION",
			"TEXT",
			"NUMVAL",
			"MULTICHOICE",
			"IRV",
		]).notNull(),
		createdDatetime: datetime("created_datetime", {
			mode: "string",
		}).notNull(),
		starttime: datetime({ mode: "string" }).notNull(),
		endtime: datetime({ mode: "string" }).notNull(),
		question: varchar({ length: 255 }).notNull(),
		subtitle: varchar({ length: 255 }),
		adminonly: tinyint().notNull(),
		multiplechoiceoptions: int(),
		createdbyCkey: varchar("createdby_ckey", { length: 32 })
			.notNull()
			.references(() => player.ckey, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		createdbyIp: int("createdby_ip").notNull(),
		dontshow: tinyint().notNull(),
		allowRevoting: tinyint("allow_revoting").notNull(),
		deleted: tinyint().default(0).notNull(),
	},
	(table) => [
		index("idx_pquest_question_time_ckey").on(
			table.question,
			table.starttime,
			table.endtime,
			table.createdbyCkey,
			table.createdbyIp
		),
		index("idx_pquest_time_deleted_id").on(
			table.starttime,
			table.endtime,
			table.deleted,
			table.id
		),
		index("idx_pquest_id_time_type_admin").on(
			table.id,
			table.starttime,
			table.endtime,
			table.polltype,
			table.adminonly
		),
		index("createdby_ckey").on(table.createdbyCkey),
	]
);

export const pollTextreply = mysqlTable(
	"poll_textreply",
	{
		id: int().autoincrement().notNull(),
		datetime: datetime({ mode: "string" }).notNull(),
		pollid: int().notNull(),
		ckey: varchar({ length: 32 })
			.notNull()
			.references(() => player.ckey, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		ip: int().notNull(),
		replytext: varchar({ length: 2048 }).notNull(),
		adminrank: varchar({ length: 32 })
			.notNull()
			.references(() => adminRanks.rank, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		deleted: tinyint().default(0).notNull(),
	},
	(table) => [
		index("idx_ptext_pollid_ckey").on(table.pollid, table.ckey),
		index("ckey").on(table.ckey),
		index("adminrank").on(table.adminrank),
	]
);

export const pollVote = mysqlTable(
	"poll_vote",
	{
		id: int().autoincrement().notNull(),
		datetime: datetime({ mode: "string" }).notNull(),
		pollid: int().notNull(),
		optionid: int().notNull(),
		ckey: varchar({ length: 32 })
			.notNull()
			.references(() => player.ckey, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		ip: int().notNull(),
		adminrank: varchar({ length: 32 }).notNull(),
		rating: int(),
		deleted: tinyint().default(0).notNull(),
	},
	(table) => [
		index("idx_pvote_pollid_ckey").on(table.pollid, table.ckey),
		index("idx_pvote_optionid_ckey").on(table.optionid, table.ckey),
		index("ckey").on(table.ckey),
	]
);

export const roleTime = mysqlTable("role_time", {
	ckey: varchar({ length: 32 })
		.notNull()
		.references(() => player.ckey, {
			onDelete: "restrict",
			onUpdate: "restrict",
		}),
	job: varchar({ length: 32 }).notNull(),
	minutes: int().notNull(),
});

export const roleTimeLog = mysqlTable(
	"role_time_log",
	{
		id: bigint({ mode: "number" }).autoincrement().notNull(),
		ckey: varchar({ length: 32 }).notNull(),
		job: varchar({ length: 128 }).notNull(),
		delta: int().notNull(),
		datetime: timestamp({ mode: "string" })
			.default("current_timestamp()")
			.notNull(),
	},
	(table) => [
		index("ckey").on(table.ckey),
		index("job").on(table.job),
		index("datetime").on(table.datetime),
	]
);

export const round = mysqlTable("round", {
	id: int().autoincrement().notNull(),
	initializeDatetime: datetime("initialize_datetime", {
		mode: "string",
	}).notNull(),
	startDatetime: datetime("start_datetime", { mode: "string" }),
	shutdownDatetime: datetime("shutdown_datetime", { mode: "string" }),
	endDatetime: datetime("end_datetime", { mode: "string" }),
	serverIp: int("server_ip").notNull(),
	serverPort: smallint("server_port").notNull(),
	commitHash: char("commit_hash", { length: 40 }),
	gameMode: varchar("game_mode", { length: 32 }),
	gameModeResult: varchar("game_mode_result", { length: 64 }),
	endState: varchar("end_state", { length: 64 }),
	shuttleName: varchar("shuttle_name", { length: 64 }),
	mapName: varchar("map_name", { length: 32 }),
	stationName: varchar("station_name", { length: 80 }),
});

export const schemaRevision = mysqlTable("schema_revision", {
	major: tinyint().notNull(),
	minor: tinyint().notNull(),
	date: datetime({ mode: "string" }).default("current_timestamp()").notNull(),
});

export const stickyban = mysqlTable("stickyban", {
	ckey: varchar({ length: 32 })
		.notNull()
		.references(() => player.ckey, {
			onDelete: "restrict",
			onUpdate: "restrict",
		}),
	reason: varchar({ length: 2048 }).notNull(),
	banningAdmin: varchar("banning_admin", { length: 32 }).notNull(),
	datetime: datetime({ mode: "string" })
		.default("current_timestamp()")
		.notNull(),
});

export const stickybanMatchedCid = mysqlTable("stickyban_matched_cid", {
	stickyban: varchar({ length: 32 })
		.notNull()
		.references(() => stickyban.ckey, {
			onDelete: "restrict",
			onUpdate: "restrict",
		}),
	matchedCid: varchar("matched_cid", { length: 32 }).notNull(),
	firstMatched: datetime("first_matched", { mode: "string" })
		.default("current_timestamp()")
		.notNull(),
	lastMatched: timestamp("last_matched", { mode: "string" })
		.default("current_timestamp()")
		.notNull(),
});

export const stickybanMatchedCkey = mysqlTable(
	"stickyban_matched_ckey",
	{
		stickyban: varchar({ length: 32 })
			.notNull()
			.references(() => stickyban.ckey, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		matchedCkey: varchar("matched_ckey", { length: 32 })
			.notNull()
			.references(() => player.ckey, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		firstMatched: datetime("first_matched", { mode: "string" })
			.default("current_timestamp()")
			.notNull(),
		lastMatched: timestamp("last_matched", { mode: "string" })
			.default("current_timestamp()")
			.notNull(),
		exempt: tinyint().default(0).notNull(),
	},
	(table) => [index("matched_ckey").on(table.matchedCkey)]
);

export const stickybanMatchedIp = mysqlTable("stickyban_matched_ip", {
	stickyban: varchar({ length: 32 })
		.notNull()
		.references(() => stickyban.ckey, {
			onDelete: "restrict",
			onUpdate: "restrict",
		}),
	matchedIp: int("matched_ip").notNull(),
	firstMatched: datetime("first_matched", { mode: "string" })
		.default("current_timestamp()")
		.notNull(),
	lastMatched: timestamp("last_matched", { mode: "string" })
		.default("current_timestamp()")
		.notNull(),
});

export const ticket = mysqlTable(
	"ticket",
	{
		id: int().autoincrement().notNull(),
		serverIp: int("server_ip").notNull(),
		serverPort: smallint("server_port").notNull(),
		roundId: int("round_id")
			.notNull()
			.references(() => round.id, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		ticket: smallint().notNull(),
		action: varchar({ length: 20 }).default("'Message'").notNull(),
		message: text().notNull(),
		timestamp: datetime({ mode: "string" }).notNull(),
		recipient: varchar({ length: 32 }).references(() => player.ckey, {
			onDelete: "restrict",
			onUpdate: "restrict",
		}),
		sender: varchar({ length: 32 }).references(() => player.ckey, {
			onDelete: "restrict",
			onUpdate: "restrict",
		}),
	},
	(table) => [
		index("recipient").on(table.recipient),
		index("sender").on(table.sender),
		index("round_id").on(table.roundId),
	]
);
