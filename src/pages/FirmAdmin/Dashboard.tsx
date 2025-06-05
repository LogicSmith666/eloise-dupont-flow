
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Upload, User, Shield, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InviteModal from "@/components/invites/InviteModal";
import { useInvite } from "@/contexts/InviteContext";

// Mock data for broker dashboard
const MOCK_BROKERS = [
  { id: '1', name: 'John Smith', email: 'john@financepro.com', applications: 12 },
  { id: '2', name: 'Emily Johnson', email: 'emily@financepro.com', applications: 8 },
  { id: '3', name: 'Michael Brown', email: 'michael@financepro.com', applications: 4 },
];

const MOCK_APPLICATIONS = [
  { id: 'a1', businessName: 'Cozy Coffee Shop', status: 'Approved', amount: '$25,000', date: '2023-10-25', broker: 'John Smith' },
  { id: 'a2', businessName: 'Urban Fitness Center', status: 'Processing', amount: '$75,000', date: '2023-11-02', broker: 'Emily Johnson' },
  { id: 'a3', businessName: 'Fresh Grocery Market', status: 'Approved', amount: '$120,000', date: '2023-10-18', broker: 'John Smith' },
  { id: 'a4', businessName: 'Tech Solutions Inc', status: 'Rejected', amount: '$200,000', date: '2023-11-10', broker: 'Michael Brown' },
  { id: 'a5', businessName: 'Gourmet Restaurant', status: 'Processing', amount: '$150,000', date: '2023-11-05', broker: 'Emily Johnson' },
];

const FirmAdminDashboard = () => {
  const { user } = useAuth();
  const { getFirmInvites } = useInvite();
  const navigate = useNavigate();
  
  const firmInvites = user?.firmId ? getFirmInvites(user.firmId) : [];
  const pendingInvites = firmInvites.filter(invite => invite.status === 'pending');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between md:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-eloise-accent/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-eloise-accent" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {user?.name} • {user?.firmName || "Your Firm"}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Manage brokers and monitor applications.
            </p>
          </div>
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 w-full md:w-auto">
            <InviteModal
              title="Invite Broker"
              description="Send an invitation to a broker to join your firm."
              triggerText="Invite Broker"
              role="firmadmin"
              firmId={user?.firmId}
            />
            <Button 
              variant="outline"
              onClick={() => navigate('/firm/brokers')}
              className="w-full md:w-auto"
            >
              Manage Brokers
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Brokers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">{MOCK_BROKERS.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">{MOCK_APPLICATIONS.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +3 from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">
                {Math.round(MOCK_APPLICATIONS.filter(a => a.status === 'Approved').length / MOCK_APPLICATIONS.length * 100)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +5% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">{pendingInvites.length}</div>
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs text-muted-foreground"
                onClick={() => navigate('/firm/brokers')}
              >
                View invites
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle className="text-lg">Brokers</CardTitle>
                  <CardDescription>Manage your team of brokers.</CardDescription>
                </div>
                <InviteModal
                  title="Invite Broker"
                  description="Send an invitation to a broker to join your firm."
                  triggerText="Add Broker"
                  role="firmadmin"
                  firmId={user?.firmId}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_BROKERS.map(broker => (
                  <div key={broker.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback>{broker.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">{broker.name}</div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{broker.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-right shrink-0">
                      {broker.applications} apps
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle className="text-lg">Recent Applications</CardTitle>
                  <CardDescription>Latest funding applications submitted.</CardDescription>
                </div>
                <Button size="sm" className="flex items-center gap-1 w-full md:w-auto">
                  <FileText className="h-4 w-4" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_APPLICATIONS.slice(0, 4).map(app => (
                  <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">{app.businessName}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {app.amount} • {app.broker}
                      </div>
                    </div>
                    <div className="shrink-0 ml-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium 
                        ${app.status === 'Approved' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : app.status === 'Rejected' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Overview</CardTitle>
            <CardDescription>Firm application processing statistics for the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Upload className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Performance charts will appear here</p>
              <p className="text-sm">Processing statistics and conversion rates over time</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FirmAdminDashboard;
