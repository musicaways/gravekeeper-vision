
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface DialogFooterProps {
  selectedMarkerId: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const DialogFooter = ({ selectedMarkerId, onCancel, onConfirm }: DialogFooterProps) => {
  return (
    <div className="p-4 border-t flex items-center justify-between bg-muted/10">
      <div className="text-sm flex-1">
        {selectedMarkerId ? (
          <span className="text-green-600 font-medium flex items-center gap-1">
            <Check className="h-4 w-4" /> Marker selezionato: 
            <span className="text-xs bg-green-50 px-2 py-0.5 rounded border border-green-200 max-w-[200px] truncate">
              {selectedMarkerId}
            </span>
          </span>
        ) : (
          <span className="text-muted-foreground">Nessun marker selezionato</span>
        )}
      </div>
      <div className="space-x-2 flex">
        <Button variant="outline" size="sm" onClick={onCancel} className="h-9">
          <X className="h-4 w-4 mr-1.5" /> Annulla
        </Button>
        <Button 
          onClick={onConfirm} 
          disabled={!selectedMarkerId}
          size="sm"
          className="h-9 bg-primary"
        >
          <Check className="h-4 w-4 mr-1.5" /> Conferma selezione
        </Button>
      </div>
    </div>
  );
};

export default DialogFooter;
