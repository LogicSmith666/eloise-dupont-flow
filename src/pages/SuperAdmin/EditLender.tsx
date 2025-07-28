import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import LenderForm from "@/components/forms/LenderForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Mock function to get lender by ID (replace with actual API call)
const getLenderById = (id: string) => {
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
          maxNsfs: 3,
          restrictedStates: ['CA', 'NY'],
          restrictedIndustries: ['Gambling'],
          restrictedEntityTypes: ['Non-Profit'],
          conditionalIndustries: ['Agriculture', 'Agriculture - Cattle Ranch'],
          bkPolicy: 'case-by-case',
          conditionalRevenues: [
            { industry: 'Agriculture', revenue: 75000 },
            { industry: 'Agriculture - Cattle Ranch', revenue: 100000 }
          ]
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
          maxNsfs: 2,
          restrictedStates: [],
          restrictedIndustries: [],
          restrictedEntityTypes: [],
          conditionalIndustries: [],
          bkPolicy: 'flexible',
          conditionalRevenues: []
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
          maxNsfs: 5,
          restrictedStates: [],
          restrictedIndustries: [],
          restrictedEntityTypes: [],
          conditionalIndustries: [],
          bkPolicy: 'strict',
          conditionalRevenues: []
        }
      ]
    }
  ];
  
  return MOCK_LENDERS.find(lender => lender.id === id);
};

const EditLender = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lender, setLender] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const lenderData = getLenderById(id);
      setLender(lenderData);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!lender) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/super-admin/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">Lender not found</h2>
            <p className="text-muted-foreground mt-2">
              The requested lender could not be found.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/super-admin/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Lender</h1>
          <p className="text-muted-foreground">
            Update lender information and configurations for {lender.name}.
          </p>
        </div>
        
        <LenderForm initialData={lender} isEditing />
      </div>
    </DashboardLayout>
  );
};

export default EditLender;