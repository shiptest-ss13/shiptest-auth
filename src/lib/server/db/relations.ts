import { relations } from "drizzle-orm/relations";
import { player, achievements, achievementMetadata, admin, adminRanks, round, adminLog, ban, connectionLog, death, discordLinks, legacyPopulation, library, mentor, mentorMemo, messages, pollQuestion, pollTextreply, pollVote, roleTime, stickyban, stickybanMatchedCid, stickybanMatchedCkey, stickybanMatchedIp, ticket } from "./schema";

export const achievementsRelations = relations(achievements, ({one}) => ({
	player: one(player, {
		fields: [achievements.ckey],
		references: [player.ckey]
	}),
	achievementMetadatum: one(achievementMetadata, {
		fields: [achievements.achievementKey],
		references: [achievementMetadata.achievementKey]
	}),
}));

export const playerRelations = relations(player, ({one, many}) => ({
	achievements: many(achievements),
	admins: many(admin),
	adminLogs: many(adminLog),
	bans_ckey: many(ban, {
		relationName: "ban_ckey_player_ckey"
	}),
	bans_aCkey: many(ban, {
		relationName: "ban_aCkey_player_ckey"
	}),
	bans_unbannedCkey: many(ban, {
		relationName: "ban_unbannedCkey_player_ckey"
	}),
	connectionLogs: many(connectionLog),
	deaths: many(death),
	discordLinks: many(discordLinks),
	libraries: many(library),
	mentors: many(mentor),
	mentorMemos_ckey: many(mentorMemo, {
		relationName: "mentorMemo_ckey_player_ckey"
	}),
	mentorMemos_lastEditor: many(mentorMemo, {
		relationName: "mentorMemo_lastEditor_player_ckey"
	}),
	messages_targetckey: many(messages, {
		relationName: "messages_targetckey_player_ckey"
	}),
	messages_adminckey: many(messages, {
		relationName: "messages_adminckey_player_ckey"
	}),
	messages_deletedCkey: many(messages, {
		relationName: "messages_deletedCkey_player_ckey"
	}),
	round_firstseenRoundId: one(round, {
		fields: [player.firstseenRoundId],
		references: [round.id],
		relationName: "player_firstseenRoundId_round_id"
	}),
	round_lastseenRoundId: one(round, {
		fields: [player.lastseenRoundId],
		references: [round.id],
		relationName: "player_lastseenRoundId_round_id"
	}),
	pollQuestions: many(pollQuestion),
	pollTextreplies: many(pollTextreply),
	pollVotes: many(pollVote),
	roleTimes: many(roleTime),
	stickybans: many(stickyban),
	stickybanMatchedCkeys: many(stickybanMatchedCkey),
	tickets_recipient: many(ticket, {
		relationName: "ticket_recipient_player_ckey"
	}),
	tickets_sender: many(ticket, {
		relationName: "ticket_sender_player_ckey"
	}),
}));

export const achievementMetadataRelations = relations(achievementMetadata, ({many}) => ({
	achievements: many(achievements),
}));

export const adminRelations = relations(admin, ({one}) => ({
	player: one(player, {
		fields: [admin.ckey],
		references: [player.ckey]
	}),
	adminRank: one(adminRanks, {
		fields: [admin.rank],
		references: [adminRanks.rank]
	}),
}));

export const adminRanksRelations = relations(adminRanks, ({many}) => ({
	admins: many(admin),
	pollTextreplies: many(pollTextreply),
}));

export const adminLogRelations = relations(adminLog, ({one}) => ({
	round: one(round, {
		fields: [adminLog.roundId],
		references: [round.id]
	}),
	player: one(player, {
		fields: [adminLog.adminckey],
		references: [player.ckey]
	}),
}));

export const roundRelations = relations(round, ({many}) => ({
	adminLogs: many(adminLog),
	bans_roundId: many(ban, {
		relationName: "ban_roundId_round_id"
	}),
	bans_unbannedRoundId: many(ban, {
		relationName: "ban_unbannedRoundId_round_id"
	}),
	connectionLogs: many(connectionLog),
	deaths: many(death),
	legacyPopulations: many(legacyPopulation),
	libraries: many(library),
	messages: many(messages),
	players_firstseenRoundId: many(player, {
		relationName: "player_firstseenRoundId_round_id"
	}),
	players_lastseenRoundId: many(player, {
		relationName: "player_lastseenRoundId_round_id"
	}),
	tickets: many(ticket),
}));

export const banRelations = relations(ban, ({one}) => ({
	round_roundId: one(round, {
		fields: [ban.roundId],
		references: [round.id],
		relationName: "ban_roundId_round_id"
	}),
	round_unbannedRoundId: one(round, {
		fields: [ban.unbannedRoundId],
		references: [round.id],
		relationName: "ban_unbannedRoundId_round_id"
	}),
	player_ckey: one(player, {
		fields: [ban.ckey],
		references: [player.ckey],
		relationName: "ban_ckey_player_ckey"
	}),
	player_aCkey: one(player, {
		fields: [ban.aCkey],
		references: [player.ckey],
		relationName: "ban_aCkey_player_ckey"
	}),
	player_unbannedCkey: one(player, {
		fields: [ban.unbannedCkey],
		references: [player.ckey],
		relationName: "ban_unbannedCkey_player_ckey"
	}),
}));

export const connectionLogRelations = relations(connectionLog, ({one}) => ({
	round: one(round, {
		fields: [connectionLog.roundId],
		references: [round.id]
	}),
	player: one(player, {
		fields: [connectionLog.ckey],
		references: [player.ckey]
	}),
}));

export const deathRelations = relations(death, ({one}) => ({
	round: one(round, {
		fields: [death.roundId],
		references: [round.id]
	}),
	player: one(player, {
		fields: [death.byondkey],
		references: [player.ckey]
	}),
}));

export const discordLinksRelations = relations(discordLinks, ({one}) => ({
	player: one(player, {
		fields: [discordLinks.ckey],
		references: [player.ckey]
	}),
}));

export const legacyPopulationRelations = relations(legacyPopulation, ({one}) => ({
	round: one(round, {
		fields: [legacyPopulation.roundId],
		references: [round.id]
	}),
}));

export const libraryRelations = relations(library, ({one}) => ({
	player: one(player, {
		fields: [library.ckey],
		references: [player.ckey]
	}),
	round: one(round, {
		fields: [library.roundIdCreated],
		references: [round.id]
	}),
}));

export const mentorRelations = relations(mentor, ({one}) => ({
	player: one(player, {
		fields: [mentor.ckey],
		references: [player.ckey]
	}),
}));

export const mentorMemoRelations = relations(mentorMemo, ({one}) => ({
	player_ckey: one(player, {
		fields: [mentorMemo.ckey],
		references: [player.ckey],
		relationName: "mentorMemo_ckey_player_ckey"
	}),
	player_lastEditor: one(player, {
		fields: [mentorMemo.lastEditor],
		references: [player.ckey],
		relationName: "mentorMemo_lastEditor_player_ckey"
	}),
}));

export const messagesRelations = relations(messages, ({one}) => ({
	player_targetckey: one(player, {
		fields: [messages.targetckey],
		references: [player.ckey],
		relationName: "messages_targetckey_player_ckey"
	}),
	player_adminckey: one(player, {
		fields: [messages.adminckey],
		references: [player.ckey],
		relationName: "messages_adminckey_player_ckey"
	}),
	round: one(round, {
		fields: [messages.roundId],
		references: [round.id]
	}),
	player_deletedCkey: one(player, {
		fields: [messages.deletedCkey],
		references: [player.ckey],
		relationName: "messages_deletedCkey_player_ckey"
	}),
}));

export const pollQuestionRelations = relations(pollQuestion, ({one}) => ({
	player: one(player, {
		fields: [pollQuestion.createdbyCkey],
		references: [player.ckey]
	}),
}));

export const pollTextreplyRelations = relations(pollTextreply, ({one}) => ({
	player: one(player, {
		fields: [pollTextreply.ckey],
		references: [player.ckey]
	}),
	adminRank: one(adminRanks, {
		fields: [pollTextreply.adminrank],
		references: [adminRanks.rank]
	}),
}));

export const pollVoteRelations = relations(pollVote, ({one}) => ({
	player: one(player, {
		fields: [pollVote.ckey],
		references: [player.ckey]
	}),
}));

export const roleTimeRelations = relations(roleTime, ({one}) => ({
	player: one(player, {
		fields: [roleTime.ckey],
		references: [player.ckey]
	}),
}));

export const stickybanRelations = relations(stickyban, ({one, many}) => ({
	player: one(player, {
		fields: [stickyban.ckey],
		references: [player.ckey]
	}),
	stickybanMatchedCids: many(stickybanMatchedCid),
	stickybanMatchedCkeys: many(stickybanMatchedCkey),
	stickybanMatchedIps: many(stickybanMatchedIp),
}));

export const stickybanMatchedCidRelations = relations(stickybanMatchedCid, ({one}) => ({
	stickyban: one(stickyban, {
		fields: [stickybanMatchedCid.stickyban],
		references: [stickyban.ckey]
	}),
}));

export const stickybanMatchedCkeyRelations = relations(stickybanMatchedCkey, ({one}) => ({
	stickyban: one(stickyban, {
		fields: [stickybanMatchedCkey.stickyban],
		references: [stickyban.ckey]
	}),
	player: one(player, {
		fields: [stickybanMatchedCkey.matchedCkey],
		references: [player.ckey]
	}),
}));

export const stickybanMatchedIpRelations = relations(stickybanMatchedIp, ({one}) => ({
	stickyban: one(stickyban, {
		fields: [stickybanMatchedIp.stickyban],
		references: [stickyban.ckey]
	}),
}));

export const ticketRelations = relations(ticket, ({one}) => ({
	player_recipient: one(player, {
		fields: [ticket.recipient],
		references: [player.ckey],
		relationName: "ticket_recipient_player_ckey"
	}),
	player_sender: one(player, {
		fields: [ticket.sender],
		references: [player.ckey],
		relationName: "ticket_sender_player_ckey"
	}),
	round: one(round, {
		fields: [ticket.roundId],
		references: [round.id]
	}),
}));