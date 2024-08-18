import { IncomingMessage, ServerResponse } from 'http';
import { NextFunction } from 'express';
import { User } from '../types';

export type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction
) => void;

export function onlyForHandshake(middleware: Middleware) {
  return (
    req: IncomingMessage & { _query: any; user?: User },
    res: ServerResponse,
    next: NextFunction
  ) => {
    const isHandshake = req._query.sid === undefined;
    if (isHandshake) {
      middleware(req, res, next);
    } else {
      next();
    }
  };
}
