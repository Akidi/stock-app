import { serial, numeric, integer, date } from 'drizzle-orm/pg-core';
import { stocks } from './stocks';
import { app } from './schema';

export const financialMetrics = app.table('financial_metrics', {
  id: serial('id').primaryKey(),
  stockId: integer('stock_id').references(() => stocks.id, { onDelete: 'cascade' }),
  revenueTTM: numeric('revenue_ttm', { precision: 20, scale: 2 }),
  profitMargin: numeric('profit_margin', { precision: 6, scale: 3 }),
  operatingMarginTTM: numeric('operating_margin_ttm', { precision: 6, scale: 3 }),
  returnOnAssetsTTM: numeric('return_on_assets_ttm', { precision: 6, scale: 3 }),
  returnOnEquityTTM: numeric('return_on_equity_ttm', { precision: 6, scale: 3 }),
  quarterEnding: date('quarter_ending'),
});

export type FinancialMetric = typeof financialMetrics.$inferSelect;
export type NewFinancialMetric = typeof financialMetrics.$inferInsert;