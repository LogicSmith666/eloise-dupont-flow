
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import InviteModal from "@/components/invites/InviteModal";
import { useInvite } from "@/contexts/InviteContext";

// Mock data for dashboard
const MOCK_BROKERS = [
  { id: '1', name: 'John Smith', email: 'john.smith@firmadmin.com', applications: 12, status: 'Active' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.johnson@firmadmin.com', applications: 8, status: 'Active' },
  { id: '3', name: 'Mike Wilson', email: 'mike.wilson@firmadmin.com', applications: 3, status: 'Inactive' },
];

const MOCK_FIRM = {
  id: '101',
  name: 'Finance Pro Inc.'
};

const FirmAdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { getAllInvites } = useInvite();
  
  const filteredBrokers = MOCK_BROKERS.filter(broker => 
    broker.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const allInvites = getAllInvites();
  const brokerInvites = allInvites.filter(invite => invite.role === 'Broker');
  const pendingBrokerInvites = brokerInvites.filter(invite => invite.status === 'pending');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Firm Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your firm's brokers and applications.
            </p>
          </div>
          <InviteModal
            title="Invite Broker"
            description="Send an invitation to a broker to join your firm."
            triggerText="Invite Broker"
            role="Admin"
            firms={[MOCK_FIRM]}
            firmId={MOCK_FIRM.id}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Brokers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{MOCK_BROKERS.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {MOCK_BROKERS.reduce((acc, broker) => acc + broker.applications, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +8 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Brokers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {MOCK_BROKERS.filter(b => b.status === 'Active').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                85% active rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingBrokerInvites.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Broker invitations
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Brokers</CardTitle>
            <CardDescription>Overview of brokers in your firm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search brokers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="rounded-md border">
              <div className="grid grid-cols-4 p-4 font-medium">
                <div>Name</div>
                <div>Applications</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>
              {filteredBrokers.map((broker) => (
                <div 
                  key={broker.id} 
                  className="grid grid-cols-4 p-4 hover:bg-muted border-t items-center"
                >
                  <div className="font-medium">{broker.name}</div>
                  <div>{broker.applications}</div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      broker.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {broker.status}
                    </span>
                  </div>
                  <div className="text-right space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <InviteModal
                      title="Invite Broker"
                      description="Send an invitation to a broker to join your firm."
                      triggerText="Invite"
                      role="Admin"
                      firms={[MOCK_FIRM]}
                      firmId={MOCK_FIRM.id}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => window.location.href = '/firm-admin/brokers'}>
                Manage All Brokers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FirmAdminDashboard;
