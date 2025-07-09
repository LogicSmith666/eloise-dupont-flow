
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Deal {
  id: string;
  businessName: string;
  status: string;
  amount: string;
  date: string;
  formData: any;
}

const DealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    // Load deal from localStorage
    const deals = JSON.parse(localStorage.getItem('createdDeals') || '[]');
    const foundDeal = deals.find((d: Deal) => d.id === id);
    setDeal(foundDeal || null);
  }, [id]);

  const handleDelete = () => {
    const deals = JSON.parse(localStorage.getItem('createdDeals') || '[]');
    const updatedDeals = deals.filter((d: Deal) => d.id !== id);
    localStorage.setItem('createdDeals', JSON.stringify(updatedDeals));
    
    toast({
      title: "Deal deleted",
      description: "The deal has been successfully deleted.",
    });
    
    navigate('/broker/dashboard');
  };

  if (!deal) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Deal not found</h2>
            <p className="text-muted-foreground mb-4">The requested deal could not be found.</p>
            <Button onClick={() => navigate('/broker/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/broker/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Deal Details</h1>
              <p className="text-muted-foreground text-sm md:text-base">
                View and manage deal information
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Deal</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this deal? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete Deal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Deal Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{deal.businessName}</CardTitle>
                  <CardDescription>Deal ID: {deal.id}</CardDescription>
                </div>
                <Badge className={getStatusColor(deal.status)}>
                  {deal.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold">{deal.amount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date Created</p>
                  <p className="text-lg">{deal.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold">{deal.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Business Name</p>
                  <p className="text-base">{deal.formData.businessName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">State</p>
                  <p className="text-base">{deal.formData.state}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Business Start Date</p>
                  <p className="text-base">{deal.formData.businessDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entity Type</p>
                  <p className="text-base">{deal.formData.entityType}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue Type</p>
                  <p className="text-base">{deal.formData.revenueType}</p>
                </div>
                {deal.formData.monthlyRevenueAvg && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Monthly Revenue Average</p>
                    <p className="text-base">${parseInt(deal.formData.monthlyRevenueAvg).toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">FICO Score</p>
                  <p className="text-base">{deal.formData.fico}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Positions</p>
                  <p className="text-base">{deal.formData.positions}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">NSFs</p>
                  <p className="text-base">{deal.formData.nsfs}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Industry</p>
                  <p className="text-base">{deal.formData.rawIndustry}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit History */}
          <Card>
            <CardHeader>
              <CardTitle>Credit History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Has Defaults/BKs</p>
                  <p className="text-base capitalize">{deal.formData.hasDefaults}</p>
                </div>
                {deal.formData.defaultsSettled && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Defaults Settled</p>
                    <p className="text-base capitalize">{deal.formData.defaultsSettled}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DealDetails;
