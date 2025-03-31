import { readDB, writeDB } from '$lib/server/db';
import { industries, type Industry, type NewIndustry } from '$lib/server/db/schema/industries';
import { eq } from 'drizzle-orm';

export const insertIndustry = async (item: NewIndustry): Promise<Industry> => {
  const inserted = await writeDB.insert(industries).values(item).returning();
  return inserted[0];
};

export const getAllIndustrys = async (): Promise<Industry[]> => {
  return await readDB.select().from(industries);
};

export const getIndustryById = async (id: number): Promise<Industry | null> => {
  const result = await readDB.select().from(industries).where(eq(industries.id, id));
  return result[0] || null;
};

export const getIndustryByName = async (name: string): Promise<Industry | null> => {
  const result = await readDB.select().from(industries).where(eq(industries.name, name));
  return result[0] || null;
};

export const updateIndustry = async (id: number, updated: Partial<Industry>): Promise<Industry | null> => {
  const result = await writeDB.update(industries).set(updated).where(eq(industries.id, id)).returning();
  return result[0] || null;
};

export const deleteIndustry = async (id: number): Promise<Industry | null> => {
  const existing = await getIndustryById(id);
  if (existing) {
    await writeDB.delete(industries).where(eq(industries.id, id));
  }
  return existing;
};
