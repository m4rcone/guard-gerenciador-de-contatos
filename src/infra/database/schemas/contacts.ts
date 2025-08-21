import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id: uuid().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 254 }),
  phone: varchar({ length: 20 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  userId: uuid("user_id").notNull(),
});
