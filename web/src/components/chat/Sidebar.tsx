import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { useSocket } from '@/hooks/useSocket';
import { debounce } from '@/lib/debounce';

const filters = [
  {
    id: '1',
    name: 'All',
    active: true,
  },
  {
    id: '2',
    name: 'Unread',
    active: false,
  },
  {
    id: '3',
    name: 'Archived',
    active: false,
  },
  {
    id: '4',
    name: 'Blocked',
    active: false,
  },
];

const Sidebar = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();

  const debouncedSearch = debounce((query: string) => {
    if (!socket) return;
    socket.emit('search-users', query);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (query.length === 0) {
      setUsers(null);
      setSearch('');
      setLoading(false);
      return;
    }
    setSearch(query);
    debouncedSearch(query);
    setLoading(true);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on('search-result', (results: User[]) => {
      setUsers(results);
      setLoading(false);
    });

    return () => {
      socket.off('search-result');
    };
  }, [socket]);

  return (
    <section className="w-1/3 border-r flex flex-col">
      <div className="p-4 flex flex-col justify-center relative border-b">
        <div className="flex items-center">
          <Search className="absolute left-8" />
          <Input
            type="search"
            placeholder="Search by email"
            className="w-full p-5 py-6 pl-12 border-zinc-300 border-solid border-2 text-lg placeholder:font-medium rounded-b-none"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        {search && (
          <div className="border-2 rounded-b-md">
            {loading ? (
              <div className="text-muted-foreground p-3">Loading...</div>
            ) : users && users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center p-3 hover:bg-zinc-100 cursor-pointer"
                >
                  <Avatar className="mr-3">
                    <AvatarImage src={user.profilePicture} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground p-3">No users found</div>
            )}
          </div>
        )}
      </div>
      <div className="lg:flex gap-3 p-2 ml-2 border-b py-4 hidden">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={filter.active ? 'default' : 'outline'}
            className="rounded-3xl px-3 py-1 h-auto"
          >
            {filter.name}
          </Button>
        ))}
      </div>
      <div className="overflow-y-scroll flex-grow">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-start p-4 border-b">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <div className="font-bold">User {i + 1}</div>
              <div className="text-sm text-muted-foreground">11 days</div>
              <div className="mt-1">
                User {i + 1}: Hello, I wanted to know more about the product
                design position opened at Atlassian.
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Sidebar;
