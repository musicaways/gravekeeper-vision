
import React from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DeleteFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  fileTitle: string;
  isDeleting?: boolean;
}

const DeleteFileDialog = ({
  open,
  onOpenChange,
  onConfirm,
  fileTitle,
  isDeleting = false
}: DeleteFileDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Elimina file</DialogTitle>
          <DialogDescription>
            Sei sicuro di voler eliminare il file "{fileTitle}"?
            Questa azione non può essere annullata.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-row gap-2 justify-end mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Annulla
          </Button>
          
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminazione...
              </>
            ) : (
              'Elimina'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFileDialog;
