import { Request, Response, NextFunction } from 'express';
import session from 'express-session';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

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
