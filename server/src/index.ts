import 'dotenv/config';
import './config/passport';
import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import { sessionMiddleware } from './middleware/authmiddleware';
import { wrap } from './utils/wrap';
import { Middleware, SocketWithUser } from './types';
import {
  createConversation,
  getConversation,
} from './services/conversationService';
import { getMessages, createMessage } from './services/messageService';
import { searchUsers } from './services/userService';

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
    socket.emit('user-online', userId);

    socket.on('join-conversation', async (receiverId: string) => {
      try {
        const existingConversation = await getConversation(userId, receiverId);
        let conversationId;

        if (existingConversation) {
          conversationId = existingConversation.conversationId;
        } else {
          const newConversation = await createConversation(userId, receiverId);
          conversationId = newConversation.conversationId;
        }

        socket.join(conversationId);
        onlineUsers.get(receiverId)?.join(conversationId);

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
          await createMessage({
            conversationId,
            senderId: userId,
            content: message,
          });

          socket.to(conversationId).emit('message-received', message);
        } catch (error) {
          console.error(error);
          socket.emit('error', error);
        }
      }
    );

    socket.on('search-users', async (email: string) => {
      const users = await searchUsers(email, userId);
      socket.emit('search-result', users);
    });

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
        console.log('typing', { conversationId, isTyping, userId });
        socket.to(conversationId).emit('typing', { isTyping, userId });
      }
    );
  }
});

httpServer.listen(8080);
