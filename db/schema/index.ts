import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_roles", [
  "MEMBER",
  "ADMIN",
  "SUPER_ADMIN",
  "MODERATOR",
]);

export const usersTable = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 500 }).notNull().unique(),
  password: varchar({ length: 1000 }).notNull(),
  role: userRole().default("MEMBER"),

  lastLogin: timestamp({ mode: "string", withTimezone: true }),
  createdAt: timestamp({ mode: "string", withTimezone: true }).defaultNow(),
  updatedAT: timestamp({ mode: "string", withTimezone: true }).defaultNow(),
});
