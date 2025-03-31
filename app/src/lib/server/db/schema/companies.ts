import { app } from './schema';
import { serial, varchar, integer } from 'drizzle-orm/pg-core';
import { industries } from './industries';

export const companies = app.table('companies', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }),
  address: varchar('address', { length: 500 }),
  country: varchar('country', { length: 50 }),
  officialSite: varchar('official_site', { length: 255 }),
  exchange: varchar('exchange', { length: 50 }),
  industryId: integer('industry_id').references(() => industries.id),
});

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;