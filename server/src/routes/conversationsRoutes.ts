import { Router } from 'express';
import { db } from '../drizzle/db';
import { messagesTable } from '../drizzle/schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

router.get('/last-message/:conversationId', async (req, res) => {
  const { conversationId } = req.params;

  const lastMessage = await db
    .select({
      conversationId: messagesTable.conversationId,
      lastMessage: messagesTable.content,
      lastMessageTime: messagesTable.createdAt,
    })
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conversationId))
    .orderBy(desc(messagesTable.createdAt))
    .limit(1);
});

export default router;
