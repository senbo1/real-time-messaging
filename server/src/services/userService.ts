import { userConversationsTable, usersTable } from '../drizzle/schema';
import { and, eq, ne, like } from 'drizzle-orm';
import { db } from '../drizzle/db';
import { alias } from 'drizzle-orm/pg-core';

export const getContacts = async (userID: string) => {
  const userConversations2 = alias(
    userConversationsTable,
    'userConversations2'
  );

  const contacts = await db
    .select({
      conversationId: userConversationsTable.conversationId,
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      profilePicture: usersTable.profilePicture,
    })
    .from(userConversationsTable)
    .innerJoin(
      userConversations2,
      eq(
        userConversationsTable.conversationId,
        userConversations2.conversationId
      )
    )
    .innerJoin(usersTable, eq(usersTable.id, userConversations2.userId))
    .where(
      and(
        eq(userConversationsTable.userId, userID),
        ne(userConversations2.userId, userID)
      )
    );

  return contacts || null;
};

export const searchUsers = async (email: string, userId: string) => {
  const users = await db
    .select()
    .from(usersTable)
    .where(and(like(usersTable.email, `%${email}%`), ne(usersTable.id, userId)))
    .limit(3);

  return users || null;
};
