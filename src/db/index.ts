import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Global cache object for Serverless (Vercel) Environment
const globalForPostgres = global as unknown as { postgresClient: postgres.Sql };

const client =
  globalForPostgres.postgresClient ||
  postgres(connectionString, {
    prepare: false, // ✅ Required for Supabase Transaction Pooler (Port 6543)
    max: 10, // ✅ Safe limit for Supabase Nano tier
  });

if (process.env.NODE_ENV !== "production") {
  globalForPostgres.postgresClient = client;
}

export const db = drizzle(client, { schema });
