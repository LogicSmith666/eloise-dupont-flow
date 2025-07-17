
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit, Trash2, Save, X } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedDeal, setEditedDeal] = useState<Deal | null>(null);

  useEffect(() => {
    // Load deal from localStorage
    const deals = JSON.parse(localStorage.getItem('createdDeals') || '[]');
    const foundDeal = deals.find((d: Deal) => d.id === id);
    setDeal(foundDeal || null);
    setEditedDeal(foundDeal || null);
  }, [id]);

  const handleDelete = () => {
    const deals = JSON.parse(localStorage.getItem('createdDeals') || '[]');
    const updatedDeals = deals.filter((d: Deal) => d.id !== id);
    localStorage.setItem('createdDeals', JSON.stringify(updatedDeals));
    
    toast({
      title: "Deal deleted",
      description: "The deal has been successfully deleted.",
    });
    
    navigate('/processor/dashboard');
  };

  const handleSave = () => {
    if (!editedDeal) return;

    const deals = JSON.parse(localStorage.getItem('createdDeals') || '[]');
    const updatedDeals = deals.map((d: Deal) => d.id === id ? editedDeal : d);
    localStorage.setItem('createdDeals', JSON.stringify(updatedDeals));
    
    setDeal(editedDeal);
    setIsEditing(false);
    
    toast({
      title: "Deal updated",
      description: "The deal has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditedDeal(deal);
    setIsEditing(false);
  };

  const updateField = (field: string, value: string) => {
    if (!editedDeal) return;
    
    setEditedDeal({
      ...editedDeal,
      formData: {
        ...editedDeal.formData,
        [field]: value
      }
    });
  };

  if (!deal) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Deal not found</h2>
            <p className="text-muted-foreground mb-4">The requested deal could not be found.</p>
            <Button onClick={() => navigate('/processor/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const displayDeal = isEditing ? editedDeal : deal;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/processor/dashboard')}
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
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
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
          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Business Name</Label>
                  {isEditing ? (
                    <Input
                      value={displayDeal?.formData.businessName || ''}
                      onChange={(e) => updateField('businessName', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-base mt-1">{displayDeal?.formData.businessName}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">State</Label>
                  {isEditing ? (
                    <Input
                      value={displayDeal?.formData.state || ''}
                      onChange={(e) => updateField('state', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-base mt-1">{displayDeal?.formData.state}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Business Start Date</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={displayDeal?.formData.businessDate || ''}
                      onChange={(e) => updateField('businessDate', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-base mt-1">{displayDeal?.formData.businessDate}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Entity Type</Label>
                  {isEditing ? (
                    <Input
                      value={displayDeal?.formData.entityType || ''}
                      onChange={(e) => updateField('entityType', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-base mt-1">{displayDeal?.formData.entityType}</p>
                  )}
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
                  <Label className="text-sm font-medium text-muted-foreground">Revenue Type</Label>
                  <p className="text-base mt-1">{displayDeal?.formData.revenueType}</p>
                </div>
                
                {/* Show monthly revenue average only when revenue type is 'average' */}
                {displayDeal?.formData.revenueType === 'average' && displayDeal?.formData.monthlyRevenueAvg && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Monthly Revenue Average</Label>
                    {isEditing ? (
                      <Input
                        value={displayDeal?.formData.monthlyRevenueAvg || ''}
                        onChange={(e) => updateField('monthlyRevenueAvg', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-base mt-1">${parseInt(displayDeal?.formData.monthlyRevenueAvg).toLocaleString()}</p>
                    )}
                  </div>
                )}

                {/* Show deposit months only when revenue type is 'separate' */}
                {displayDeal?.formData.revenueType === 'separate' && (
                  <>
                    {[1, 2, 3, 4].map((month) => {
                      const fieldName = `depositMonth${month}`;
                      const value = displayDeal?.formData[fieldName];
                      if (value) {
                        return (
                          <div key={month}>
                            <Label className="text-sm font-medium text-muted-foreground">Deposit Month {month}</Label>
                            {isEditing ? (
                              <Input
                                value={value}
                                onChange={(e) => updateField(fieldName, e.target.value)}
                                className="mt-1"
                              />
                            ) : (
                              <p className="text-base mt-1">${parseInt(value).toLocaleString()}</p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </>
                )}

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">FICO Score</Label>
                  {isEditing ? (
                    <Input
                      value={displayDeal?.formData.fico || ''}
                      onChange={(e) => updateField('fico', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-base mt-1">{displayDeal?.formData.fico}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Positions</Label>
                  {isEditing ? (
                    <Input
                      value={displayDeal?.formData.positions || ''}
                      onChange={(e) => updateField('positions', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-base mt-1">{displayDeal?.formData.positions}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">NSFs</Label>
                  {isEditing ? (
                    <Input
                      value={displayDeal?.formData.nsfs || ''}
                      onChange={(e) => updateField('nsfs', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-base mt-1">{displayDeal?.formData.nsfs}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Industry</Label>
                  {isEditing ? (
                    <Input
                      value={displayDeal?.formData.rawIndustry || ''}
                      onChange={(e) => updateField('rawIndustry', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-base mt-1">{displayDeal?.formData.rawIndustry}</p>
                  )}
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
                  <Label className="text-sm font-medium text-muted-foreground">Has Defaults/BKs</Label>
                  <p className="text-base mt-1 capitalize">{displayDeal?.formData.hasDefaults}</p>
                </div>
                {displayDeal?.formData.defaultsSettled && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Defaults Settled</Label>
                    <p className="text-base mt-1 capitalize">{displayDeal?.formData.defaultsSettled}</p>
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
