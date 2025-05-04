
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, FileText, Upload } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data for firm details
const MOCK_FIRMS = {
  '101': {
    id: '101',
    name: 'Finance Pro Inc.',
    email: 'admin@financepro.com',
    phone: '(555) 123-4567',
    address: '123 Financial Ave, New York, NY 10001',
    createdAt: '2023-05-15',
    brokers: [
      { id: '1', name: 'John Smith', email: 'john@financepro.com', applications: 12 },
      { id: '2', name: 'Emily Johnson', email: 'emily@financepro.com', applications: 8 },
      { id: '3', name: 'Michael Brown', email: 'michael@financepro.com', applications: 4 },
    ],
    applications: [
      { id: 'a1', businessName: 'Cozy Coffee Shop', status: 'Approved', amount: '$25,000', date: '2023-10-25' },
      { id: 'a2', businessName: 'Urban Fitness Center', status: 'Processing', amount: '$75,000', date: '2023-11-02' },
      { id: 'a3', businessName: 'Fresh Grocery Market', status: 'Approved', amount: '$120,000', date: '2023-10-18' },
      { id: 'a4', businessName: 'Tech Solutions Inc', status: 'Rejected', amount: '$200,000', date: '2023-11-10' },
      { id: 'a5', businessName: 'Gourmet Restaurant', status: 'Processing', amount: '$150,000', date: '2023-11-05' },
    ]
  },
  '102': {
    id: '102',
    name: 'Capital Solutions LLC',
    email: 'admin@capsolutions.com',
    phone: '(555) 987-6543',
    address: '456 Investment Blvd, Chicago, IL 60601',
    createdAt: '2023-06-10',
    brokers: [
      { id: '4', name: 'Robert Wilson', email: 'robert@capsolutions.com', applications: 7 },
      { id: '5', name: 'Sophia Miller', email: 'sophia@capsolutions.com', applications: 10 },
    ],
    applications: [
      { id: 'b1', businessName: 'Modern Furniture Store', status: 'Approved', amount: '$100,000', date: '2023-10-30' },
      { id: 'b2', businessName: 'Healthy Meal Prep', status: 'Processing', amount: '$50,000', date: '2023-11-08' },
      { id: 'b3', businessName: 'Boutique Hotel', status: 'Rejected', amount: '$500,000', date: '2023-10-12' },
    ]
  },
};

const FirmDetails = () => {
  const { firmId } = useParams<{ firmId: string }>();
  const navigate = useNavigate();
  const [firm, setFirm] = useState(firmId && MOCK_FIRMS[firmId as keyof typeof MOCK_FIRMS]);
  
  useEffect(() => {
    if (firmId && MOCK_FIRMS[firmId as keyof typeof MOCK_FIRMS]) {
      setFirm(MOCK_FIRMS[firmId as keyof typeof MOCK_FIRMS]);
    } else {
      navigate('/admin/dashboard');
    }
  }, [firmId, navigate]);
  
  if (!firm) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/admin/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{firm.name}</h1>
              <p className="text-muted-foreground">
                Firm ID: {firm.id} · Created: {firm.createdAt}
              </p>
            </div>
          </div>
          <Button variant="outline">Edit Firm</Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Brokers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{firm.brokers.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{firm.applications.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Contact Email</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-base font-medium break-words">{firm.email}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Contact Phone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-base font-medium">{firm.phone}</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Firm Details</CardTitle>
            <CardDescription>Address and contact information for {firm.name}.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="font-medium">Address</div>
                <div className="text-sm text-muted-foreground">{firm.address}</div>
              </div>
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm text-muted-foreground">{firm.email}</div>
              </div>
              <div>
                <div className="font-medium">Phone</div>
                <div className="text-sm text-muted-foreground">{firm.phone}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="brokers">
          <TabsList>
            <TabsTrigger value="brokers" className="flex items-center">
              <User className="mr-2 h-4 w-4" /> Brokers
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" /> Applications
            </TabsTrigger>
          </TabsList>
          <TabsContent value="brokers" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Brokers</CardTitle>
                    <CardDescription>Brokers working with {firm.name}.</CardDescription>
                  </div>
                  <Button size="sm">Add Broker</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {firm.brokers.map(broker => (
                    <div key={broker.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-muted">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{broker.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{broker.name}</div>
                          <div className="text-sm text-muted-foreground">{broker.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-muted-foreground">
                          {broker.applications} applications
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="applications" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Applications</CardTitle>
                <CardDescription>Recent applications from {firm.name}.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 p-4 font-medium">
                    <div>Business Name</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div>Date</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {firm.applications.map(app => (
                    <div key={app.id} className="grid grid-cols-5 p-4 border-t items-center">
                      <div className="font-medium">{app.businessName}</div>
                      <div>{app.amount}</div>
                      <div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                          ${app.status === 'Approved' 
                            ? 'bg-green-100 text-green-800' 
                            : app.status === 'Rejected' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <div>{app.date}</div>
                      <div className="text-right">
                        <Button variant="ghost" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FirmDetails;
