import React, { useEffect } from 'react';
import axios from 'axios';
import ConversationContainer from '@/components/chat/ConversationContainer';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import Sidebar from '@/components/chat/Sidebar';
import { Button } from '@/components/ui/button';
import { UserProvider } from '@/components/context/UserContext';
import { useUser } from '@/hooks/useUser';
import { SocketProvider } from '@/components/context/SocketContext';
import { useSocket } from '@/hooks/useSocket';

const ChatPageContent: React.FC = () => {
  const { loading, error } = useUser();
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('connected');
      });
    }
  }, [socket]);

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
          <ConversationContainer />
          <ChatInput />
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
