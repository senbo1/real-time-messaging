import { User } from '@/lib/types';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import axios from 'axios';

type SearchProps = {
  onUserSelect: (user: User) => void;
};

const SearchBox: React.FC<SearchProps> = ({ onUserSelect }) => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(search);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
  };

  useEffect(() => {
    const searchUsers = async () => {
      if (debouncedSearch.length === 0) {
        setUsers(null);
        setLoading(false);
      } else {
        setLoading(true);
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/users/search`,
            {
              params: {
                email: debouncedSearch,
              },
              withCredentials: true,
            }
          );
          console.log(response.data);
          setUsers(response.data);
        } catch (error) {
          console.error('Error searching users:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    searchUsers();
  }, [debouncedSearch]);

  const handleUserSelect = (user: User) => {
    onUserSelect(user);
    setSearch('');
  };

  return (
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
          {loading && !users ? (
            <div className="text-muted-foreground p-3">Loading...</div>
          ) : users && users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-3 hover:bg-zinc-100 cursor-pointer"
                onClick={() => handleUserSelect(user)}
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
  );
};

export default SearchBox;
