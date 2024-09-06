import { Button } from '../ui/button';
import { Contact, Recipient } from '@/lib/types';
import SearchBox from './Search';
import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import ContactItem from './ContactItem';
import axios from 'axios';

type SidebarProps = {
  onUserSelect: (user: Recipient) => void;
};

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

const Sidebar: React.FC<SidebarProps> = ({ onUserSelect }) => {
  const { user } = useUser();
  const [contacts, setContacts] = useState<Contact[] | null>(null);

  useEffect(() => {
    console.log('contacts', contacts);
  }, [contacts]);

  useEffect(() => {
    if (!user) return;

    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/users/contacts`,
          {
            withCredentials: true,
          }
        );
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, [user]);

  return (
    <section className="w-1/3 border-r flex flex-col">
      <SearchBox onUserSelect={onUserSelect} />
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
        {contacts && contacts.length > 0 ? (
          contacts.map(({ id, name, profilePicture, conversationId }) => (
            <ContactItem
              key={id}
              id={id}
              name={name}
              profilePicture={profilePicture}
              conversationId={conversationId}
              onUserSelect={onUserSelect}
            />
          ))
        ) : (
          <div>No contacts</div>
        )}
      </div>
    </section>
  );
};

export default Sidebar;
