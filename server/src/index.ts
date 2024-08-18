import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
import 'dotenv/config';
import './config/passport';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

// socket io logic
io.on('connection', (socket) => {
  console.log('a user connected');
});

httpServer.listen(8080);
