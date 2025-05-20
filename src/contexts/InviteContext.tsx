
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Invite } from '@/types/invite';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Mock initial invites
const MOCK_INVITES: Invite[] = [
  {
    id: 'inv1',
    email: 'firmadmin1@example.com',
    role: 'firmadmin',
    status: 'accepted',
    createdAt: '2023-05-10T10:00:00Z',
    firmId: '101',
    firmName: 'Finance Pro Inc.'
  },
  {
    id: 'inv2',
    email: 'firmadmin2@example.com',
    role: 'firmadmin',
    status: 'pending',
    createdAt: '2023-05-15T14:30:00Z',
    firmId: '102',
    firmName: 'Capital Solutions LLC'
  },
  {
    id: 'inv3',
    email: 'broker1@example.com',
    role: 'broker',
    status: 'accepted',
    createdAt: '2023-05-12T09:15:00Z',
    firmId: '101',
    firmName: 'Finance Pro Inc.'
  },
  {
    id: 'inv4',
    email: 'broker2@example.com',
    role: 'broker',
    status: 'declined',
    createdAt: '2023-05-14T16:45:00Z',
    firmId: '101',
    firmName: 'Finance Pro Inc.'
  },
  {
    id: 'inv5',
    email: 'broker3@example.com',
    role: 'broker',
    status: 'pending',
    createdAt: '2023-05-16T11:20:00Z',
    firmId: '102',
    firmName: 'Capital Solutions LLC'
  }
];

interface InviteContextType {
  invites: Invite[];
  loading: boolean;
  sendInvite: (email: string, role: 'firmadmin' | 'broker', firmId?: string) => Promise<void>;
  resendInvite: (id: string) => Promise<void>;
  cancelInvite: (id: string) => Promise<void>;
  getFirmInvites: (firmId: string) => Invite[];
  getAllInvites: () => Invite[];
}

const InviteContext = createContext<InviteContextType | undefined>(undefined);

export const InviteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invites, setInvites] = useState<Invite[]>(MOCK_INVITES);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const sendInvite = async (email: string, role: 'firmadmin' | 'broker', firmId?: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a new invite
      const newInvite: Invite = {
        id: `inv${Date.now()}`,
        email,
        role,
        status: 'pending',
        createdAt: new Date().toISOString(),
        firmId: firmId || user?.firmId,
        firmName: role === 'firmadmin' ? 
          // If it's a firm admin invite from super admin, use the firm name from the firmId
          MOCK_FIRMS.find(f => f.id === firmId)?.name : 
          // If it's a broker invite from firm admin, use the user's firm name
          user?.firmName
      };
      
      setInvites(prev => [...prev, newInvite]);
      
      toast({
        title: "Invite sent",
        description: `Invitation has been sent to ${email}`,
      });
      
      return;
    } catch (error) {
      console.error('Send invite error:', error);
      toast({
        variant: "destructive",
        title: "Failed to send invite",
        description: "An error occurred while sending the invitation",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendInvite = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the invite timestamp
      setInvites(prev => prev.map(invite => 
        invite.id === id ? { ...invite, createdAt: new Date().toISOString() } : invite
      ));
      
      const invite = invites.find(inv => inv.id === id);
      
      toast({
        title: "Invite resent",
        description: `Invitation has been resent to ${invite?.email}`,
      });
      
      return;
    } catch (error) {
      console.error('Resend invite error:', error);
      toast({
        variant: "destructive",
        title: "Failed to resend invite",
        description: "An error occurred while resending the invitation",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelInvite = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove the invite
      const invite = invites.find(inv => inv.id === id);
      setInvites(prev => prev.filter(invite => invite.id !== id));
      
      toast({
        title: "Invite cancelled",
        description: `Invitation to ${invite?.email} has been cancelled`,
      });
      
      return;
    } catch (error) {
      console.error('Cancel invite error:', error);
      toast({
        variant: "destructive",
        title: "Failed to cancel invite",
        description: "An error occurred while cancelling the invitation",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getFirmInvites = (firmId: string) => {
    return invites.filter(invite => invite.firmId === firmId);
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
      getFirmInvites,
      getAllInvites,
    }}>
      {children}
    </InviteContext.Provider>
  );
};

// Mock firms data needed for the context
const MOCK_FIRMS = [
  { id: '101', name: 'Finance Pro Inc.', brokers: 5, activeApplications: 24 },
  { id: '102', name: 'Capital Solutions LLC', brokers: 3, activeApplications: 17 },
  { id: '103', name: 'Funding Experts Group', brokers: 8, activeApplications: 32 },
  { id: '104', name: 'Business Capital Partners', brokers: 4, activeApplications: 21 },
];

export const useInvite = () => {
  const context = useContext(InviteContext);
  if (context === undefined) {
    throw new Error('useInvite must be used within an InviteProvider');
  }
  return context;
};
