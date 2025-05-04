
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for broker dashboard
const MOCK_APPLICATIONS = [
  { id: 'a1', businessName: 'Cozy Coffee Shop', status: 'Approved', amount: '$25,000', date: '2023-10-25' },
  { id: 'a2', businessName: 'Urban Fitness Center', status: 'Processing', amount: '$75,000', date: '2023-11-02' },
  { id: 'a3', businessName: 'Fresh Grocery Market', status: 'Approved', amount: '$120,000', date: '2023-10-18' },
];

const BrokerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Broker Dashboard</h1>
          <p className="text-muted-foreground">
            {user?.firmName || "Your Firm"} - Upload and manage business owner applications.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">My Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{MOCK_APPLICATIONS.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +1 from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {MOCK_APPLICATIONS.filter(a => a.status === 'Approved').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                67% approval rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {MOCK_APPLICATIONS.filter(a => a.status === 'Processing').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Average 3 days to process
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Funded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$145,000</div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="eloise-gradient text-white border-0 shadow-lg">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Upload New Application</h3>
              <p className="text-white/80">
                Upload business owner's financial documents to process a new funding application.
              </p>
            </div>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/broker/upload')}
              className="shrink-0"
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Documents
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Your most recent funding applications.</CardDescription>
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
              {MOCK_APPLICATIONS.map(app => (
                <div key={app.id} className="grid grid-cols-5 p-4 border-t items-center">
                  <div className="font-medium">{app.businessName}</div>
                  <div>{app.amount}</div>
                  <div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
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
                  <div>{app.date}</div>
                  <div className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center"
                      onClick={() => navigate(`/broker/applications/${app.id}`)}
                    >
                      View <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {MOCK_APPLICATIONS.length === 0 && (
              <div className="text-center py-6">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No applications yet</p>
                <p className="text-sm text-muted-foreground">Upload your first application to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BrokerDashboard;
