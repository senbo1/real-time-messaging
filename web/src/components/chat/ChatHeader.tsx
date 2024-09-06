import { useSocket } from '@/hooks/useSocket';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dot } from 'lucide-react';
import { Recipient } from '@/lib/types';

type ChatHeaderProps = {
  recipient: Recipient | null;
};

const ChatHeader: React.FC<ChatHeaderProps> = ({ recipient }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !recipient) return;

    socket.emit('req-online-status', recipient.id);

    socket.on('online-status', (userId: string, isOnline: boolean) => {
      if (userId === recipient.id) {
        setIsOnline(isOnline);
      }
    });

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
      socket.off('online-status');
    };
  }, [socket, recipient]);

  if (!recipient) return null;
  return (
    <div className="flex items-center p-4 border-b bg-gray-100 h-20">
      <Avatar>
        <AvatarImage src={recipient.profilePicture} alt={recipient.name} />
        <AvatarFallback>{recipient.name[0]}</AvatarFallback>
      </Avatar>
      <div className="ml-4 flex flex-col justify-between">
        <div className="flex items-center">
          <div className="font-bold">{recipient.name}</div>
          {isOnline ? (
            <Dot className="text-green-500 -ml-2" size={40} />
          ) : (
            <Dot className="text-gray-500 -ml-2" size={40} />
          )}
        </div>

        {isTyping && (
          <div className="text-sm text-muted-foreground -mt-2">Typing...</div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
