import { type NewPing, type Ping, tables } from '$lib/server/db/schema';
import { readDB, writeDB } from '$lib/server/db';
import { eq } from 'drizzle-orm';

const pings = tables.pings;

export const insertPing = async (newPing: NewPing): Promise<NewPing> => {
  const ping = await writeDB.insert(pings).values(newPing);
  return ping[0];
};

export const getPing = async (): Promise<Ping[] | null> => {
  return await readDB.select().from(pings);
}

export const getPingByLabel = async(label: string): Promise<Ping | null> =>{
  const ping = await readDB.select().from(pings).where(eq(pings.label, label));
  return ping[0];
}