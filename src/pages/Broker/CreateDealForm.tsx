
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Building } from "lucide-react";

// US States data
const US_STATES = [
  { value: "AL", label: "Alabama (AL)" },
  { value: "AK", label: "Alaska (AK)" },
  { value: "AZ", label: "Arizona (AZ)" },
  { value: "AR", label: "Arkansas (AR)" },
  { value: "CA", label: "California (CA)" },
  { value: "CO", label: "Colorado (CO)" },
  { value: "CT", label: "Connecticut (CT)" },
  { value: "DE", label: "Delaware (DE)" },
  { value: "FL", label: "Florida (FL)" },
  { value: "GA", label: "Georgia (GA)" },
  { value: "HI", label: "Hawaii (HI)" },
  { value: "ID", label: "Idaho (ID)" },
  { value: "IL", label: "Illinois (IL)" },
  { value: "IN", label: "Indiana (IN)" },
  { value: "IA", label: "Iowa (IA)" },
  { value: "KS", label: "Kansas (KS)" },
  { value: "KY", label: "Kentucky (KY)" },
  { value: "LA", label: "Louisiana (LA)" },
  { value: "ME", label: "Maine (ME)" },
  { value: "MD", label: "Maryland (MD)" },
  { value: "MA", label: "Massachusetts (MA)" },
  { value: "MI", label: "Michigan (MI)" },
  { value: "MN", label: "Minnesota (MN)" },
  { value: "MS", label: "Mississippi (MS)" },
  { value: "MO", label: "Missouri (MO)" },
  { value: "MT", label: "Montana (MT)" },
  { value: "NE", label: "Nebraska (NE)" },
  { value: "NV", label: "Nevada (NV)" },
  { value: "NH", label: "New Hampshire (NH)" },
  { value: "NJ", label: "New Jersey (NJ)" },
  { value: "NM", label: "New Mexico (NM)" },
  { value: "NY", label: "New York (NY)" },
  { value: "NC", label: "North Carolina (NC)" },
  { value: "ND", label: "North Dakota (ND)" },
  { value: "OH", label: "Ohio (OH)" },
  { value: "OK", label: "Oklahoma (OK)" },
  { value: "OR", label: "Oregon (OR)" },
  { value: "PA", label: "Pennsylvania (PA)" },
  { value: "RI", label: "Rhode Island (RI)" },
  { value: "SC", label: "South Carolina (SC)" },
  { value: "SD", label: "South Dakota (SD)" },
  { value: "TN", label: "Tennessee (TN)" },
  { value: "TX", label: "Texas (TX)" },
  { value: "UT", label: "Utah (UT)" },
  { value: "VT", label: "Vermont (VT)" },
  { value: "VA", label: "Virginia (VA)" },
  { value: "WA", label: "Washington (WA)" },
  { value: "WV", label: "West Virginia (WV)" },
  { value: "WI", label: "Wisconsin (WI)" },
  { value: "WY", label: "Wyoming (WY)" }
];

// Industry mapping
const INDUSTRY_MAPPING = {
  "Agriculture": "Agriculture",
  "Agriculture - Cattle Rancher": "Agriculture",
  "Agriculture - Farmer / Agriculture": "Agriculture",
  "Arts / Creative": "Arts / Creative",
  "Arts / Creative - Arts Studio / Gallery": "Arts / Creative",
  "Arts / Creative - Music Studio": "Arts / Creative",
  "Auto": "Auto",
  "Auto - Auto Body Shop": "Auto",
  "Auto - Auto Dealership": "Auto",
  "Auto - Auto Repair": "Auto",
  "Auto - Towing": "Auto"
};

const RAW_INDUSTRIES = Object.keys(INDUSTRY_MAPPING);

const ENTITY_TYPES = [
  "LLC",
  "Non-Profit",
  "Sole Prop",
  "C-Corp",
  "Other"
];

// Mock business profiles (in real app, this would come from context or API)
const MOCK_BUSINESS_PROFILES = [
  { id: 'bp1', businessName: 'Cozy Coffee Shop' },
  { id: 'bp2', businessName: 'Urban Fitness Center' },
  { id: 'bp3', businessName: 'Fresh Grocery Market' },
  { id: 'bp4', businessName: 'Tech Solutions Inc.' },
  { id: 'bp5', businessName: 'Green Energy Corp' }
];

const CreateDealForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    businessProfileId: "",
    businessName: "",
    state: "",
    businessDate: "",
    revenueType: "",
    monthlyRevenueAvg: "",
    depositMonth1: "",
    depositMonth2: "",
    depositMonth3: "",
    depositMonth4: "",
    positions: "",
    nsfs: "",
    fico: "",
    entityType: "",
    rawIndustry: "",
    hasDefaults: "",
    defaultsSettled: ""
  });

  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'businessProfileId') {
      const selectedProfile = MOCK_BUSINESS_PROFILES.find(p => p.id === value);
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        businessName: selectedProfile?.businessName || ""
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const getFilteredIndustry = (rawIndustry: string) => {
    return INDUSTRY_MAPPING[rawIndustry as keyof typeof INDUSTRY_MAPPING] || "";
  };

  const validateForm = () => {
    const required = ['businessProfileId', 'state', 'businessDate', 'revenueType', 'positions', 'nsfs', 'fico', 'entityType', 'rawIndustry', 'hasDefaults'];
    
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        return false;
      }
    }

    if (formData.revenueType === "Average" && !formData.monthlyRevenueAvg) {
      return false;
    }

    if (formData.revenueType === "seperate" && 
        (!formData.depositMonth1 || !formData.depositMonth2 || !formData.depositMonth3 || !formData.depositMonth4)) {
      return false;
    }

    if (formData.hasDefaults === "yes" && !formData.defaultsSettled) {
      return false;
    }

    const ficoScore = parseInt(formData.fico);
    if (ficoScore < 300 || ficoScore > 900) {
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Form validation failed",
        description: "Please fill in all required fields correctly.",
      });
      return;
    }

    setSubmitting(true);

    // Simulate form submission and save to localStorage for dashboard display
    setTimeout(() => {
      const newDeal = {
        id: `deal_${Date.now()}`,
        businessName: formData.businessName,
        status: 'Processing',
        amount: formData.revenueType === "Average" 
          ? `$${(parseInt(formData.monthlyRevenueAvg) * 6).toLocaleString()}` 
          : `$${((parseInt(formData.depositMonth1) + parseInt(formData.depositMonth2) + parseInt(formData.depositMonth3) + parseInt(formData.depositMonth4)) * 1.5).toLocaleString()}`,
        date: new Date().toISOString().split('T')[0],
        formData: formData
      };

      // Save to localStorage (in real app, this would be an API call)
      const existingDeals = JSON.parse(localStorage.getItem('createdDeals') || '[]');
      existingDeals.push(newDeal);
      localStorage.setItem('createdDeals', JSON.stringify(existingDeals));
      
      toast({
        title: "Deal created successfully!",
        description: `${formData.businessName} deal has been created and is now processing.`,
      });
      
      setSubmitting(false);
      navigate("/broker/dashboard");
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/broker/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create New Deal - Form Input</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Manually enter deal information instead of uploading documents.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Business Information
                </CardTitle>
                <CardDescription>
                  Select business profile and basic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessProfile">Business Profile *</Label>
                    <Select value={formData.businessProfileId} onValueChange={(value) => handleInputChange('businessProfileId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business profile" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_BUSINESS_PROFILES.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.businessName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessDate">Business Start Date *</Label>
                  <Input
                    id="businessDate"
                    type="date"
                    value={formData.businessDate}
                    onChange={(e) => handleInputChange('businessDate', e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Information</CardTitle>
                <CardDescription>
                  Choose how to provide revenue data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Revenue Type *</Label>
                  <RadioGroup 
                    value={formData.revenueType} 
                    onValueChange={(value) => handleInputChange('revenueType', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Average" id="average" />
                      <Label htmlFor="average">Average</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="seperate" id="seperate" />
                      <Label htmlFor="seperate">Separate</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.revenueType === "Average" && (
                  <div className="space-y-2">
                    <Label htmlFor="monthlyRevenueAvg">Monthly Revenue Average (last 6 months) *</Label>
                    <Input
                      id="monthlyRevenueAvg"
                      type="number"
                      value={formData.monthlyRevenueAvg}
                      onChange={(e) => handleInputChange('monthlyRevenueAvg', e.target.value)}
                      placeholder="Enter average monthly revenue"
                      required
                    />
                  </div>
                )}

                {formData.revenueType === "seperate" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="depositMonth1">Deposit Month 1 *</Label>
                      <Input
                        id="depositMonth1"
                        type="number"
                        value={formData.depositMonth1}
                        onChange={(e) => handleInputChange('depositMonth1', e.target.value)}
                        placeholder="Enter amount"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="depositMonth2">Deposit Month 2 *</Label>
                      <Input
                        id="depositMonth2"
                        type="number"
                        value={formData.depositMonth2}
                        onChange={(e) => handleInputChange('depositMonth2', e.target.value)}
                        placeholder="Enter amount"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="depositMonth3">Deposit Month 3 *</Label>
                      <Input
                        id="depositMonth3"
                        type="number"
                        value={formData.depositMonth3}
                        onChange={(e) => handleInputChange('depositMonth3', e.target.value)}
                        placeholder="Enter amount"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="depositMonth4">Deposit Month 4 *</Label>
                      <Input
                        id="depositMonth4"
                        type="number"
                        value={formData.depositMonth4}
                        onChange={(e) => handleInputChange('depositMonth4', e.target.value)}
                        placeholder="Enter amount"
                        required
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Details</CardTitle>
                <CardDescription>
                  Additional financial and business metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="positions">Positions *</Label>
                    <Input
                      id="positions"
                      type="number"
                      value={formData.positions}
                      onChange={(e) => handleInputChange('positions', e.target.value)}
                      placeholder="Number of positions"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nsfs">NSFs *</Label>
                    <Input
                      id="nsfs"
                      type="number"
                      value={formData.nsfs}
                      onChange={(e) => handleInputChange('nsfs', e.target.value)}
                      placeholder="Number of NSFs"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fico">FICO Score (300-900) *</Label>
                    <Input
                      id="fico"
                      type="number"
                      min="300"
                      max="900"
                      value={formData.fico}
                      onChange={(e) => handleInputChange('fico', e.target.value)}
                      placeholder="Enter FICO score"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Classification</CardTitle>
                <CardDescription>
                  Entity type and industry information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entityType">Entity Type *</Label>
                    <Select value={formData.entityType} onValueChange={(value) => handleInputChange('entityType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select entity type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ENTITY_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rawIndustry">Raw Industry *</Label>
                    <Select value={formData.rawIndustry} onValueChange={(value) => handleInputChange('rawIndustry', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {RAW_INDUSTRIES.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {formData.rawIndustry && (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      <strong>Filtered Industry:</strong> {getFilteredIndustry(formData.rawIndustry)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Credit History</CardTitle>
                <CardDescription>
                  Information about defaults and bankruptcies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Any Defaults/BKs (Bankruptcies)? *</Label>
                  <RadioGroup 
                    value={formData.hasDefaults} 
                    onValueChange={(value) => handleInputChange('hasDefaults', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="defaults-yes" />
                      <Label htmlFor="defaults-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="defaults-no" />
                      <Label htmlFor="defaults-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.hasDefaults === "yes" && (
                  <div className="space-y-3">
                    <Label>Were they settled? *</Label>
                    <RadioGroup 
                      value={formData.defaultsSettled} 
                      onValueChange={(value) => handleInputChange('defaultsSettled', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="settled-yes" />
                        <Label htmlFor="settled-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="settled-no" />
                        <Label htmlFor="settled-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submit Deal</CardTitle>
                <CardDescription>
                  Review and submit your deal information
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/broker/dashboard')}
                  className="w-full md:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={submitting || !validateForm()}
                  className="w-full md:w-auto"
                >
                  {submitting ? "Creating Deal..." : "Create Deal"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateDealForm;
