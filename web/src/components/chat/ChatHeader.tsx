import { useSocket } from '@/hooks/useSocket';
import { useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type ChatHeaderProps = {
  recipient: User | null;
};

const ChatHeader: React.FC<ChatHeaderProps> = ({ recipient }) => {
  const [isTyping, setIsTyping] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !recipient) return;
    socket.on(
      'typing',
      ({ isTyping, userId }: { isTyping: boolean; userId: string }) => {
        if (userId === recipient.id) {
          setIsTyping(isTyping);
        }
      }
    );

    return () => {
      socket.off('typing');
    };
  }, [socket, recipient]);

  if (!recipient) return null;
  return (
    <div className="flex items-center p-4 border-b bg-gray-100">
      <Avatar>
        <AvatarImage src={recipient.profilePicture} alt={recipient.name} />
        <AvatarFallback>{recipient.name[0]}</AvatarFallback>
      </Avatar>
      <div className="ml-4">
        <div className="font-bold">{recipient.name}</div>
        {isTyping && (
          <div className="text-sm text-muted-foreground">Typing...</div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
