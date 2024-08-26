import { Paperclip, SendHorizonal } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useSocket } from '@/hooks/useSocket';
import { useState } from 'react';

type ChatInputProps = {
  conversationId: string | null;
};

const ChatInput = ({ conversationId }: ChatInputProps) => {
  const socket = useSocket();
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!socket || !conversationId) return;
    console.log('send-message', conversationId, message);
    socket.emit('send-message', conversationId, message);
    setMessage('');
  };

  const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
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
