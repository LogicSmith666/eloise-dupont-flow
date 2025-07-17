
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from './AuthContext';
import { Invite } from '@/types/invite';

// Mock invites data - updated to match the Invite interface from types
const MOCK_INVITES: Invite[] = [
  {
    id: '1',
    email: 'admin@newfirm.com',
    role: 'Admin',
    firmId: '105',
    firmName: 'New Finance Firm',
    status: 'pending',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'processor@existingfirm.com',
    role: 'Processor',
    firmId: '101',
    firmName: 'Finance Pro Inc.',
    status: 'pending',
    createdAt: '2024-01-14T14:30:00Z',
  },
  {
    id: '3',
    email: 'accepted@processor.com',
    role: 'Processor',
    firmId: '102',
    firmName: 'Capital Solutions LLC',
    status: 'accepted',
    createdAt: '2024-01-10T09:15:00Z',
  },
  {
    id: '4',
    email: 'declined@invite.com',
    role: 'Processor',
    firmId: '103',
    firmName: 'Funding Experts Group',
    status: 'declined',
    createdAt: '2024-01-05T16:45:00Z',
  },
];

interface InviteContextType {
  invites: Invite[];
  loading: boolean;
  sendInvite: (email: string, role: UserRole, firmId?: string) => Promise<void>;
  resendInvite: (id: string) => Promise<void>;
  cancelInvite: (id: string) => Promise<void>;
  createInvite: (invite: Omit<Invite, 'id' | 'createdAt' | 'status'>) => void;
  updateInviteStatus: (id: string, status: Invite['status']) => void;
  deleteInvite: (id: string) => void;
  getInvitesByRole: (role: UserRole) => Invite[];
  getAllInvites: () => Invite[];
}

const InviteContext = createContext<InviteContextType | undefined>(undefined);

export const InviteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invites, setInvites] = useState<Invite[]>(MOCK_INVITES);
  const [loading, setLoading] = useState(false);

  const sendInvite = async (email: string, role: UserRole, firmId?: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const firmName = firmId ? `Firm ${firmId}` : undefined;
      
      const newInvite: Invite = {
        id: Date.now().toString(),
        email,
        role,
        firmId,
        firmName,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      setInvites(prev => [...prev, newInvite]);
    } finally {
      setLoading(false);
    }
  };

  const resendInvite = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would resend the invite
      console.log(`Resending invite ${id}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelInvite = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInvites(prev => prev.filter(invite => invite.id !== id));
    } finally {
      setLoading(false);
    }
  };

  const createInvite = (inviteData: Omit<Invite, 'id' | 'createdAt' | 'status'>) => {
    const newInvite: Invite = {
      ...inviteData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    
    setInvites(prev => [...prev, newInvite]);
  };

  const updateInviteStatus = (id: string, status: Invite['status']) => {
    setInvites(prev => prev.map(invite => 
      invite.id === id ? { ...invite, status } : invite
    ));
  };

  const deleteInvite = (id: string) => {
    setInvites(prev => prev.filter(invite => invite.id !== id));
  };

  const getInvitesByRole = (role: UserRole) => {
    return invites.filter(invite => invite.role === role);
  };

  const getAllInvites = () => {
    return invites;
  };

  return (
    <InviteContext.Provider value={{
      invites,
      loading,
      sendInvite,
      resendInvite,
      cancelInvite,
      createInvite,
      updateInviteStatus,
      deleteInvite,
      getInvitesByRole,
      getAllInvites,
    }}>
      {children}
    </InviteContext.Provider>
  );
};

export const useInvite = () => {
  const context = useContext(InviteContext);
  if (context === undefined) {
    throw new Error('useInvite must be used within an InviteProvider');
  }
  return context;
};
