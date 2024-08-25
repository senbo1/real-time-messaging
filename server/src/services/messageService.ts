import { db } from '../drizzle/db';
import { desc, asc, eq } from 'drizzle-orm';
import { messagesTable } from '../drizzle/schema';

export const getLastMessage = async (conversationID: string) => {
  const [lastMessage] = await db
    .select({
      conversationId: messagesTable.conversationId,
      content: messagesTable.content,
      time: messagesTable.createdAt,
    })
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conversationID))
    .orderBy(desc(messagesTable.createdAt))
    .limit(1);

  return lastMessage;
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
  await db.insert(messagesTable).values(message);
};
