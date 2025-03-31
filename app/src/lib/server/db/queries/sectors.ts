import { readDB, writeDB } from '$lib/server/db';
import { sectors, type Sector, type NewSector } from '$lib/server/db/schema/sectors';
import { eq } from 'drizzle-orm';

export const insertSector = async (item: NewSector): Promise<Sector> => {
  const inserted = await writeDB.insert(sectors).values(item).returning();
  return inserted[0];
};

export const getAllSectors = async (): Promise<Sector[]> => {
  return await readDB.select().from(sectors);
};

export const getSectorById = async (id: number): Promise<Sector | null> => {
  const result = await readDB.select().from(sectors).where(eq(sectors.id, id));
  return result[0] || null;
};

export const getSectorByName = async (name: string): Promise<Sector | null> => {
  const result = await readDB.select().from(sectors).where(eq(sectors.name, name));
  return result[0] || null;
};

export const updateSector = async (id: number, updated: Partial<Sector>): Promise<Sector | null> => {
  const result = await writeDB.update(sectors).set(updated).where(eq(sectors.id, id)).returning();
  return result[0] || null;
};

export const deleteSector = async (id: number): Promise<Sector | null> => {
  const existing = await getSectorById(id);
  if (existing) {
    await writeDB.delete(sectors).where(eq(sectors.id, id));
  }
  return existing;
};
