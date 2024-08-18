import session from 'express-session';

export const sessionMiddleware = session({
  name: 'session_id',
  secret: process.env.SESSION_SECRET!,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
});
