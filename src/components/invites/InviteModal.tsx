
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import InviteForm from './InviteForm';
import { UserPlus } from 'lucide-react';

interface InviteModalProps {
  title: string;
  description: string;
  triggerText: string;
  role: 'superadmin' | 'firmadmin';
  firms?: Array<{ id: string; name: string }>;
  firmId?: string;
}

const InviteModal = ({ 
  title, 
  description, 
  triggerText, 
  role, 
  firms, 
  firmId 
}: InviteModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <InviteForm 
          role={role} 
          firms={firms} 
          firmId={firmId} 
          onComplete={() => setIsOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
