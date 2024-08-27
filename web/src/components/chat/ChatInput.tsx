import { Paperclip, SendHorizonal } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useSocket } from '@/hooks/useSocket';
import { useRef, useState } from 'react';
import { useUser } from '@/hooks/useUser';

type ChatInputProps = {
  conversationId: string | null;
};

const ChatInput = ({ conversationId }: ChatInputProps) => {
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const { user } = useUser();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSendMessage = () => {
    if (!socket || !conversationId) return;
    socket.emit('send-message', conversationId, message);
    setMessage('');
  };

  const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (socket && conversationId) {
      socket.emit('typing', {
        conversationId,
        isTyping: true,
        userId: user?.id,
      });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        socket.emit('typing', {
          conversationId,
          isTyping: false,
          userId: user?.id,
        });
      }, 1000);
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex items-center relative">
        <Input
          type="text"
          placeholder="Type your message here"
          className="flex-1 bg-gray-100 p-6 py-7 pr-28 border-0 text-xl placeholder:text-gray-400"
          value={message}
          onChange={handleMessageInput}
        />
        <div className="flex gap-2 absolute right-2">
          <Button variant="ghost" size="icon" className=" hover:bg-primary/10">
            <Paperclip className="w-6 h-6 text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className=" hover:bg-primary/10"
            onClick={handleSendMessage}
            type="submit"
          >
            <SendHorizonal className="w-6 h-6 text-primary" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
