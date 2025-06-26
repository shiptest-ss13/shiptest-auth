import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import { env } from "$env/dynamic/private";
import { withReplicas } from "drizzle-orm/mysql-core";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const client = mysql.createPool(env.DATABASE_URL);
const replica = env.REPLICA_URL ? mysql.createPool(env.REPLICA_URL) : undefined;

const primary = drizzle(client, { schema, mode: "default" });
export const db = replica
	? withReplicas(primary, [drizzle(client, { schema, mode: "default" })])
	: primary;
export type Db = typeof db;
