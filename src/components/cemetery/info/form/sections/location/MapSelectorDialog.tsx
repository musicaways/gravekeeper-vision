
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import MapSelector from "../map-selector/MapSelector";

interface MapSelectorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectLocation: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

const MapSelectorDialog = ({ 
  isOpen, 
  onOpenChange, 
  onSelectLocation,
  initialLat,
  initialLng
}: MapSelectorDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] h-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Seleziona posizione sulla mappa</DialogTitle>
          <DialogDescription>
            Fai clic sulla mappa per selezionare la posizione del cimitero
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 h-[450px] relative">
          <MapSelector 
            onSelectLocation={onSelectLocation} 
            initialLat={initialLat}
            initialLng={initialLng}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapSelectorDialog;
