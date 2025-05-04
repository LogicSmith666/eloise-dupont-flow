
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

export type UserRole = 'superadmin' | 'firmadmin' | 'broker';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  firmId?: string;
  firmName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole, firmId?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demonstration
const MOCK_USERS: User[] = [
  { id: '1', name: 'Super Admin', email: 'super@eloisedupont.com', role: 'superadmin' },
  { id: '2', name: 'Firm Admin 1', email: 'firm1@eloisedupont.com', role: 'firmadmin', firmId: '101', firmName: 'Finance Pro Inc.' },
  { id: '3', name: 'Broker 1', email: 'broker1@eloisedupont.com', role: 'broker', firmId: '101', firmName: 'Finance Pro Inc.' },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for logged-in user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('eloiseUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // In a real app, make API call to validate credentials
      // For MVP, we'll use our mock data
      const mockUser = MOCK_USERS.find(u => u.email === email);
      
      if (mockUser && password === 'password') { // Simple password check for demo
        setUser(mockUser);
        localStorage.setItem('eloiseUser', JSON.stringify(mockUser));
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${mockUser.name}!`,
        });

        // Redirect based on user role
        switch (mockUser.role) {
          case 'superadmin':
            navigate('/admin/dashboard');
            break;
          case 'firmadmin':
            navigate('/firm/dashboard');
            break;
          case 'broker':
            navigate('/broker/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An error occurred during login",
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole, firmId?: string) => {
    try {
      setLoading(true);
      
      // In a real app, make API call to register user
      // For MVP, we'll just simulate success
      
      // Generate a mock user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        firmId,
        firmName: firmId === '101' ? 'Finance Pro Inc.' : undefined
      };
      
      // In a real app, this would be created in the database
      // For now, just add to local storage
      setUser(newUser);
      localStorage.setItem('eloiseUser', JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome to Éloïse Dupont, ${name}!`,
      });

      // Redirect based on user role
      switch (role) {
        case 'superadmin':
          navigate('/admin/dashboard');
          break;
        case 'firmadmin':
          navigate('/firm/dashboard');
          break;
        case 'broker':
          navigate('/broker/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An error occurred during registration",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('eloiseUser');
    setUser(null);
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
