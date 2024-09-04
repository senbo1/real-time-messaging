export type User = {
  id: string;
  googleId: string;
  name: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
};

export type Recipient = {
  id: string;
  name: string;
  profilePicture?: string;
};

export type Contact = {
  conversationId: string;
  id: string;
  name: string;
  profilePicture?: string;
};

export type Message = {
  conversationId: string;
  senderId: string;
  messageId: string;
  content: string;
  time: Date;
};
