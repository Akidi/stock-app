import { readDB, writeDB } from '$lib/server/db';
import { logs, type Log, type NewLog, } from '$lib/server/db/schema/logs';
import { desc, eq, asc } from 'drizzle-orm';

export const insertLog = async (entry: NewLog): Promise<Log[]> => {
  const log = await writeDB.insert(logs).values(entry);
  return log[0];
}

export const getRecentLogs = async (limit = 20): Promise<Log[]> => {
  return await readDB.select().from(logs).orderBy(desc(logs.insertedAt)).limit(limit);
}

export const getLogById = async (id: string): Promise<Log[]> => {
  return await readDB.select().from(logs).where(eq(logs.id, parseInt(id)));
};

export const getLogsByUserId = async (userId: string, limit = 20, sort = 'desc'): Promise<Log[]> => {
  return await readDB.select().from(logs).where(eq(logs.dbUser, userId)).orderBy(sort === 'desc' ? desc(logs.insertedAt) : asc(logs.insertedAt)).limit(limit);
};