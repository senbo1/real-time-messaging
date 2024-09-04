import { alias } from 'drizzle-orm/pg-core';
import { db } from '../drizzle/db';
import { conversationsTable, userConversationsTable } from '../drizzle/schema';
import { and, eq } from 'drizzle-orm';

export const getConversation = async (userID: string, recipientID: string) => {
  const userConversations2 = alias(
    userConversationsTable,
    'userConversations2'
  );

  const [conversation] = await db
    .select({
      conversationId: userConversationsTable.conversationId,
      senderId: userConversationsTable.userId,
      recipientId: userConversations2.userId,
    })
    .from(userConversationsTable)
    .innerJoin(
      userConversations2,
      eq(
        userConversationsTable.conversationId,
        userConversations2.conversationId
      )
    )
    .where(
      and(
        eq(userConversationsTable.userId, userID),
        eq(userConversations2.userId, recipientID)
      )
    );

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
