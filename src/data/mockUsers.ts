
import { User } from '@/types/auth.types';

// Mock data for demonstration
export const MOCK_USERS: User[] = [
  { id: '1', name: 'Super Admin', email: 'super@eloisedupont.com', role: 'superadmin' },
  { id: '2', name: 'Firm Admin 1', email: 'firm1@eloisedupont.com', role: 'firmadmin', firmId: '101', firmName: 'Finance Pro Inc.' },
  { id: '3', name: 'Broker 1', email: 'broker1@eloisedupont.com', role: 'broker', firmId: '101', firmName: 'Finance Pro Inc.' },
];
