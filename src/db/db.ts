import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";
import { Database } from "bun:sqlite";

const sqlite = new Database("database.sqlite3");

const db = drizzle(sqlite, { schema });

export default db;
