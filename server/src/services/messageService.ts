import { db } from '../drizzle/db';
import { asc, eq, desc } from 'drizzle-orm';
import { messagesTable } from '../drizzle/schema';

export const getLastMessage = async (conversationId: string) => {
  const [lastMessage] = await db
    .select({
      conversationId: messagesTable.conversationId,
      senderId: messagesTable.senderId,
      messageId: messagesTable.id,
      content: messagesTable.content,
      time: messagesTable.createdAt,
    })
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conversationId))
    .orderBy(desc(messagesTable.createdAt))
    .limit(1);

  return lastMessage || null;
};

export const getMessages = async (conversationID: string) => {
  const messages = await db
    .select({
      conversationId: messagesTable.conversationId,
      senderId: messagesTable.senderId,
      messageId: messagesTable.id,
      content: messagesTable.content,
      time: messagesTable.createdAt,
    })
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conversationID))
    .orderBy(asc(messagesTable.createdAt));

  return messages;
};

export const createMessage = async (message: {
  conversationId: string;
  senderId: string;
  content: string;
}) => {
  const [newMessage] = await db
    .insert(messagesTable)
    .values(message)
    .returning({
      conversationId: messagesTable.conversationId,
      senderId: messagesTable.senderId,
      messageId: messagesTable.id,
      content: messagesTable.content,
      time: messagesTable.createdAt,
    });
  return newMessage;
};
