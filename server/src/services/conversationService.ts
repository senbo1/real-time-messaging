import { db } from '../drizzle/db';
import { conversationsTable, userConversationsTable } from '../drizzle/schema';
import { and, eq } from 'drizzle-orm';

export const getConversation = async (userID: string, recipientID: string) => {
  const [conversation] = await db
    .select({
      conversationId: userConversationsTable.conversationId,
    })
    .from(userConversationsTable)
    .where(
      and(
        eq(userConversationsTable.userId, userID),
        eq(userConversationsTable.userId, recipientID)
      )
    )
    .limit(1);
  return conversation || null;
};

export const createConversation = async (
  userID: string,
  recipientID: string
) => {
  const [newConversation] = await db
    .insert(conversationsTable)
    .values({})
    .returning({
      conversationId: conversationsTable.id,
    });

  await db.insert(userConversationsTable).values([
    {
      userId: userID,
      conversationId: newConversation.conversationId,
    },
    {
      userId: recipientID,
      conversationId: newConversation.conversationId,
    },
  ]);

  return newConversation;
};
