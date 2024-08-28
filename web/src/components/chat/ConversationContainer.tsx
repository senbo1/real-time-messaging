import { useSocket } from '@/hooks/useSocket';
import { useUser } from '@/hooks/useUser';
import { Message, User } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';
import ChatInput from './ChatInput';
import { cn } from '@/lib/utils';

type ConversationContainerProps = {
  recipient: User | null;
};

const ConversationContainer: React.FC<ConversationContainerProps> = ({
  recipient,
}) => {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();
  const { user } = useUser();

  useEffect(() => {
    if (!socket || !recipient) return;

    socket.emit('join-conversation', recipient.id);

    socket.on('conversation-joined', (conversationId: string) => {
      setConversationId(conversationId);
    });

    socket.on('loading-messages', (messages: Message[]) => {
      setMessages(messages);
    });

    socket.on('message-received', (message: Message) => {
      setMessages((prevMessages) => [...(prevMessages || []), message]);
    });

    return () => {
      socket.off('conversation-joined');
      socket.off('loading-messages');
      socket.off('message-received');
    };
  }, [socket, recipient]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!recipient) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">No chat selected</h2>
          <p className="text-gray-600">
            Select a chat or start a new conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        {user &&
          messages &&
          messages.length > 0 &&
          messages.map(({ senderId, content }, index: number) => (
            <div
              key={index}
              className={cn('mb-4', senderId === user.id ? 'text-right' : '')}
            >
              <div
                className={cn(
                  'p-4 rounded-lg inline-block',
                  senderId === user.id ? 'bg-primary text-white' : 'bg-gray-100'
                )}
              >
                {content}
              </div>
              {/* <div className="text-sm text-muted-foreground mt-1">
                {new Date(time).toLocaleString()}
              </div> */}
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput conversationId={conversationId} />
    </>
  );
};

export default ConversationContainer;
