import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  return (
    <section className="w-1/3 border-r flex flex-col">
      <div className="p-4 flex items-center relative border-b">
        <Search className="absolute left-8" />
        <Input
          type="search"
          placeholder="Search"
          className="w-full p-5 py-6 pl-12 border-zinc-300 border-solid border-2 text-lg placeholder:font-medium"
        />
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
