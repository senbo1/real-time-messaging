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

const onlineUsers: Map<string, string> = new Map();

io.on('connection', (socket: SocketWithUser) => {
  console.log('a user connected');
  const userId = socket.request.user?.id;
  console.log('userId', userId);

  if (userId) {
    onlineUsers.set(userId, socket.id);

    socket.emit('user-online', userId);
  }
});

httpServer.listen(8080);
