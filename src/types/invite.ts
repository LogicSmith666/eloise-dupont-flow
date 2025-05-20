
import { UserRole } from "@/contexts/AuthContext";

export interface Invite {
  id: string;
  email: string;
  role: UserRole;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  firmId?: string;
  firmName?: string;
}
