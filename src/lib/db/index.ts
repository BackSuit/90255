import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Connect to any standard PostgreSQL database.
// Set prepare: false if using a connection pooler (e.g. PgBouncer, Supabase pooler).
const client = postgres(connectionString, {
  prepare: false,
});

export const db = drizzle(client, { schema });
