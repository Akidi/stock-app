import { app } from './schema';
import { serial, varchar } from 'drizzle-orm/pg-core';

export const sectors = app.table('sectors', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
});

export type Sector = typeof sectors.$inferSelect;
export type NewSector = typeof sectors.$inferInsert;