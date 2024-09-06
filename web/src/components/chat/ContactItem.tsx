import { Dot } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Message, Recipient } from '@/lib/types';
import { getRelativeTime } from '@/lib/time';
import axios from 'axios';

type ContactItemProps = {
  id: string;
  name: string;
  profilePicture?: string;
  conversationId: string;
  onUserSelect: (user: Recipient) => void;
};

const ContactItem: React.FC<ContactItemProps> = ({
  id,
  name,
  profilePicture,
  conversationId,
  onUserSelect,
}) => {
  const socket = useSocket();
  const [isOnline, setIsOnline] = useState(false);
  const [lastMessage, setLastMessage] = useState<Message | null>(null);

  const handleUserSelect = () => {
    onUserSelect({ id, name, profilePicture });
  };

  useEffect(() => {
    if (!socket) return;

    const fetchLastMessage = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/messages/${conversationId}/last-message`,
          {
            withCredentials: true,
          }
        );
        console.log(response);
        const message = response.data;
        console.log(message);
        if (message) {
          setLastMessage({ ...message, time: new Date(message.time) });
        }
      } catch (error) {
        console.error('Error fetching last message:', error);
      }
    };

    fetchLastMessage();

    socket.emit('req-online-status', id);

    socket.on('online-status', (userId: string, isOnline: boolean) => {
      if (userId === id) {
        setIsOnline(isOnline);
      }
    });

    socket.on('last-message', (message: Message) => {
      if (message.conversationId === conversationId) {
        setLastMessage({ ...message, time: new Date(message.time) });
      }
    });

    return () => {
      socket.off('online-status');
      socket.off('last-message');
    };
  }, [socket, conversationId, id]);

  return (
    <button
      className="flex items-center p-4 border-b hover:bg-gray-100 cursor-pointer w-full"
      onClick={handleUserSelect}
    >
      <Avatar>
        <AvatarImage src={profilePicture} alt="User" />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="ml-4">
        <div className="flex items-center justify-between">
          <div className="font-bold">{name}</div>
          {isOnline ? (
            <Dot className="text-green-500 -ml-2" size={40} />
          ) : (
            <Dot className="text-gray-500 -ml-2" size={40} />
          )}
          <p className="text-sm text-gray-500">
            {lastMessage?.time && getRelativeTime(lastMessage.time)}
          </p>
        </div>
        {lastMessage && (
          <div className="flex">
            <span className="text-gray-500 mr-1">
              {lastMessage.senderId === id ? name.split(' ')[0] : 'You'}:
            </span>
            <p className="text-md">{lastMessage.content}</p>
          </div>
        )}
      </div>
    </button>
  );
};

export default ContactItem;
