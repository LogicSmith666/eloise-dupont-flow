
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Building, Plus, Edit, Trash2, Eye, Mail, Phone, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// Mock data for business profiles
const MOCK_BUSINESS_PROFILES = [
  {
    id: 'bp1',
    businessName: 'Cozy Coffee Shop',
    email: 'owner@cozycoffee.com',
    phone: '(555) 123-4567',
    createdAt: '2023-10-25',
    updatedAt: '2023-11-02'
  },
  {
    id: 'bp2',
    businessName: 'Urban Fitness Center',
    email: 'manager@urbanfit.com',
    phone: '(555) 987-6543',
    createdAt: '2023-09-18',
    updatedAt: '2023-10-15'
  },
  {
    id: 'bp3',
    businessName: 'Fresh Grocery Market',
    email: 'contact@freshgrocery.com',
    phone: '(555) 456-7890',
    createdAt: '2023-08-10',
    updatedAt: '2023-09-22'
  }
];

const BusinessProfiles = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [businessProfiles, setBusinessProfiles] = useState(MOCK_BUSINESS_PROFILES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<typeof MOCK_BUSINESS_PROFILES[0] | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: ''
  });

  const handleCreateProfile = () => {
    setEditingProfile(null);
    setFormData({ businessName: '', email: '', phone: '' });
    setIsDialogOpen(true);
  };

  const handleEditProfile = (profile: typeof MOCK_BUSINESS_PROFILES[0]) => {
    setEditingProfile(profile);
    setFormData({
      businessName: profile.businessName,
      email: profile.email,
      phone: profile.phone
    });
    setIsDialogOpen(true);
  };

  const handleDeleteProfile = (profileId: string) => {
    setBusinessProfiles(prev => prev.filter(p => p.id !== profileId));
    toast({
      title: "Business profile deleted",
      description: "The business profile has been successfully deleted.",
    });
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProfile) {
      // Update existing profile
      setBusinessProfiles(prev => prev.map(p => 
        p.id === editingProfile.id 
          ? { ...p, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      ));
      toast({
        title: "Business profile updated",
        description: "The business profile has been successfully updated.",
      });
    } else {
      // Create new profile
      const newProfile = {
        id: `bp${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setBusinessProfiles(prev => [newProfile, ...prev]);
      toast({
        title: "Business profile created",
        description: "The business profile has been successfully created.",
      });
    }
    
    setIsDialogOpen(false);
    setFormData({ businessName: '', email: '', phone: '' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between md:space-y-0">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Business Profiles</h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Manage business owner profiles for deal submissions.
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateProfile} className="w-full md:w-auto shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Add Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingProfile ? 'Edit Business Profile' : 'Create Business Profile'}
                </DialogTitle>
                <DialogDescription>
                  {editingProfile 
                    ? 'Update the business owner information.' 
                    : 'Add a new business owner profile for deal submissions.'
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Enter business name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProfile ? 'Update Profile' : 'Create Profile'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Business Profiles ({businessProfiles.length})</CardTitle>
            <CardDescription>
              All business owner profiles managed by your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {businessProfiles.length > 0 ? (
              <div className="grid gap-4 md:gap-6">
                {businessProfiles.map((profile) => (
                  <Card key={profile.id} className="border border-border/40 hover:border-border transition-colors">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between md:space-y-0">
                        <div className="flex items-start space-x-3 min-w-0 flex-1">
                          <div className="h-10 w-10 rounded-full bg-eloise-accent/10 flex items-center justify-center shrink-0">
                            <Building className="h-5 w-5 text-eloise-accent" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-base mb-3 truncate">{profile.businessName}</h3>
                            <div className="space-y-2">
                              {profile.email && (
                                <div className="flex items-center space-x-2 text-sm">
                                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                                  <span className="text-foreground truncate">{profile.email}</span>
                                </div>
                              )}
                              {profile.phone && (
                                <div className="flex items-center space-x-2 text-sm">
                                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                  <span className="text-foreground">{profile.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="text-muted-foreground">Created {profile.createdAt}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end space-x-2 shrink-0">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/broker/business-profiles/${profile.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditProfile(profile)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteProfile(profile.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No business profiles</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Create your first business profile to start submitting deals.
                </p>
                <Button onClick={handleCreateProfile}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Business Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BusinessProfiles;
