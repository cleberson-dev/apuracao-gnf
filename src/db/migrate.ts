import "dotenv/config";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import db from "./db";

migrate(db, { migrationsFolder: "./drizzle" });
