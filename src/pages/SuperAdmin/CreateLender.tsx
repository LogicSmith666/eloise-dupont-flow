import DashboardLayout from "@/components/layouts/DashboardLayout";
import LenderForm from "@/components/forms/LenderForm";

const CreateLender = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Lender</h1>
          <p className="text-muted-foreground">
            Add a new lender to the platform with specific criteria and requirements.
          </p>
        </div>
        
        <LenderForm />
      </div>
    </DashboardLayout>
  );
};

export default CreateLender;