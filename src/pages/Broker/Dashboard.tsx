
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, ArrowRight, Calendar, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for broker dashboard
const MOCK_APPLICATIONS = [
  { id: 'a1', businessName: 'Cozy Coffee Shop', status: 'Approved', amount: '$25,000', date: '2023-10-25' },
  { id: 'a2', businessName: 'Urban Fitness Center', status: 'Processing', amount: '$75,000', date: '2023-11-02' },
  { id: 'a3', businessName: 'Fresh Grocery Market', status: 'Approved', amount: '$120,000', date: '2023-09-18' },
  { id: 'a4', businessName: 'Tech Solutions Inc.', status: 'Approved', amount: '$50,000', date: '2023-12-05' },
  { id: 'a5', businessName: 'Green Energy Corp', status: 'Processing', amount: '$200,000', date: '2023-12-15' },
  { id: 'a6', businessName: 'Family Restaurant', status: 'Rejected', amount: '$35,000', date: '2024-01-10' },
  { id: 'a7', businessName: 'Modern Auto Repair', status: 'Approved', amount: '$85,000', date: '2024-02-22' },
  { id: 'a8', businessName: 'Luxury Boutique', status: 'Processing', amount: '$120,000', date: '2024-03-15' },
  { id: 'a9', businessName: 'Health Clinic', status: 'Approved', amount: '$300,000', date: '2024-04-05' },
];

// Time period filters
const TIME_PERIODS = {
  "all": { label: "All Time", filter: () => true },
  "week": { 
    label: "Last Week", 
    filter: (date: string) => {
      const now = new Date();
      const dealDate = new Date(date);
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
      return dealDate >= oneWeekAgo;
    }
  },
  "month": { 
    label: "Last Month", 
    filter: (date: string) => {
      const now = new Date();
      const dealDate = new Date(date);
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
      return dealDate >= oneMonthAgo;
    }
  },
  "year": { 
    label: "Last Year", 
    filter: (date: string) => {
      const now = new Date();
      const dealDate = new Date(date);
      const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
      return dealDate >= oneYearAgo;
    }
  }
};

const BrokerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState<keyof typeof TIME_PERIODS>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter applications based on time period
  const filteredApplications = MOCK_APPLICATIONS.filter(app => 
    TIME_PERIODS[timePeriod].filter(app.date) && 
    app.businessName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate stats
  const approvedCount = filteredApplications.filter(a => a.status === 'Approved').length;
  const processingCount = filteredApplications.filter(a => a.status === 'Processing').length;
  const totalFunded = filteredApplications
    .filter(a => a.status === 'Approved')
    .reduce((sum, app) => sum + parseInt(app.amount.replace(/[^0-9]/g, '')), 0);

  const handleCreateNewDeal = () => {
    navigate('/broker/upload');
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Broker Dashboard</h1>
          <p className="text-muted-foreground">
            {user?.firmName || "Your Firm"} - Upload and manage business owner applications.
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="font-medium">Time Period:</p>
            <Select value={timePeriod} onValueChange={(value: keyof typeof TIME_PERIODS) => setTimePeriod(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TIME_PERIODS).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search deals..."
              className="pl-8 h-9 w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">My Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{filteredApplications.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredApplications.length > MOCK_APPLICATIONS.filter(a => TIME_PERIODS["month"].filter(a.date)).length 
                  ? `+${filteredApplications.length - MOCK_APPLICATIONS.filter(a => TIME_PERIODS["month"].filter(a.date)).length} from last month`
                  : "No change from last month"
                }
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{approvedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {(approvedCount / (filteredApplications.length || 1) * 100).toFixed(0)}% approval rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{processingCount}</div>
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
              <div className="text-3xl font-bold">${totalFunded.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="eloise-gradient text-white border-0 shadow-lg">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Create New Deal</h3>
              <p className="text-white/80">
                Upload business owner's financial documents to process a new funding application.
              </p>
            </div>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={handleCreateNewDeal}
              className="shrink-0"
            >
              <Upload className="mr-2 h-4 w-4" /> Create New Deal
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Deal History</CardTitle>
            <CardDescription>Manage your deals and track their status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Deals</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <dealListTable deals={filteredApplications} navigate={navigate} />
              </TabsContent>
              
              <TabsContent value="approved">
                <dealListTable deals={filteredApplications.filter(deal => deal.status === 'Approved')} navigate={navigate} />
              </TabsContent>
              
              <TabsContent value="processing">
                <dealListTable deals={filteredApplications.filter(deal => deal.status === 'Processing')} navigate={navigate} />
              </TabsContent>
              
              <TabsContent value="rejected">
                <dealListTable deals={filteredApplications.filter(deal => deal.status === 'Rejected')} navigate={navigate} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

// Deal list table component
const dealListTable = ({ deals, navigate }: { deals: typeof MOCK_APPLICATIONS, navigate: (path: string) => void }) => {
  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-5 p-4 font-medium">
        <div>Business Name</div>
        <div>Amount</div>
        <div>Status</div>
        <div>Date</div>
        <div className="text-right">Actions</div>
      </div>
      
      {deals.length > 0 ? (
        deals.map(deal => (
          <div key={deal.id} className="grid grid-cols-5 p-4 border-t items-center">
            <div className="font-medium">{deal.businessName}</div>
            <div>{deal.amount}</div>
            <div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                ${deal.status === 'Approved' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                  : deal.status === 'Rejected' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}
              >
                {deal.status}
              </span>
            </div>
            <div>{deal.date}</div>
            <div className="text-right">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center"
                onClick={() => navigate(`/broker/applications/${deal.id}`)}
              >
                View Files <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No deals found matching your criteria
        </div>
      )}
    </div>
  );
};

export default BrokerDashboard;
