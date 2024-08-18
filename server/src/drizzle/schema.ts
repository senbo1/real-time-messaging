import { relations } from 'drizzle-orm';
import { pgTable, text, uuid, timestamp, unique } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  googleId: text('google_id').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  profilePicture: text('profile_picture'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const conversationsTable = pgTable('conversation', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const messagesTable = pgTable('message', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id')
    .notNull()
    .references(() => conversationsTable.id),
  senderId: uuid('sender_id')
    .notNull()
    .references(() => usersTable.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userConversationsTable = pgTable(
  'user_conversation',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => conversationsTable.id),
    joinedAt: timestamp('joined_at').defaultNow(),
  },
  (table) => {
    return {
      uniqueUserConversation: unique('unique_user_conversation').on(
        table.userId,
        table.conversationId
      ),
    };
  }
);

export const userRelations = relations(usersTable, ({ many }) => ({
  messages: many(messagesTable),
  userConversations: many(userConversationsTable),
}));

export const conversationRelations = relations(
  conversationsTable,
  ({ many }) => ({
    messages: many(messagesTable),
    userConversations: many(userConversationsTable),
  })
);

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  conversation: one(conversationsTable, {
    fields: [messagesTable.conversationId],
    references: [conversationsTable.id],
  }),
  sender: one(usersTable, {
    fields: [messagesTable.senderId],
    references: [usersTable.id],
  }),
}));

export const userConversationsRelations = relations(
  userConversationsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [userConversationsTable.userId],
      references: [usersTable.id],
    }),
    conversation: one(conversationsTable, {
      fields: [userConversationsTable.conversationId],
      references: [conversationsTable.id],
    }),
  })
);
