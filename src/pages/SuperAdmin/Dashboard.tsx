
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import InviteModal from "@/components/invites/InviteModal";
import { useInvite } from "@/contexts/InviteContext";

// Mock data for dashboard
const MOCK_FIRMS = [
  { id: '101', name: 'Finance Pro Inc.', brokers: 5, activeApplications: 24 },
  { id: '102', name: 'Capital Solutions LLC', brokers: 3, activeApplications: 17 },
  { id: '103', name: 'Funding Experts Group', brokers: 8, activeApplications: 32 },
  { id: '104', name: 'Business Capital Partners', brokers: 4, activeApplications: 21 },
];

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { getAllInvites } = useInvite();
  
  const filteredFirms = MOCK_FIRMS.filter(firm => 
    firm.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const allInvites = getAllInvites();
  const pendingInvites = allInvites.filter(invite => invite.status === 'pending');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage firms and monitor platform activity.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <InviteModal
              title="Invite Firm Admin"
              description="Send an invitation to a firm admin to join the platform."
              triggerText="Invite Firm Admin"
              role="SuperAdmin"
              firms={MOCK_FIRMS}
            />
            <Button 
              variant="outline"
              onClick={() => navigate('/super-admin/invites')}
            >
              View All Invites
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Firms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{MOCK_FIRMS.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Brokers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {MOCK_FIRMS.reduce((acc, firm) => acc + firm.brokers, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +7 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {MOCK_FIRMS.reduce((acc, firm) => acc + firm.activeApplications, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +43 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingInvites.length}</div>
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs text-muted-foreground"
                onClick={() => navigate('/super-admin/invites')}
              >
                View all invites
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Firms</CardTitle>
            <CardDescription>Manage all registered firms on the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search firms..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="rounded-md border">
              <div className="grid grid-cols-4 p-4 font-medium">
                <div>Name</div>
                <div>Brokers</div>
                <div>Active Applications</div>
                <div className="text-right">Actions</div>
              </div>
              {filteredFirms.map((firm) => (
                <div 
                  key={firm.id} 
                  className="grid grid-cols-4 p-4 hover:bg-muted border-t items-center"
                >
                  <div className="font-medium">{firm.name}</div>
                  <div>{firm.brokers}</div>
                  <div>{firm.activeApplications}</div>
                  <div className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/super-admin/firms/${firm.id}`)}
                    >
                      View Details
                    </Button>
                    <InviteModal
                      title="Invite Firm Admin"
                      description={`Send an invitation to a firm admin for ${firm.name}.`}
                      triggerText="Invite Admin"
                      role="SuperAdmin"
                      firms={[firm]}
                      firmId={firm.id}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => navigate('/super-admin/invites')}>
                Create New Firm
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
