import { ServerResponse } from 'http';
import { Middleware } from '../types';
import { Socket } from 'socket.io';

export const wrap =
  (middleware: Middleware) => (socket: Socket, next: (err?: any) => void) =>
    middleware(socket.request, {} as ServerResponse, next);
