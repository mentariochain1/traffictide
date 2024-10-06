'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextType {
  userTickets: number;
  updateUserTickets: (newTickets: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userTickets, setUserTickets] = useState(0);

  const updateUserTickets = (newTickets: number) => {
    setUserTickets(newTickets);
  };

  return (
    <UserContext.Provider value={{ userTickets, updateUserTickets }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};