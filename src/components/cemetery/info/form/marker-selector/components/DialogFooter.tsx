
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface DialogFooterProps {
  selectedMarkerId: string | null;
  onCancel: () => void;
  onConfirm: () => void;
  isMobile?: boolean;
}

const DialogFooter = ({ selectedMarkerId, onCancel, onConfirm, isMobile = false }: DialogFooterProps) => {
  return (
    <div className={`p-3 border-t ${isMobile ? 'flex flex-col gap-2' : 'flex items-center justify-between'} bg-muted/10`}>
      <div className={`${isMobile ? 'w-full text-center mb-1' : 'text-sm flex-1'}`}>
        {selectedMarkerId ? (
          <div className={`text-green-600 font-medium ${isMobile ? 'text-sm flex flex-col items-center gap-1' : 'flex items-center gap-1'}`}>
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-1" /> Marker selezionato
            </div>
            <span className="text-xs bg-green-50 px-2 py-0.5 rounded border border-green-200 max-w-full truncate">
              {selectedMarkerId}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">Nessun marker selezionato</span>
        )}
      </div>
      <div className={`${isMobile ? 'grid grid-cols-2 gap-2 w-full' : 'space-x-2 flex'}`}>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel} 
          className={`${isMobile ? 'w-full' : 'h-9'}`}
        >
          <X className="h-4 w-4 mr-1.5" /> Annulla
        </Button>
        <Button 
          onClick={onConfirm} 
          disabled={!selectedMarkerId}
          size="sm"
          className={`bg-primary ${isMobile ? 'w-full' : 'h-9'}`}
        >
          <Check className="h-4 w-4 mr-1.5" /> Conferma
        </Button>
      </div>
    </div>
  );
};

export default DialogFooter;
