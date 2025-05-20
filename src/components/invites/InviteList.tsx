
import { useState } from 'react';
import { Invite } from '@/types/invite';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X, Loader, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useInvite } from '@/contexts/InviteContext';

interface InviteListProps {
  invites: Invite[];
}

const InviteList = ({ invites }: InviteListProps) => {
  const { resendInvite, cancelInvite, loading } = useInvite();
  const [actioningId, setActioningId] = useState<string | null>(null);
  
  const handleResend = async (id: string) => {
    setActioningId(id);
    try {
      await resendInvite(id);
    } finally {
      setActioningId(null);
    }
  };
  
  const handleCancel = async (id: string) => {
    setActioningId(id);
    try {
      await cancelInvite(id);
    } finally {
      setActioningId(null);
    }
  };
  
  const getStatusBadge = (status: Invite['status']) => {
    switch (status) {
      case 'accepted':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
            <Check className="mr-1 h-3 w-3" />
            Accepted
          </Badge>
        );
      case 'declined':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
            <X className="mr-1 h-3 w-3" />
            Declined
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200">
            <Loader className="mr-1 h-3 w-3 animate-spin" />
            Pending
          </Badge>
        );
    }
  };
  
  if (invites.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">No invitations sent yet</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Firm</TableHead>
          <TableHead>Sent</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invites.map((invite) => (
          <TableRow key={invite.id}>
            <TableCell className="font-medium">{invite.email}</TableCell>
            <TableCell className="capitalize">{invite.role}</TableCell>
            <TableCell>{invite.firmName || '-'}</TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(invite.createdAt), { addSuffix: true })}
            </TableCell>
            <TableCell>{getStatusBadge(invite.status)}</TableCell>
            <TableCell className="text-right">
              {invite.status === 'pending' && (
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleResend(invite.id)}
                    disabled={loading || actioningId === invite.id}
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    {actioningId === invite.id ? 'Sending...' : 'Resend'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCancel(invite.id)}
                    disabled={loading || actioningId === invite.id}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InviteList;
