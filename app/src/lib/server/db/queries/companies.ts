import { readDB, writeDB } from '$lib/server/db';
import { companies, type Company, type NewCompany } from '$lib/server/db/schema/companies';
import { eq } from 'drizzle-orm';

export const insertCompany = async (item: NewCompany): Promise<Company> => {
  const inserted = await writeDB.insert(companies).values(item).returning();
  return inserted[0];
};

export const getAllCompanys = async (): Promise<Company[]> => {
  return await readDB.select().from(companies);
};

export const getCompanyById = async (id: number): Promise<Company | null> => {
  const result = await readDB.select().from(companies).where(eq(companies.id, id));
  return result[0] || null;
};

export const getCompanyByName = async (name: string): Promise<Company | null> => {
  const result = await readDB.select().from(companies).where(eq(companies.name, name));
  return result[0] || null;
};

export const updateCompany = async (id: number, updated: Partial<Company>): Promise<Company | null> => {
  const result = await writeDB.update(companies).set(updated).where(eq(companies.id, id)).returning();
  return result[0] || null;
};

export const deleteCompany = async (id: number): Promise<Company | null> => {
  const existing = await getCompanyById(id);
  if (existing) {
    await writeDB.delete(companies).where(eq(companies.id, id));
  }
  return existing;
};
