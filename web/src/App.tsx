import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Search, SendHorizonal, Paperclip } from 'lucide-react';

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
    id: '3',
    name: 'Blocked',
    active: false,
  },
];

function Sidebar() {
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
}

function ChatHeader() {
  return (
    <div className="flex items-center p-4 border-b bg-gray-100">
      <Avatar>
        <AvatarImage src="/placeholder-user.jpg" alt="Kristine" />
        <AvatarFallback>K</AvatarFallback>
      </Avatar>
      <div className="ml-4">
        <div className="font-bold">Kristine</div>
        <div className="text-sm text-muted-foreground">Typing...</div>
      </div>
    </div>
  );
}

function ChatContainer() {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="mb-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          Hello, i wanted to know more about the product design position opened
          at Atlassian
        </div>
      </div>
      <div className="mb-4 text-right">
        <div className="bg-red-500 text-white p-4 rounded-lg inline-block">
          Sure, tell us. what do you wanna know?
        </div>
      </div>
      <div className="mb-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          Take this part of your letter seriously because it's likely one of
          your first genuine opportunities to make a personal, positive
          impression on a prospective employer. You want your words to invite
          them to keep reading and to convey exactly why you're the best choice
          for their open position. Review your language to ensure it's concise
          and informative. If you're applying to multiple positions, take great
          care to edit your letter so that the first paragraph is personal and
          relevant to the exact position you want.
        </div>
      </div>
      <div className="mb-4 text-right">
        <div className="bg-red-500 text-white p-4 rounded-lg inline-block">
          You've a good folio
        </div>
      </div>
      <div className="mb-4 text-right">
        <div className="bg-red-500 text-white p-4 rounded-lg inline-block">
          However we're looking for someone with a little more experience!
        </div>
        <div className="text-sm text-muted-foreground mt-1">3 days</div>
      </div>
    </div>
  );
}

function ChatInput() {
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
}

function App() {
  return (
    <main className="flex h-screen">
      <Sidebar />
      <section className="flex-1 flex flex-col">
        <ChatHeader />
        <ChatContainer />
        <ChatInput />
      </section>
    </main>
  );
}

export default App;
