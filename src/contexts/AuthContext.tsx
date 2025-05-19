
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

interface PendingUser {
  id: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demonstration
const MOCK_USERS: User[] = [
  { id: '1', name: 'Super Admin', email: 'super@eloisedupont.com', role: 'superadmin' },
  { id: '2', name: 'Firm Admin 1', email: 'firm1@eloisedupont.com', role: 'firmadmin', firmId: '101', firmName: 'Finance Pro Inc.' },
  { id: '3', name: 'Broker 1', email: 'broker1@eloisedupont.com', role: 'broker', firmId: '101', firmName: 'Finance Pro Inc.' },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pendingUser, setPendingUser] = useState<PendingUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check for logged-in user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('eloiseUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Generate a random 6-digit code
  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // In a real app, make API call to validate credentials
      // For MVP, we'll use our mock data
      const mockUser = MOCK_USERS.find(u => u.email === email);
      
      if (mockUser && password === 'password') { // Simple password check for demo
        // Instead of directly setting the user, we'll set a pending user
        setPendingUser({
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
        });
        
        // Generate and "send" verification code
        const code = generateCode();
        setVerificationCode(code);
        
        console.log(`Verification code for ${email}: ${code}`); // For demo only
        
        toast({
          title: "Verification required",
          description: `Please enter the 6-digit code sent to ${email}`,
        });
        
        navigate('/verify-code');
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

  const verifyLoginCode = async (code: string) => {
    try {
      setLoading(true);
      
      // In a real app, verify against an API
      // For MVP, we'll just compare against the stored code
      if (code === verificationCode && pendingUser) {
        // Find the full user data
        const fullUser = MOCK_USERS.find(u => u.id === pendingUser.id);
        
        if (fullUser) {
          setUser(fullUser);
          localStorage.setItem('eloiseUser', JSON.stringify(fullUser));
          setPendingUser(null);
          setVerificationCode(null);
          
          toast({
            title: "Login successful",
            description: `Welcome back, ${fullUser.name}!`,
          });
          
          // Redirect based on user role
          switch (fullUser.role) {
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
        }
      } else {
        throw new Error("Invalid or expired verification code");
      }
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendLoginCode = async () => {
    try {
      setLoading(true);
      
      if (!pendingUser) {
        throw new Error("No pending verification");
      }
      
      // Generate a new code
      const newCode = generateCode();
      setVerificationCode(newCode);
      
      console.log(`New verification code for ${pendingUser.email}: ${newCode}`); // For demo only
      
      // In a real app, send the code via email
    } catch (error) {
      console.error('Resend code error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole, firmId?: string) => {
    try {
      setLoading(true);
      
      // In a real app, make API call to register user
      // For MVP, we'll just simulate success after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      
      // We would send an email in a real app
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('eloiseUser');
    setUser(null);
    setPendingUser(null);
    setVerificationCode(null);
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      pendingUser,
      loading,
      login,
      signup,
      logout,
      resetPassword,
      verifyLoginCode,
      resendLoginCode,
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
