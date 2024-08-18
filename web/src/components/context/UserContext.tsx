import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User } from '@/lib/types';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/auth/user`,
          {
            withCredentials: true,
          }
        );
        setUser(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          window.location.href = '/signin';
        } else {
          setError(
            error instanceof Error
              ? error
              : new Error('An unknown error occurred')
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};