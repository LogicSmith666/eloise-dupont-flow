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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LenderTypeConfigurationComponent, { LenderTypeConfiguration } from "./LenderTypeConfiguration";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" }
];

const formSchema = z.object({
  lenderName: z.string().min(1, "Lender name is required"),
  status: z.string().min(1, "Status is required"),
});

type FormData = z.infer<typeof formSchema>;

interface LenderFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const LenderForm = ({ initialData, isEditing = false }: LenderFormProps) => {
  const { toast } = useToast();
  const [lenderTypeConfigs, setLenderTypeConfigs] = useState<LenderTypeConfiguration[]>(
    initialData?.configurations || []
  );
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lenderName: initialData?.name || "",
      status: initialData?.status || "active",
    },
  });

  const addLenderTypeConfiguration = () => {
    const newConfig: LenderTypeConfiguration = {
      id: crypto.randomUUID(),
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
      conditionalRevenues: [],
    };
    setLenderTypeConfigs([...lenderTypeConfigs, newConfig]);
  };

  const updateLenderTypeConfiguration = (id: string, data: LenderTypeConfiguration) => {
    setLenderTypeConfigs(prev => 
      prev.map(config => config.id === id ? data : config)
    );
  };

  const removeLenderTypeConfiguration = (id: string) => {
    setLenderTypeConfigs(prev => prev.filter(config => config.id !== id));
  };

  const getUsedLenderTypes = () => {
    return lenderTypeConfigs
      .filter(config => config.lenderType)
      .map(config => config.lenderType);
  };

  const onSubmit = (data: FormData) => {
    if (lenderTypeConfigs.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one lender type configuration.",
        variant: "destructive",
      });
      return;
    }

    // Validate that all configurations are complete
    const incompleteConfigs = lenderTypeConfigs.filter(
      config => !config.lenderType || !config.bkPolicy
    );

    if (incompleteConfigs.length > 0) {
      toast({
        title: "Error",
        description: "Please complete all lender type configurations.",
        variant: "destructive",
      });
      return;
    }

    const lenderData = {
      ...data,
      lenderTypeConfigurations: lenderTypeConfigs,
      createdAt: new Date().toISOString(),
    };
    
    console.log("Lender Data:", lenderData);
    toast({
      title: "Success",
      description: isEditing ? "Lender updated successfully!" : "Lender created successfully!",
    });
    
    // Reset form
    form.reset();
    setLenderTypeConfigs([]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Lender' : 'Create New Lender'}</CardTitle>
          <CardDescription>
            {isEditing ? 'Update lender information and configurations.' : 'Add a new lender with basic information and lender type configurations.'}
          </CardDescription>
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

              <div className="flex justify-end">
                <Button type="submit" className="w-full">
                  {isEditing ? 'Update Lender' : 'Create Lender'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Lender Type Configurations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Lender Type Configurations</h2>
          <Button onClick={addLenderTypeConfiguration} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Lender Type
          </Button>
        </div>

        {lenderTypeConfigs.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                <p>No lender type configurations added yet.</p>
                <p className="text-sm mt-2">Click "Add Lender Type" to create your first configuration.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {lenderTypeConfigs.map((config) => (
          <LenderTypeConfigurationComponent
            key={config.id}
            configuration={config}
            onUpdate={updateLenderTypeConfiguration}
            onRemove={removeLenderTypeConfiguration}
            usedLenderTypes={getUsedLenderTypes()}
          />
        ))}
      </div>
    </div>
  );
};

export default LenderForm;
