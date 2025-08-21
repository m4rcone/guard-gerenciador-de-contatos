import database from "infra/database";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import session from "models/session";

async function clearDatabase() {
  await database.query(
    "drop schema public cascade; drop schema drizzle cascade; create schema public",
  );
}

async function runMigrations() {
  const client = await database.getNewClient();
  const db = drizzle(client);

  await migrate(db, {
    migrationsFolder: "./src/infra/database/migrations",
  });

  client?.end();
}

async function createSession(userId: string) {
  return session.create(userId);
}

const orchestrator = {
  clearDatabase,
  runMigrations,
  createSession,
};

export default orchestrator;
