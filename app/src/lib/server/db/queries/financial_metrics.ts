import { readDB, writeDB } from '$lib/server/db';
import { financialMetrics, type FinancialMetric, type NewFinancialMetric } from '$lib/server/db/schema/financial_metrics';
import { eq } from 'drizzle-orm';

export const insertFinancialMetric = async (item: NewFinancialMetric): Promise<FinancialMetric> => {
  const inserted = await writeDB.insert(financialMetrics).values(item).returning();
  return inserted[0];
};

export const getAllFinancialMetrics = async (): Promise<FinancialMetric[]> => {
  return await readDB.select().from(financialMetrics);
};

export const getFinancialMetricById = async (id: number): Promise<FinancialMetric | null> => {
  const result = await readDB.select().from(financialMetrics).where(eq(financialMetrics.id, id));
  return result[0] || null;
};

export const updateFinancialMetric = async (id: number, updated: Partial<FinancialMetric>): Promise<FinancialMetric | null> => {
  const result = await writeDB.update(financialMetrics).set(updated).where(eq(financialMetrics.id, id)).returning();
  return result[0] || null;
};

export const deleteFinancialMetric = async (id: number): Promise<FinancialMetric | null> => {
  const existing = await getFinancialMetricById(id);
  if (existing) {
    await writeDB.delete(financialMetrics).where(eq(financialMetrics.id, id));
  }
  return existing;
};
