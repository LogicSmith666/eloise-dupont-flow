
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
  resetPassword: (email: string) => Promise<void>;
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
      
      // Check existing mock users first
      const mockUser = MOCK_USERS.find(u => u.email === email);
      
      // Check for newly registered users in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const registeredUser = registeredUsers.find((u: any) => u.email === email);
      
      // Validate credentials - either mock user with default password or registered user with matching password
      if ((mockUser && password === 'password') || (registeredUser && registeredUser.password === password)) {
        const loggedInUser = mockUser || registeredUser;
        
        // Set the user in state and localStorage
        setUser(loggedInUser);
        localStorage.setItem('eloiseUser', JSON.stringify(loggedInUser));
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${loggedInUser.name}!`,
        });
        
        // Redirect based on user role
        redirectToDashboard(loggedInUser.role);
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
      
      // Check if user already exists
      const existingMockUser = MOCK_USERS.some(u => u.email === email);
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const existingRegisteredUser = registeredUsers.some((u: any) => u.email === email);
      
      if (existingMockUser || existingRegisteredUser) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "User with this email already exists",
        });
        return;
      }
      
      // Create new user
      const newUser = {
        id: `reg-${Date.now()}`,
        name,
        email,
        role,
        firmId,
        firmName: firmId === '101' ? 'Finance Pro Inc.' : firmId === '102' ? 'Capital Solutions LLC' : undefined,
        password, // Store password for demo purposes
      };
      
      // Save to localStorage
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      toast({
        title: "Registration successful",
        description: "Account created successfully. You can now log in.",
      });
      
      navigate('/login');
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

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      
      // In a real app, make API call to initiate password reset
      // For MVP, just simulate success after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userExists = MOCK_USERS.some(u => u.email === email);
      
      // Always show success even if email doesn't exist (security best practice)
      console.log(`Password reset requested for ${email}, user exists: ${userExists}`);
      
      toast({
        title: "Password reset link sent",
        description: "If an account with this email exists, you will receive a password reset link.",
      });
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const redirectToDashboard = (role: UserRole) => {
    switch (role) {
      case 'superadmin':
        navigate('/super-admin/dashboard');
        break;
      case 'firmadmin':
        navigate('/firm-admin/dashboard');
        break;
      case 'broker':
        navigate('/broker/dashboard');
        break;
      default:
        navigate('/');
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
      resetPassword,
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
