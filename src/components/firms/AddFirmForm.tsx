
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AddFirmFormProps {
  onComplete: (firmId: string, firmName: string) => void;
}

const AddFirmForm = ({ onComplete }: AddFirmFormProps) => {
  const [firmName, setFirmName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddFirm = async () => {
    if (!firmName.trim()) return;
    
    setIsAdding(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock firm ID
      const firmId = `firm-${Date.now()}`;
      
      toast({
        title: "Firm created",
        description: `${firmName} has been created successfully`,
      });
      
      onComplete(firmId, firmName);
      setFirmName('');
    } catch (error) {
      console.error('Add firm error:', error);
      toast({
        variant: "destructive",
        title: "Failed to create firm",
        description: "An error occurred while creating the firm",
      });
    } finally {
      setIsAdding(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add New Firm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firm-name">Firm Name</Label>
          <Input
            id="firm-name"
            placeholder="Enter firm name"
            value={firmName}
            onChange={(e) => setFirmName(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleAddFirm} 
          disabled={!firmName || isAdding}
          className="w-full"
        >
          <Building className="mr-2 h-4 w-4" />
          {isAdding ? 'Creating...' : 'Create Firm'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddFirmForm;
