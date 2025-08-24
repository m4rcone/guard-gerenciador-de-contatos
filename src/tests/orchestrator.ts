import database from "infra/database";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import session from "models/session";
import user, { type UserInputValues } from "models/user";
import { faker } from "@faker-js/faker";
import contact, { ContactInputValues } from "models/contact";

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

async function createUser(userObject?: Partial<UserInputValues>) {
  let name = userObject?.name;
  let email = userObject?.email;

  if (!name) {
    name = faker.person.fullName();
  }

  if (!email) {
    email = faker.internet.email();
  }

  return await user.create({
    name,
    email,
    password: userObject?.password || "validPassword",
  });
}

async function createSession(userId: string) {
  return session.create(userId);
}

const orchestrator = {
  clearDatabase,
  runMigrations,
  createUser,
  createSession,
};

export default orchestrator;
