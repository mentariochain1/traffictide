'use client';

import { ColorProvider } from '@/contexts/ColorContext';
import { UserProvider } from '@/contexts/UserContext';

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <UserProvider>
      <ColorProvider>{children}</ColorProvider>
    </UserProvider>
  );
};