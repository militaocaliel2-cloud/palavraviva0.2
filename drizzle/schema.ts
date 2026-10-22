import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const faithJourney = mysqlTable("faith_journey", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  journeyDate: varchar("journeyDate", { length: 10 }).notNull(),
  streak: int("streak").default(0).notNull(),
  prayerDays: int("prayerDays").default(0).notNull(),
  completed: json("completed").$type<{ liturgy: boolean; prayer: boolean; rosary: boolean }>().notNull(),
  reminderTime: varchar("reminderTime", { length: 5 }).default("07:30").notNull(),
  reminderDays: json("reminderDays").$type<number[]>().notNull(),
  themePreference: mysqlEnum("themePreference", ["system", "light", "dark"]).default("system").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FaithJourney = typeof faithJourney.$inferSelect;
export type InsertFaithJourney = typeof faithJourney.$inferInsert;
