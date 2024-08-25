import { useContext } from 'react';
import { UserContext } from '@/components/context/UserContext';

export const useUser = () => useContext(UserContext);
