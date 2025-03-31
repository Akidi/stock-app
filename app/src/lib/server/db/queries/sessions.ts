import { type NewSession, type Session, tables } from '$lib/server/db/schema';
import { readDB, writeDB } from '$lib/server/db';
import { eq } from 'drizzle-orm';

const sessions = tables.sessions;

export const insertSession = async (newSession: NewSession): Promise<NewSession> => {
  const session = await writeDB.insert(sessions).values(newSession);
  return session[0];
};

export const getSession = async (id: string): Promise<Session | null> => {
  const session = await readDB.select().from(sessions).where(eq(sessions.id, id));
  return session[0] || null;
};

export const deleteSession = async (id: string): Promise<Session | null> => {
  const session = await writeDB.delete(sessions).where(eq(sessions.id, id));
  return session[0] || null;
};  

export const updateSession = async (id: string, expiresAt: Date): Promise<Session | null> => {
  const session = await writeDB.update(sessions).set({ expiresAt }).where(eq(sessions.id, id));
  return session[0] || null;
};

export const getSessions = async (userId: string): Promise<Session[]> => {
  return await readDB.select().from(sessions).where(eq(sessions.userId, userId));
};









