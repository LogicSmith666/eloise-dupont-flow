import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Constants
const LENDER_TYPES = ["Straight", "Consolidators", "Line Of Credits"];
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "District of Columbia"
];

const INDUSTRIES = [
  "Agriculture",
  "Agriculture - Cattle Ranch",
  "Agriculture - Farmer / Agriculture",
  "Arts / Creative",
  "Arts / Creative - Arts Studio / Gallery",
  "Arts / Creative - Music Studio",
  "Auto",
  "Auto - Auto Body Shop",
  "Auto - Auto Dealership",
  "Auto - Auto Repair",
  "Auto - Towing",
  "Restaurant",
  "Retail",
  "Construction",
  "Healthcare",
  "Technology",
  "Manufacturing",
  "Real Estate",
  "Transportation",
  "Professional Services",
  "Education",
  "Entertainment",
  "Finance",
  "Insurance",
  "Energy",
  "Telecommunications",
  "Media",
  "Tourism",
  "Automotive",
  "Other"
];

const ENTITY_TYPES = [
  "Corporation", "LLC", "Partnership", "Sole Proprietorship", "S-Corp", "Non-Profit"
];

const BK_POLICIES = [
  { value: "flexible", label: "Flexible - Doesn't matter if they have bankruptcies or defaults" },
  { value: "case-by-case", label: "Case-by-Case - Accept if no BKs/defaults OR if settled" },
  { value: "strict", label: "Strict - Reject if any BKs/defaults ever" }
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" }
];

// Get filtered industry for conditional revenue
const getFilteredIndustry = (industry: string): string => {
  if (industry.startsWith("Agriculture")) return "Agriculture";
  if (industry.startsWith("Arts / Creative")) return "Arts / Creative";
  if (industry.startsWith("Auto")) return "Auto";
  return industry;
};

const formSchema = z.object({
  lenderName: z.string().min(1, "Lender name is required"),
  lenderType: z.string().min(1, "Lender type is required"),
  minPos: z.number().min(0, "Must be 0 or greater"),
  maxPos: z.number().min(0, "Must be 0 or greater"),
  minTIB: z.number().min(0, "Must be 0 or greater"),
  minRevenue: z.number().min(0, "Must be 0 or greater"),
  minFico: z.number().min(300, "Must be between 300-850").max(850, "Must be between 300-850"),
  maxNsfs: z.number().min(0, "Must be 0 or greater"),
  restrictedStates: z.array(z.string()),
  conditionalIndustries: z.array(z.string()),
  restrictedEntityTypes: z.array(z.string()),
  restrictedIndustries: z.array(z.string()),
  bkPolicy: z.string().min(1, "BK Policy is required"),
  status: z.string().min(1, "Status is required"),
});

type FormData = z.infer<typeof formSchema>;

interface ConditionalRevenue {
  industry: string;
  revenue: number;
}

const LenderForm = () => {
  const { toast } = useToast();
  const [conditionalRevenues, setConditionalRevenues] = useState<ConditionalRevenue[]>([]);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lenderName: "",
      lenderType: "",
      minPos: 0,
      maxPos: 0,
      minTIB: 0,
      minRevenue: 0,
      minFico: 600,
      maxNsfs: 0,
      restrictedStates: [],
      conditionalIndustries: [],
      restrictedEntityTypes: [],
      restrictedIndustries: [],
      bkPolicy: "",
      status: "active",
    },
  });

  const handleMultiSelect = (field: any, value: string, currentValues: string[]) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    field.onChange(newValues);
  };

  const removeFromMultiSelect = (field: any, value: string, currentValues: string[]) => {
    field.onChange(currentValues.filter((v) => v !== value));
  };

  const handleConditionalIndustryChange = (field: any, value: string, currentValues: string[]) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    
    field.onChange(newValues);

    // Update conditional revenues
    if (newValues.includes(value) && !currentValues.includes(value)) {
      // Adding new industry
      const filteredIndustry = getFilteredIndustry(value);
      const newRevenues = [...conditionalRevenues];
      
      // Add revenue for specific industry
      if (!newRevenues.find(r => r.industry === value)) {
        newRevenues.push({ industry: value, revenue: 0 });
      }
      
      // Add revenue for filtered industry if different and not exists
      if (filteredIndustry !== value && !newRevenues.find(r => r.industry === filteredIndustry)) {
        newRevenues.push({ industry: filteredIndustry, revenue: 0 });
      }
      
      setConditionalRevenues(newRevenues);
    } else if (!newValues.includes(value) && currentValues.includes(value)) {
      // Removing industry - remove both specific and filtered industry revenues if no other industries use them
      const filteredIndustry = getFilteredIndustry(value);
      const remainingIndustries = newValues;
      
      setConditionalRevenues(prev => prev.filter(r => {
        if (r.industry === value) return false;
        if (r.industry === filteredIndustry) {
          // Keep filtered industry revenue if other industries still use it
          return remainingIndustries.some(ind => getFilteredIndustry(ind) === filteredIndustry);
        }
        return true;
      }));
    }
  };

  const updateConditionalRevenue = (industry: string, revenue: number) => {
    setConditionalRevenues(prev => 
      prev.map(r => r.industry === industry ? { ...r, revenue } : r)
    );
  };

  const onSubmit = (data: FormData) => {
    const lenderData = {
      ...data,
      conditionalRevenues,
      createdAt: new Date().toISOString(),
    };
    
    console.log("Lender Data:", lenderData);
    toast({
      title: "Lender Created",
      description: `${data.lenderName} has been successfully created.`,
    });
    
    // Reset form
    form.reset();
    setConditionalRevenues([]);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Lender</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lenderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lender Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter lender name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lenderType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lender Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select lender type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LENDER_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Numeric Criteria */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="minPos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Positions</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxPos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Positions</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minTIB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min TIB (months)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minRevenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Revenue ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minFico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min FICO Score</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="600" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxNsfs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max NSFs</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Multi-select fields */}
            <FormField
              control={form.control}
              name="restrictedStates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restricted States</FormLabel>
                  <Select onValueChange={(value) => handleMultiSelect(field, value, field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select states to restrict" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {US_STATES.filter(state => !field.value.includes(state)).map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((state) => (
                      <Badge key={state} variant="secondary" className="flex items-center gap-1">
                        {state}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFromMultiSelect(field, state, field.value)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditional Industries */}
            <FormField
              control={form.control}
              name="conditionalIndustries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conditional Industries</FormLabel>
                  <Select onValueChange={(value) => handleConditionalIndustryChange(field, value, field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select conditional industries" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INDUSTRIES.filter(industry => !field.value.includes(industry)).map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((industry) => (
                      <Badge key={industry} variant="secondary" className="flex items-center gap-1">
                        {industry}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleConditionalIndustryChange(field, industry, field.value)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditional Revenues */}
            {conditionalRevenues.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Conditional Revenue Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {conditionalRevenues.map((conditionalRevenue) => (
                    <div key={conditionalRevenue.industry} className="space-y-2">
                      <label className="text-sm font-medium">
                        {conditionalRevenue.industry} - Min Revenue ($)
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={conditionalRevenue.revenue}
                        onChange={(e) => updateConditionalRevenue(conditionalRevenue.industry, Number(e.target.value))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Restricted Entity Types */}
            <FormField
              control={form.control}
              name="restrictedEntityTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restricted Entity Types</FormLabel>
                  <Select onValueChange={(value) => handleMultiSelect(field, value, field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select entity types to restrict" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ENTITY_TYPES.filter(type => !field.value.includes(type)).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((type) => (
                      <Badge key={type} variant="secondary" className="flex items-center gap-1">
                        {type}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFromMultiSelect(field, type, field.value)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Restricted Industries */}
            <FormField
              control={form.control}
              name="restrictedIndustries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restricted Industries</FormLabel>
                  <Select onValueChange={(value) => handleMultiSelect(field, value, field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industries to restrict" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INDUSTRIES.filter(industry => !field.value.includes(industry)).map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((industry) => (
                      <Badge key={industry} variant="secondary" className="flex items-center gap-1">
                        {industry}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFromMultiSelect(field, industry, field.value)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Policies and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bkPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default/BK Policy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select BK policy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BK_POLICIES.map((policy) => (
                          <SelectItem key={policy.value} value={policy.value}>
                            {policy.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Create Lender
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LenderForm;
