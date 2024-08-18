import { Router } from 'express';
import { db } from '../drizzle/db';
import { userConversationsTable, usersTable } from '../drizzle/schema';
import { and, eq, ne } from 'drizzle-orm';
const router = Router();

router.get('/contacts', async (req, res) => {
  const userId = req.user!.id!;

  const recipients = await db
    .select({
      conversation_id: userConversationsTable.conversationId,
      recipient_id: usersTable.id,
      recipient_name: usersTable.name,
      recipient_profile_picture: usersTable.profilePicture,
    })
    .from(userConversationsTable)
    .innerJoin(
      userConversationsTable,
      and(
        eq(
          userConversationsTable.conversationId,
          userConversationsTable.conversationId
        ),
        ne(userConversationsTable.userId, userId)
      )
    )
    .innerJoin(usersTable, eq(usersTable.id, userConversationsTable.userId))
    .where(eq(userConversationsTable.userId, userId));

  return res.json(recipients);
});
