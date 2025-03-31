import { app } from "./schema"; 
import { serial, text, timestamp } from "drizzle-orm/pg-core";

export const logs = app.table('logs',  {
id: serial('id').primaryKey(),
  tableName: text('table_name').notNull(),
  dbUser: text('db_user').notNull(),
  insertedAt: timestamp('inserted_at').defaultNow(),
});

export type Log = typeof logs.$inferSelect;
export type NewLog = typeof logs.$inferInsert;
