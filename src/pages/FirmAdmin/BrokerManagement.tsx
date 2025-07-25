
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import InviteModal from "@/components/invites/InviteModal";
import { useInvite } from "@/contexts/InviteContext";

// Mock data for processors
const MOCK_PROCESSORS = [
  { id: '1', name: 'John Smith', email: 'john.smith@firmadmin.com', status: 'Active', applications: 12 },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.johnson@firmadmin.com', status: 'Active', applications: 8 },
  { id: '3', name: 'Mike Wilson', email: 'mike.wilson@firmadmin.com', status: 'Inactive', applications: 3 },
];

const MOCK_FIRM = {
  id: '101',
  name: 'Finance Pro Inc.'
};

const FirmAdminProcessorManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { getAllInvites } = useInvite();
  
  const filteredProcessors = MOCK_PROCESSORS.filter(processor => 
    processor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    processor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const allInvites = getAllInvites();
  const processorInvites = allInvites.filter(invite => invite.role === 'Processor');
  const pendingProcessorInvites = processorInvites.filter(invite => invite.status === 'pending');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Processor Management</h1>
            <p className="text-muted-foreground">
              Manage processors in your firm and track their performance.
            </p>
          </div>
          <InviteModal
            title="Invite Processor"
            description="Send an invitation to a processor to join your firm."
            triggerText="Invite Processor"
            role="Admin"
            firms={[MOCK_FIRM]}
            firmId={MOCK_FIRM.id}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Processors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{MOCK_PROCESSORS.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Processors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {MOCK_PROCESSORS.filter(b => b.status === 'Active').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                85% active rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {MOCK_PROCESSORS.reduce((acc, processor) => acc + processor.applications, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +8 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingProcessorInvites.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Processor invitations
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Processors</CardTitle>
            <CardDescription>Manage processors in your firm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search processors..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="rounded-md border">
              <div className="grid grid-cols-5 p-4 font-medium">
                <div>Name</div>
                <div>Email</div>
                <div>Status</div>
                <div>Applications</div>
                <div className="text-right">Actions</div>
              </div>
              {filteredProcessors.map((processor) => (
                <div 
                  key={processor.id} 
                  className="grid grid-cols-5 p-4 hover:bg-muted border-t items-center"
                >
                  <div className="font-medium">{processor.name}</div>
                  <div className="text-muted-foreground">{processor.email}</div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      processor.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {processor.status}
                    </span>
                  </div>
                  <div>{processor.applications}</div>
                  <div className="text-right space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FirmAdminProcessorManagement;
