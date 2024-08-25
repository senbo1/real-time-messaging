import { userConversationsTable, usersTable } from '../drizzle/schema';
import { and, eq, ne, like } from 'drizzle-orm';
import { db } from '../drizzle/db';

export const getContacts = async (userID: string) => {
  const recipients = await db
    .select({
      conversationId: userConversationsTable.conversationId,
      recipientId: usersTable.id,
      recipientName: usersTable.name,
      recipientProfilePicture: usersTable.profilePicture,
    })
    .from(userConversationsTable)
    .innerJoin(
      userConversationsTable,
      and(
        eq(
          userConversationsTable.conversationId,
          userConversationsTable.conversationId
        ),
        ne(userConversationsTable.userId, userID)
      )
    )
    .innerJoin(usersTable, eq(usersTable.id, userConversationsTable.userId))
    .where(eq(userConversationsTable.userId, userID));

  return recipients;
};

export const searchUsers = async (email: string, userId: string) => {
  const users = await db
    .select()
    .from(usersTable)
    .where(and(like(usersTable.email, `%${email}%`), ne(usersTable.id, userId)))
    .limit(3);

  return users || null;
};
