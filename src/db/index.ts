import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// ✅ FIX: Global cache object for Serverless (Vercel) Environment
// Ye ensure karega ki baar-baar naye connections open na hon
const globalForPostgres = global as unknown as { postgresClient: postgres.Sql };

const client =
  globalForPostgres.postgresClient ||
  postgres(connectionString, {
    prepare: false, // Required for Supabase Transaction Pooler (Port 6543)
    max: 1, // ✅ IMPORTANT: Limit connections per Vercel lambda
    idle_timeout: 20, // ✅ Close idle connections quickly
    connect_timeout: 10, // ✅ Don't hang forever, fail fast so Vercel can retry
  });

if (process.env.NODE_ENV !== "production") {
  globalForPostgres.postgresClient = client;
}

export const db = drizzle(client, { schema });
