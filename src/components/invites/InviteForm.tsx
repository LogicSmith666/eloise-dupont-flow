
import { useState } from 'react';
import { useInvite } from '@/contexts/InviteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { UserRole } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

interface InviteFormProps {
  role: 'superadmin' | 'firmadmin';
  firms?: Array<{ id: string; name: string }>;
  firmId?: string;
  onComplete?: () => void;
}

const InviteForm = ({ role, firms, firmId, onComplete }: InviteFormProps) => {
  const { sendInvite, loading } = useInvite();
  const [email, setEmail] = useState('');
  const [selectedFirmId, setSelectedFirmId] = useState(firmId || '');
  const [isSending, setIsSending] = useState(false);
  
  const handleSendInvite = async () => {
    if (!email) return;
    
    // For firm admin sending to broker, we already have the firmId
    const targetRole: UserRole = role === 'superadmin' ? 'firmadmin' : 'broker';
    const targetFirmId = role === 'superadmin' ? selectedFirmId : firmId;
    
    setIsSending(true);
    
    try {
      await sendInvite(email, targetRole, targetFirmId);
      setEmail('');
      if (role === 'superadmin') setSelectedFirmId('');
      if (onComplete) onComplete();
    } catch (error) {
      console.error('Send invite error:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {role === 'superadmin' ? 'Invite Firm Admin' : 'Invite Broker'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        {role === 'superadmin' && firms && (
          <div className="space-y-2">
            <Label htmlFor="firm">Select Firm</Label>
            <Select value={selectedFirmId} onValueChange={setSelectedFirmId}>
              <SelectTrigger id="firm">
                <SelectValue placeholder="Select a firm" />
              </SelectTrigger>
              <SelectContent>
                {firms.map((firm) => (
                  <SelectItem key={firm.id} value={firm.id}>
                    {firm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSendInvite} 
          disabled={
            !email || 
            (role === 'superadmin' && !selectedFirmId) || 
            isSending || 
            loading
          }
          className="w-full"
        >
          <Mail className="mr-2 h-4 w-4" />
          {isSending ? 'Sending...' : 'Send Invitation'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InviteForm;
