
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Eye, Edit, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InviteModal from "@/components/invites/InviteModal";
import { useInvite } from "@/contexts/InviteContext";

// Mock data for dashboard
const MOCK_FIRMS = [
  { id: '101', name: 'Finance Pro Inc.', brokers: 5, activeApplications: 24 },
  { id: '102', name: 'Capital Solutions LLC', brokers: 3, activeApplications: 17 },
  { id: '103', name: 'Funding Experts Group', brokers: 8, activeApplications: 32 },
  { id: '104', name: 'Business Capital Partners', brokers: 4, activeApplications: 21 },
];

// Mock data for lenders
const MOCK_LENDERS = [
  {
    id: '1',
    name: 'Capital One Business',
    status: 'active',
    createdAt: '2024-01-15',
    configurations: [
      {
        id: '1',
        lenderType: 'Straight',
        minPos: 2,
        maxPos: 10,
        minTib: 6,
        minRevenue: 25000,
        minFico: 650,
        maxNsfs: 3
      },
      {
        id: '2',
        lenderType: 'Line Of Credits',
        minPos: 1,
        maxPos: 5,
        minTib: 12,
        minRevenue: 50000,
        minFico: 700,
        maxNsfs: 1
      }
    ]
  },
  {
    id: '2',
    name: 'Business Funding Solutions',
    status: 'active',
    createdAt: '2024-02-01',
    configurations: [
      {
        id: '3',
        lenderType: 'Consolidators',
        minPos: 3,
        maxPos: 15,
        minTib: 9,
        minRevenue: 40000,
        minFico: 680,
        maxNsfs: 2
      }
    ]
  },
  {
    id: '3',
    name: 'Quick Cash Advance',
    status: 'inactive',
    createdAt: '2024-01-28',
    configurations: [
      {
        id: '4',
        lenderType: 'Straight',
        minPos: 1,
        maxPos: 8,
        minTib: 3,
        minRevenue: 15000,
        minFico: 600,
        maxNsfs: 5
      }
    ]
  }
];

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [lenderSearchTerm, setLenderSearchTerm] = useState('');
  const { getAllInvites } = useInvite();
  
  const filteredFirms = MOCK_FIRMS.filter(firm => 
    firm.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLenders = MOCK_LENDERS.filter(lender => 
    lender.name.toLowerCase().includes(lenderSearchTerm.toLowerCase())
  );
  
  const allInvites = getAllInvites();
  const pendingInvites = allInvites.filter(invite => invite.status === 'pending');

  const handleViewLender = (id: string) => {
    // Navigate to lender details or show modal
    console.log('View lender:', id);
  };

  const handleEditLender = (id: string) => {
    navigate(`/super-admin/edit-lender/${id}`);
  };

  const handleDeleteLender = (id: string) => {
    // Show confirmation dialog and delete
    console.log('Delete lender:', id);
  };

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
              <CardTitle className="text-sm font-medium">Total Lenders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{MOCK_LENDERS.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {MOCK_LENDERS.filter(l => l.status === 'active').length} active
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

        <Tabs defaultValue="firms" className="space-y-6">
          <TabsList>
            <TabsTrigger value="firms">Firms Management</TabsTrigger>
            <TabsTrigger value="lenders">Lenders Management</TabsTrigger>
          </TabsList>

          <TabsContent value="firms">
            <Card>
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
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Firm
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lenders">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lenders</CardTitle>
                    <CardDescription>Manage all lenders and their configurations.</CardDescription>
                  </div>
                  <Button onClick={() => navigate('/super-admin/create-lender')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Lender
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search lenders..."
                    className="pl-8"
                    value={lenderSearchTerm}
                    onChange={(e) => setLenderSearchTerm(e.target.value)}
                  />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lender Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Configurations</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLenders.map((lender) => (
                      <TableRow key={lender.id}>
                        <TableCell className="font-medium">{lender.name}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={lender.status === 'active' ? 'default' : 'secondary'}
                          >
                            {lender.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {lender.configurations.map((config) => (
                              <Badge key={config.id} variant="outline" className="text-xs">
                                {config.lenderType}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(lender.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewLender(lender.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditLender(lender.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLender(lender.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredLenders.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No lenders found.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate('/super-admin/create-lender')}
                    >
                      Create Your First Lender
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
