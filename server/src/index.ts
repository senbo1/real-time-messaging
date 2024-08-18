import 'dotenv/config';
import './config/passport';
import express, { NextFunction } from 'express';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import conversationsRoute from './routes/conversationsRoutes';
import { sessionMiddleware } from './middleware/session';
import { Middleware, onlyForHandshake } from './middleware/onlyForHandshake';
import { IncomingMessageWithUser } from './types';
import { isAuth } from './middleware/auth';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Middleware setup
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/conversations', isAuth, conversationsRoute);

// Socket.io middleware setup
io.engine.use(onlyForHandshake(sessionMiddleware as Middleware));
io.engine.use(onlyForHandshake(passport.session()));
io.engine.use(
  onlyForHandshake(
    (req: IncomingMessageWithUser, res: ServerResponse, next: NextFunction) => {
      if (req.user) {
        next();
      } else {
        res.writeHead(401);
        res.end();
      }
    }
  )
);

io.on('connection', (socket) => {
  console.log('a user connected');
  const userId = (socket.request as IncomingMessageWithUser).user?.id;
});

httpServer.listen(8080);
