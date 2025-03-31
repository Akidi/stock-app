import { app } from './schema';
import { serial, varchar, integer } from 'drizzle-orm/pg-core';
import { sectors } from './sectors';

export const industries = app.table('industries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  sectorId: integer('sector_id').references(() => sectors.id),
});

export type Industry = typeof industries.$inferSelect;
export type NewIndustry = typeof industries.$inferInsert;