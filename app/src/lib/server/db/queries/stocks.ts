import { readDB, writeDB } from '$lib/server/db';
import { stocks, type Stock, type NewStock } from '$lib/server/db/schema/stocks';
import { eq } from 'drizzle-orm';

export const insertStock = async (newStock: NewStock): Promise<Stock> => {
  const inserted = await writeDB.insert(stocks).values(newStock).returning();
  return inserted[0];
};

export const getAllStocks = async (): Promise<Stock[]> => {
  return await readDB.select().from(stocks);
};

export const getStockBySymbol = async (symbol: string): Promise<Stock | null> => {
  const result = await readDB.select().from(stocks).where(eq(stocks.symbol, symbol));
  return result[0] || null;
};

export const updateStock = async (symbol: string, updatedStock: Partial<Stock>): Promise<Stock | null> => {
  const result = await writeDB.update(stocks).set(updatedStock).where(eq(stocks.symbol, symbol)).returning();
  return result[0] || null;
};

export const deleteStock = async (symbol: string): Promise<Stock | null> => {
  const existing = await getStockBySymbol(symbol);
  if (existing) {
    await writeDB.delete(stocks).where(eq(stocks.symbol, symbol));
  }
  return existing;
};