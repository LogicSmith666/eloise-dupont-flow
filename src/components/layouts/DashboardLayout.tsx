
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, User, Users, Settings, Layout, FileText, Upload, Moon, Sun, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from '@/components/ui/switch';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const getSidebarItems = () => {
    switch (user?.role) {
      case 'superadmin':
        return [
          { label: 'Dashboard', icon: Layout, path: '/super-admin/dashboard' },
          { label: 'Firms', icon: Users, path: '/super-admin/firms' },
          { label: 'Invites', icon: FileText, path: '/super-admin/invites' },
          { label: 'Settings', icon: Settings, path: '/super-admin/settings' },
        ];
      case 'firmadmin':
        return [
          { label: 'Dashboard', icon: Layout, path: '/firm-admin/dashboard' },
          { label: 'Brokers', icon: Users, path: '/firm-admin/brokers' },
          { label: 'Applications', icon: FileText, path: '/firm-admin/applications' },
          { label: 'Settings', icon: Settings, path: '/firm-admin/settings' },
        ];
      case 'broker':
        return [
          { label: 'Dashboard', icon: Layout, path: '/broker/dashboard' },
          { label: 'Business Profiles', icon: Building, path: '/broker/business-profiles' },
          { label: 'Upload Documents', icon: Upload, path: '/broker/upload' },
          { label: 'Applications', icon: FileText, path: '/broker/applications' },
          { label: 'Settings', icon: Settings, path: '/broker/settings' },
        ];
      default:
        return [];
    }
  };

  const sidebarItems = getSidebarItems();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-eloise-accent text-white flex items-center justify-center font-semibold">
                {user?.name.charAt(0) || 'E'}
              </div>
              <div className="flex flex-col">
                <div className="font-medium text-sm text-white truncate">{user?.name || 'User'}</div>
                <div className="text-xs text-sidebar-foreground/70 capitalize">{user?.role}</div>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <div className="space-y-1">
              {sidebarItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </SidebarContent>
          
          <SidebarFooter className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2 px-2 py-1">
                <div className="flex items-center">
                  {theme === 'dark' ? (
                    <Moon className="h-4 w-4 text-sidebar-foreground mr-2" />
                  ) : (
                    <Sun className="h-4 w-4 text-sidebar-foreground mr-2" />
                  )}
                  <span className="text-sm text-sidebar-foreground">Dark Mode</span>
                </div>
                <Switch 
                  checked={theme === 'dark'} 
                  onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                />
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <SidebarTrigger />
            </div>
            <div className="text-sm text-muted-foreground">
              {user?.firmName && `${user.firmName} · `}
              {user?.email}
            </div>
          </div>
          
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
