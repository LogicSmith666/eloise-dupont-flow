
import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInvite } from '@/contexts/InviteContext';
import { useAuth } from '@/contexts/AuthContext';
import InviteList from '@/components/invites/InviteList';
import InviteModal from '@/components/invites/InviteModal';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

// Mock brokers data
const MOCK_BROKERS = [
  { id: '1', name: 'John Smith', email: 'john@financepro.com', applications: 12 },
  { id: '2', name: 'Emily Johnson', email: 'emily@financepro.com', applications: 8 },
  { id: '3', name: 'Michael Brown', email: 'michael@financepro.com', applications: 4 },
];

const BrokerManagement = () => {
  const { user } = useAuth();
  const { getFirmInvites } = useInvite();
  const [brokers] = useState(MOCK_BROKERS);
  
  const firmInvites = user?.firmId ? getFirmInvites(user.firmId) : [];
  const brokerInvites = firmInvites.filter(invite => invite.role === 'broker');
  const pendingInvites = brokerInvites.filter(invite => invite.status === 'pending');
  const acceptedInvites = brokerInvites.filter(invite => invite.status === 'accepted');
  const declinedInvites = brokerInvites.filter(invite => invite.status === 'declined');
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Broker Management</h1>
            <p className="text-muted-foreground">
              Manage your brokers and invitations.
            </p>
          </div>
          <InviteModal
            title="Invite Broker"
            description="Send an invitation to a broker to join your firm."
            triggerText="Invite Broker"
            role="firmadmin"
            firmId={user?.firmId}
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Brokers</CardTitle>
            <CardDescription>Brokers currently working in your firm</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brokers.map((broker) => (
                  <TableRow key={broker.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>{broker.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{broker.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{broker.email}</TableCell>
                    <TableCell>{broker.applications}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        Active
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Invites ({pendingInvites.length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted Invites ({acceptedInvites.length})
            </TabsTrigger>
            <TabsTrigger value="declined">
              Declined Invites ({declinedInvites.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All Invites ({brokerInvites.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Invites</CardTitle>
                <CardDescription>Broker invitations waiting for response</CardDescription>
              </CardHeader>
              <CardContent>
                <InviteList invites={pendingInvites} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="accepted" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Accepted Invites</CardTitle>
                <CardDescription>Broker invitations that have been accepted</CardDescription>
              </CardHeader>
              <CardContent>
                <InviteList invites={acceptedInvites} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="declined" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Declined Invites</CardTitle>
                <CardDescription>Broker invitations that have been declined</CardDescription>
              </CardHeader>
              <CardContent>
                <InviteList invites={declinedInvites} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Invites</CardTitle>
                <CardDescription>Complete broker invite history</CardDescription>
              </CardHeader>
              <CardContent>
                <InviteList invites={brokerInvites} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BrokerManagement;
