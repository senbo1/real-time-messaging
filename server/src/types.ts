import { Socket } from 'socket.io';
import { NextFunction } from 'express';
import { IncomingMessage, ServerResponse } from 'http';

export type User = {
  id: string;
  googleId: string;
  name: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
};

export type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction
) => void;

export interface SocketWithUser extends Socket {
  request: IncomingMessage & { user?: User; _passport?: any };
  user?: User;
}
