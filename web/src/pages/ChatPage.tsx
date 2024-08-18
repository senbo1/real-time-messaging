import React from 'react';
import axios from 'axios';
import { UserProvider } from '@/components/context/UserContext';
import { useUser } from '@/hooks/useUser';
import ChatContainer from '@/components/chat/ChatContainer';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import Sidebar from '@/components/chat/Sidebar';
import { Button } from '@/components/ui/button';

const ChatPageContent: React.FC = () => {
  const { loading, error } = useUser();

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
        <Sidebar />
        <section className="flex-1 flex flex-col">
          <ChatHeader />
          <ChatContainer />
          <ChatInput />
        </section>
      </main>
    </main>
  );
};

function ChatPage() {
  return (
    <UserProvider>
      <ChatPageContent />
    </UserProvider>
  );
}

export default ChatPage;
