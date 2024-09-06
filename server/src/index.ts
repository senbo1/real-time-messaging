import 'dotenv/config';
import './config/passport';
import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import { isAuth, sessionMiddleware } from './middleware/authmiddleware';
import { wrap } from './utils/wrap';
import { Middleware, SocketWithUser } from './types';
import {
  createConversation,
  getConversation,
} from './services/conversationService';
import {
  getMessages,
  createMessage,
  getLastMessage,
} from './services/messageService';
import { getContacts, searchUsers } from './services/userService';
import messageRoutes from './routes/messageRoutes';

const app = express();
const httpServer = createServer(app);

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/users', isAuth, userRoutes);
app.use('/messages', isAuth, messageRoutes);

const io = new Server(httpServer, { cors: corsOptions });

io.use(wrap(sessionMiddleware as Middleware));
io.use(wrap(passport.initialize() as Middleware));
io.use(wrap(passport.session() as Middleware));

io.use((socket: Socket, next: (err?: any) => void) => {
  const socketWithUser = socket as SocketWithUser;
  if (socketWithUser.request) {
    next();
  } else {
    next(new Error('unauthorized'));
  }
});

const onlineUsers: Map<string, Socket> = new Map();

io.on('connection', (socket: SocketWithUser) => {
  console.log('a user connected');
  const userId = socket.request.user?.id;
  console.log('userId', userId);

  if (userId) {
    onlineUsers.set(userId, socket);

    io.emit('online-status', userId, true);

    socket.on('req-online-status', (userId: string) => {
      const isOnline = onlineUsers.has(userId);
      socket.emit('online-status', userId, isOnline);
    });

    socket.on('join-conversation', async (recipientId: string) => {
      try {
        const existingConversation = await getConversation(userId, recipientId);
        let conversationId;

        if (existingConversation) {
          conversationId = existingConversation.conversationId;
        } else {
          const newConversation = await createConversation(userId, recipientId);
          conversationId = newConversation.conversationId;
        }

        socket.join(conversationId);
        onlineUsers.get(recipientId)?.join(conversationId);

        socket.emit('conversation-joined', conversationId);

        const messages = await getMessages(conversationId);
        socket.emit('loading-messages', messages);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on(
      'send-message',
      async (conversationId: string, message: string) => {
        try {
          const newMessage = await createMessage({
            conversationId,
            senderId: userId,
            content: message,
          });

          io.to(conversationId).emit('message-received', newMessage);
        } catch (error) {
          console.error(error);
          socket.emit('error', error);
        }
      }
    );

    socket.on(
      'typing',
      ({
        conversationId,
        isTyping,
        userId,
      }: {
        conversationId: string;
        isTyping: boolean;
        userId: string;
      }) => {
        socket.to(conversationId).emit('typing', { isTyping, userId });
      }
    );

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('online-status', userId, false);
    });
  }
});

httpServer.listen(8080);
