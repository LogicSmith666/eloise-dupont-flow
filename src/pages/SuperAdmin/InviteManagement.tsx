
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInvite } from '@/contexts/InviteContext';
import InviteList from '@/components/invites/InviteList';
import InviteModal from '@/components/invites/InviteModal';
import AddFirmForm from '@/components/firms/AddFirmForm';

// Mock firms data
const MOCK_FIRMS = [
  { id: '101', name: 'Finance Pro Inc.' },
  { id: '102', name: 'Capital Solutions LLC' },
  { id: '103', name: 'Funding Experts Group' },
  { id: '104', name: 'Business Capital Partners' },
];

const InviteManagement = () => {
  const { getAllInvites } = useInvite();
  const [firms, setFirms] = useState(MOCK_FIRMS);
  const [showAddFirm, setShowAddFirm] = useState(false);
  
  const allInvites = getAllInvites();
  const pendingInvites = allInvites.filter(invite => invite.status === 'pending');
  const acceptedInvites = allInvites.filter(invite => invite.status === 'accepted');
  const declinedInvites = allInvites.filter(invite => invite.status === 'declined');
  
  const handleFirmAdded = (firmId: string, firmName: string) => {
    setFirms([...firms, { id: firmId, name: firmName }]);
    setShowAddFirm(false);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invite Management</h1>
            <p className="text-muted-foreground">
              Manage firm admin invitations and track their status.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <InviteModal
              title="Invite Firm Admin"
              description="Send an invitation to a firm admin to join the platform."
              triggerText="Invite Firm Admin"
              role="superadmin"
              firms={firms}
            />
            <Button 
              variant="outline" 
              onClick={() => setShowAddFirm(!showAddFirm)}
            >
              {showAddFirm ? 'Cancel' : 'Add New Firm'}
            </Button>
          </div>
        </div>
        
        {showAddFirm && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <AddFirmForm onComplete={handleFirmAdded} />
            </CardContent>
          </Card>
        )}
        
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingInvites.length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted ({acceptedInvites.length})
            </TabsTrigger>
            <TabsTrigger value="declined">
              Declined ({declinedInvites.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All Invites ({allInvites.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Invites</CardTitle>
                <CardDescription>Invitations that are waiting for response</CardDescription>
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
                <CardDescription>Invitations that have been accepted</CardDescription>
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
                <CardDescription>Invitations that have been declined</CardDescription>
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
                <CardDescription>Complete invite history</CardDescription>
              </CardHeader>
              <CardContent>
                <InviteList invites={allInvites} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default InviteManagement;
