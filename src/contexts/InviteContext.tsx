
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from './AuthContext';

export interface Invite {
  id: string;
  email: string;
  role: UserRole;
  firmId?: string;
  firmName?: string;
  invitedBy: string;
  invitedAt: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: string;
}

// Mock invites data
const MOCK_INVITES: Invite[] = [
  {
    id: '1',
    email: 'admin@newfirm.com',
    role: 'Admin',
    firmId: '105',
    firmName: 'New Finance Firm',
    invitedBy: 'super@eloisedupont.com',
    invitedAt: '2024-01-15T10:00:00Z',
    status: 'pending',
    expiresAt: '2024-01-22T10:00:00Z',
  },
  {
    id: '2',
    email: 'broker@existingfirm.com',
    role: 'Broker',
    firmId: '101',
    firmName: 'Finance Pro Inc.',
    invitedBy: 'firm1@eloisedupont.com',
    invitedAt: '2024-01-14T14:30:00Z',
    status: 'pending',
    expiresAt: '2024-01-21T14:30:00Z',
  },
  {
    id: '3',
    email: 'accepted@broker.com',
    role: 'Broker',
    firmId: '102',
    firmName: 'Capital Solutions LLC',
    invitedBy: 'firm2@eloisedupont.com',
    invitedAt: '2024-01-10T09:15:00Z',
    status: 'accepted',
    expiresAt: '2024-01-17T09:15:00Z',
  },
  {
    id: '4',
    email: 'expired@invite.com',
    role: 'Broker',
    firmId: '103',
    firmName: 'Funding Experts Group',
    invitedBy: 'firm3@eloisedupont.com',
    invitedAt: '2024-01-05T16:45:00Z',
    status: 'expired',
    expiresAt: '2024-01-12T16:45:00Z',
  },
];

interface InviteContextType {
  invites: Invite[];
  createInvite: (invite: Omit<Invite, 'id' | 'invitedAt' | 'status' | 'expiresAt'>) => void;
  updateInviteStatus: (id: string, status: Invite['status']) => void;
  deleteInvite: (id: string) => void;
  getInvitesByRole: (role: UserRole) => Invite[];
  getAllInvites: () => Invite[];
}

const InviteContext = createContext<InviteContextType | undefined>(undefined);

export const InviteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invites, setInvites] = useState<Invite[]>(MOCK_INVITES);

  const createInvite = (inviteData: Omit<Invite, 'id' | 'invitedAt' | 'status' | 'expiresAt'>) => {
    const newInvite: Invite = {
      ...inviteData,
      id: Date.now().toString(),
      invitedAt: new Date().toISOString(),
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
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
