import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, ArrowRight, Search, FileText, FormInput, CheckSquare, Square, Loader2, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// Mock data for processor dashboard (existing deals)
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

const ProcessorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState<keyof typeof TIME_PERIODS>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [createdDeals, setCreatedDeals] = useState<any[]>([]);
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  
  // Load created deals from localStorage
  useEffect(() => {
    const deals = JSON.parse(localStorage.getItem('createdDeals') || '[]');
    setCreatedDeals(deals);
  }, []);

  // Combine mock applications with created deals
  const allApplications = [...MOCK_APPLICATIONS, ...createdDeals];
  
  // Filter applications based on time period
  const filteredApplications = allApplications.filter(app => 
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
    navigate('/processor/upload');
  };

  const handleCreateDealForm = () => {
    navigate('/processor/create-deal-form');
  };

  const handleSelectAllDeals = () => {
    if (selectedDeals.length === filteredApplications.length) {
      setSelectedDeals([]);
    } else {
      setSelectedDeals(filteredApplications.map(deal => deal.id));
    }
  };

  const handleSelectDeal = (dealId: string) => {
    setSelectedDeals(prev => 
      prev.includes(dealId) 
        ? prev.filter(id => id !== dealId)
        : [...prev, dealId]
    );
  };

  const handleMatchLenders = async () => {
    if (selectedDeals.length === 0) return;
    
    setIsMatching(true);
    
    try {
      // Simulate API call with dummy data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const dummyResults = {
        processor_id: "f6c88059-d8f5-469d-9090-11b1eb07c627",
        total_deals_processed: selectedDeals.length,
        total_lenders_checked: 7,
        results: selectedDeals.map(dealId => {
          const deal = filteredApplications.find(d => d.id === dealId);
          return {
            deal_id: dealId,
            deal_name: deal?.businessName || "Unknown Deal",
            lender_matches: [
              {
                lender_name: "Atiq Khan Capital",
                lender_type: "STRAIGHT",
                overall_match: true,
                feedback: ["All criteria passed - Deal matches!"]
              },
              {
                lender_name: "Capital One Business",
                lender_type: "LINE_OF_CREDITS",
                overall_match: false,
                feedback: ["Position outside acceptable range", "FICO score too low", "Time in business insufficient"]
              },
              {
                lender_name: "High Risk Ventures",
                lender_type: "HIGH_RISK",
                overall_match: false,
                feedback: ["Revenue requirements not met", "State restrictions apply"]
              }
            ]
          };
        })
      };
      
      console.log("Redirecting to results page with:", dummyResults);
      
      // Store results in localStorage as backup
      localStorage.setItem('lenderMatchResults', JSON.stringify(dummyResults));
      
      // Navigate to results page with state
      navigate('/processor/lender-match-results', { 
        state: { results: dummyResults } 
      });
      
      setIsMatching(false);
    } catch (error) {
      console.error("Error matching lenders:", error);
      setIsMatching(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base mt-1">
            {user?.firmName || "Your Firm"} - Upload and manage business owner applications.
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">My Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-3xl font-bold">{filteredApplications.length}</div>
              <p className="text-xs text-muted-foreground mt-1 leading-tight">
                {filteredApplications.length > MOCK_APPLICATIONS.filter(a => TIME_PERIODS["month"].filter(a.date)).length 
                  ? `+${filteredApplications.length - MOCK_APPLICATIONS.filter(a => TIME_PERIODS["month"].filter(a.date)).length} from last month`
                  : "No change from last month"
                }
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-3xl font-bold">{approvedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {(approvedCount / (filteredApplications.length || 1) * 100).toFixed(0)}% approval rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-3xl font-bold">{processingCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Average 3 days to process
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Total Funded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-3xl font-bold">${totalFunded.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="eloise-gradient text-white border-0 shadow-lg">
            <CardContent className="p-4 md:p-6 flex flex-col items-center justify-between gap-4">
              <div className="space-y-2 text-center">
                <h3 className="text-lg md:text-xl font-bold">Upload Documents</h3>
                <p className="text-white/80 text-sm md:text-base">
                  Upload business owner's financial documents to process a new funding application.
                </p>
              </div>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={handleCreateNewDeal}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Documents
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0 shadow-lg">
            <CardContent className="p-4 md:p-6 flex flex-col items-center justify-between gap-4">
              <div className="space-y-2 text-center">
                <h3 className="text-lg md:text-xl font-bold">Manual Entry</h3>
                <p className="text-white/80 text-sm md:text-base">
                  Manually enter deal information using our comprehensive form instead of uploading documents.
                </p>
              </div>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={handleCreateDealForm}
                className="w-full"
              >
                <FormInput className="mr-2 h-4 w-4" /> Fill Form
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <CardTitle className="text-lg md:text-xl">Deal History</CardTitle>
                <CardDescription className="text-sm">Manage your deals and track their status.</CardDescription>
              </div>
              
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-2">
                  <label className="text-sm font-medium">Time Period:</label>
                  <Select value={timePeriod} onValueChange={(value: keyof typeof TIME_PERIODS) => setTimePeriod(value)}>
                    <SelectTrigger className="w-full md:w-[180px]">
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
                    className="pl-8 h-9 w-full md:w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedDeals.length > 0 && (
              <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {selectedDeals.length} deal{selectedDeals.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <Button 
                    onClick={handleMatchLenders} 
                    disabled={isMatching}
                    className="w-full md:w-auto"
                  >
                    {isMatching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Matching Lenders...
                      </>
                    ) : (
                      <>
                        <Target className="mr-2 h-4 w-4" />
                        Match with Lenders
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
            <DealListTable 
              deals={filteredApplications} 
              navigate={navigate}
              selectedDeals={selectedDeals}
              onSelectDeal={handleSelectDeal}
              onSelectAll={handleSelectAllDeals}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

// Updated Mobile-responsive deal list table component
const DealListTable = ({ 
  deals, 
  navigate, 
  selectedDeals = [], 
  onSelectDeal, 
  onSelectAll 
}: { 
  deals: any[], 
  navigate: (path: string) => void,
  selectedDeals?: string[],
  onSelectDeal?: (dealId: string) => void,
  onSelectAll?: () => void
}) => {
  const handleViewDeal = (deal: any) => {
    // Check if it's a created deal (has formData) or legacy deal
    if (deal.formData) {
      navigate(`/processor/deals/${deal.id}`);
    } else {
      navigate(`/processor/applications/${deal.id}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Desktop view */}
      <div className="hidden md:block rounded-md border">
        <div className="grid grid-cols-5 p-4 font-medium text-sm bg-muted/50">
          <div className="flex items-center space-x-2">
            {onSelectAll && (
              <Checkbox 
                checked={selectedDeals.length === deals.length && deals.length > 0}
                onCheckedChange={onSelectAll}
              />
            )}
            <span>Business Name</span>
          </div>
          <div>Amount</div>
          <div>Date</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        
        {deals.length > 0 ? (
          deals.map(deal => (
            <div key={deal.id} className="grid grid-cols-5 p-4 border-t items-center text-sm">
              <div className="flex items-center space-x-2">
                {onSelectDeal && (
                  <Checkbox 
                    checked={selectedDeals.includes(deal.id)}
                    onCheckedChange={() => onSelectDeal(deal.id)}
                  />
                )}
                <span className="font-medium">{deal.businessName}</span>
              </div>
              <div>{deal.amount}</div>
              <div>{deal.date}</div>
              <div>
                <Badge 
                  variant={
                    deal.status === 'Approved' ? 'default' : 
                    deal.status === 'Processing' ? 'secondary' : 
                    'destructive'
                  }
                >
                  {deal.status}
                </Badge>
              </div>
              <div className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center"
                  onClick={() => handleViewDeal(deal)}
                >
                  View Deal <ArrowRight className="ml-1 h-4 w-4" />
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

      {/* Mobile view */}
      <div className="block md:hidden space-y-3">
        {deals.length > 0 ? (
          deals.map(deal => (
            <Card key={deal.id} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {onSelectDeal && (
                      <Checkbox 
                        checked={selectedDeals.includes(deal.id)}
                        onCheckedChange={() => onSelectDeal(deal.id)}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{deal.businessName}</h4>
                      <p className="text-sm text-muted-foreground">{deal.amount}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      deal.status === 'Approved' ? 'default' : 
                      deal.status === 'Processing' ? 'secondary' : 
                      'destructive'
                    }
                  >
                    {deal.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{deal.date}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewDeal(deal)}
                    className="text-xs"
                  >
                    View Deal
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No deals found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessorDashboard;
