
import React from 'react';
import { NicheInfo } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface NicheDetailProps {
  niche: NicheInfo;
  onClose: () => void;
}

const NicheDetail: React.FC<NicheDetailProps> = ({ niche, onClose }) => {
  const getStatusBadgeClass = (status: NicheInfo['status']) => {
    switch (status) {
      case 'available':
        return 'bg-success/20 text-success hover:bg-success/30';
      case 'reserved':
        return 'bg-warning/20 text-warning hover:bg-warning/30';
      case 'occupied':
        return 'bg-info/20 text-info hover:bg-info/30';
      case 'maintenance':
        return 'bg-error/20 text-error hover:bg-error/30';
      default:
        return 'bg-gray-200 text-gray-800 hover:bg-gray-300';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Niche Details
            <Badge className={getStatusBadgeClass(niche.status)}>
              {niche.status.charAt(0).toUpperCase() + niche.status.slice(1)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Location: Row {niche.row + 1}, Column {niche.column + 1}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <p className="text-sm font-medium">ID:</p>
            <p className="col-span-2 text-sm">{niche.id}</p>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <p className="text-sm font-medium">Position:</p>
            <p className="col-span-2 text-sm">Row {niche.row + 1}, Column {niche.column + 1}</p>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <p className="text-sm font-medium">Status:</p>
            <p className="col-span-2 text-sm">{niche.status.charAt(0).toUpperCase() + niche.status.slice(1)}</p>
          </div>
          
          {niche.deceasedName && (
            <div className="grid grid-cols-3 items-center gap-4">
              <p className="text-sm font-medium">Deceased:</p>
              <p className="col-span-2 text-sm">{niche.deceasedName}</p>
            </div>
          )}
          
          {niche.expirationDate && (
            <div className="grid grid-cols-3 items-center gap-4">
              <p className="text-sm font-medium">Expires:</p>
              <p className="col-span-2 text-sm">{formatDate(niche.expirationDate, 'short')}</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={onClose}>Close</Button>
          
          {niche.status === 'available' && (
            <Button>Reserve Niche</Button>
          )}
          
          {niche.status === 'reserved' && (
            <div className="flex gap-2">
              <Button variant="destructive">Cancel Reservation</Button>
              <Button>Assign Deceased</Button>
            </div>
          )}
          
          {niche.status === 'maintenance' && (
            <Button>Mark as Available</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NicheDetail;
