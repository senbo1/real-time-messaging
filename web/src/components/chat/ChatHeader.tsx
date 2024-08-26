import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User } from '@/lib/types';

type ChatHeaderProps = {
  recipient: User | null;
};

const ChatHeader: React.FC<ChatHeaderProps> = ({ recipient }) => {
  if (!recipient) return null;
  return (
    <div className="flex items-center p-4 border-b bg-gray-100">
      <Avatar>
        <AvatarImage src={recipient.profilePicture} alt={recipient.name} />
        <AvatarFallback>{recipient.name[0]}</AvatarFallback>
      </Avatar>
      <div className="ml-4">
        <div className="font-bold">{recipient.name}</div>
        <div className="text-sm text-muted-foreground">Typing...</div>
      </div>
    </div>
  );
};

export default ChatHeader;
