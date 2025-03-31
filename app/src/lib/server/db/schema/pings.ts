import { app } from './schema';
import { serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const pings = app.table('pings', {
  id: serial('id').primaryKey(),
  label: varchar('label', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow()
});

export type Ping = typeof pings.$inferSelect;
export type NewPing = typeof pings.$inferInsert;