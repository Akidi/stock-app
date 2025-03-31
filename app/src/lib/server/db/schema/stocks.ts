import { app } from "./schema";
import { serial, varchar, numeric, integer, timestamp, date } from 'drizzle-orm/pg-core';
import { companies } from './companies';

export const stocks = app.table('stocks', {
  id: serial('id').primaryKey(),
  symbol: varchar('symbol', { length: 10 }).notNull().unique(),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 5 }).default('USD'),
  marketCap: numeric('market_cap', { precision: 20, scale: 2 }),
  peRatio: numeric('pe_ratio', { precision: 10, scale: 2 }),
  eps: numeric('eps', { precision: 10, scale: 2 }),
  dividendYield: numeric('dividend_yield', { precision: 6, scale: 4 }),
  beta: numeric('beta', { precision: 6, scale: 3 }),
  analystTargetPrice: numeric('analyst_target_price', { precision: 12, scale: 2 }),
  fiscalYearEnd: timestamp('fiscal_year_end'),
  latestQuarter: date('latest_quarter'),
  lastUpdated: timestamp('last_updated').defaultNow(),
  companyId: integer('company_id').references(() => companies.id, { onDelete: 'cascade' }),
});

export type Stock = typeof stocks.$inferSelect;
export type NewStock = typeof stocks.$inferInsert;