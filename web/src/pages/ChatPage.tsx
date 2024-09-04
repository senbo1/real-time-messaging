import React, { useState } from 'react';
import axios from 'axios';
import ConversationContainer from '@/components/chat/ConversationContainer';
import ChatHeader from '@/components/chat/ChatHeader';
import Sidebar from '@/components/chat/Sidebar';
import { Button } from '@/components/ui/button';
import { UserProvider } from '@/components/context/UserContext';
import { useUser } from '@/hooks/useUser';
import { SocketProvider } from '@/components/context/SocketContext';
import { Recipient } from '@/lib/types';

const ChatPageContent: React.FC = () => {
  const { loading, error } = useUser();
  const [recipient, setRecipient] = useState<Recipient | null>(null);

  const handleUserSelect = (recipient: Recipient) => {
    setRecipient(recipient);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const logout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/logout`);
      window.location.href = '/signin';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex flex-col h-screen">
      <Button className="rounded-none h-[4%]" onClick={logout}>
        Log Out
      </Button>
      <main className="flex h-[96%]">
        <Sidebar onUserSelect={handleUserSelect} />
        <section className="flex-1 flex flex-col">
          <ChatHeader recipient={recipient} />
          <ConversationContainer recipient={recipient} />
        </section>
      </main>
    </main>
  );
};

function ChatPage() {
  return (
    <UserProvider>
      <SocketProvider>
        <ChatPageContent />
      </SocketProvider>
    </UserProvider>
  );
}

export default ChatPage;
