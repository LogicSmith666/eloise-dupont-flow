
export type UserRole = 'superadmin' | 'firmadmin' | 'broker';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  firmId?: string;
  firmName?: string;
}

export interface PendingUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  pendingUser: PendingUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole, firmId?: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  verifyLoginCode: (code: string) => Promise<void>;
  resendLoginCode: () => Promise<void>;
  isAuthenticated: boolean;
}
