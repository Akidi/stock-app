import { readDB, writeDB } from '$lib/server/db';
import { users, type NewUser, type User } from '$lib/server/db/schema/users';
import { eq } from 'drizzle-orm';

export const insertUser = async (newUser: NewUser): Promise<User> => {
  const user = await writeDB.insert(users).values(newUser);
  return user[0];
};

export const getUsers = async (): Promise<User[]> => {
  return await readDB.select().from(users);
};

export const updateUser = async (id: string, updatedUser: User): Promise<User> => {
  const user = await writeDB.update(users).set(updatedUser).where(eq(users.id, id));
  return user[0];
};

export const deleteUser = async (id: string): Promise<User | null> => {
  const user = await getUserById(id);
  if (user) {
    await writeDB.delete(users).where(eq(users.id, id));
  }
  return user;
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
  const user = await readDB.select().from(users).where(eq(users.username, username));
  return user[0] || null;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const user = await readDB.select().from(users).where(eq(users.id, id));
  return user[0] || null  ;
};



