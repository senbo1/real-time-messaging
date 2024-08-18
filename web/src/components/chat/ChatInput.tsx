import { Paperclip, SendHorizonal } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const ChatInput = () => {
  return (
    <div className="p-4 border-t">
      <div className="flex items-center relative">
        <Input
          type="text"
          placeholder="Type your message here"
          className="flex-1 bg-gray-100 p-6 py-7 pr-28 border-0 text-xl placeholder:text-gray-400"
        />
        <div className="flex gap-2 absolute right-2">
          <Button variant="ghost" size="icon" className=" hover:bg-primary/10">
            {' '}
            <Paperclip className="w-6 h-6 text-primary" />
          </Button>
          <Button variant="ghost" size="icon" className=" hover:bg-primary/10">
            <SendHorizonal className="w-6 h-6 text-primary" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
