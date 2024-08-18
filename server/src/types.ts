import { IncomingMessage } from 'http';

export type User = {
  id: string;
  googleId: string;
  name: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
};

export interface IncomingMessageWithUser extends IncomingMessage {
  user?: User;
}
