import { useUser } from '@/hooks/useUser';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const ChatHeader = () => {
  const { user } = useUser();
  return (
    <div className="flex items-center p-4 border-b bg-gray-100">
      <Avatar>
        <AvatarImage src={user?.profilePicture} alt={user?.name} />
        <AvatarFallback>K</AvatarFallback>
      </Avatar>
      <div className="ml-4">
        <div className="font-bold">{user?.name}</div>
        <div className="text-sm text-muted-foreground">Typing...</div>
      </div>
    </div>
  );
};

export default ChatHeader;
