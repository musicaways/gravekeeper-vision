
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Map } from "lucide-react";
import { useCustomMapMarker } from "./hooks/useCustomMapMarker";
import InstructionsPanel from "./components/InstructionsPanel";
import MapContainer from "./components/MapContainer";
import DialogFooter from "./components/DialogFooter";
import { setupMapScript } from "./helpers/mapScriptSetup";

interface CustomMapMarkerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (markerId: string) => void;
  customMapId: string;
  initialMarkerId?: string;
  cemeteryCoordinates?: {
    latitude: number | null;
    longitude: number | null;
  };
}

// Set up the map script globally when this module is loaded
setupMapScript();

const CustomMapMarkerDialog = ({
  open,
  onClose,
  onSelect,
  customMapId,
  initialMarkerId,
  cemeteryCoordinates
}: CustomMapMarkerDialogProps) => {
  const {
    mapLoaded,
    showInstructions,
    selectedMarkerId,
    mapError,
    mapUrl,
    iframeRef,
    setShowInstructions,
    injectScript,
    handleIframeError,
    confirmSelection,
    handleManualInput
  } = useCustomMapMarker({
    initialMarkerId,
    customMapId,
    cemeteryCoordinates,
    onSelect
  });
  
  // Handle confirmation and close dialog
  const handleConfirm = () => {
    const success = confirmSelection();
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Seleziona marker dalla mappa personalizzata
          </DialogTitle>
          <DialogDescription>
            Clicca su un marker nella mappa per selezionarlo e collegarlo a questo cimitero
          </DialogDescription>
        </DialogHeader>
        
        <InstructionsPanel 
          showInstructions={showInstructions} 
          onHideInstructions={() => setShowInstructions(false)} 
        />
        
        <MapContainer 
          mapUrl={mapUrl}
          mapError={mapError}
          mapLoaded={mapLoaded}
          iframeRef={iframeRef}
          onIframeLoad={injectScript}
          onIframeError={handleIframeError}
          onManualInput={handleManualInput}
        />
        
        <DialogFooter 
          selectedMarkerId={selectedMarkerId}
          onCancel={onClose}
          onConfirm={handleConfirm}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CustomMapMarkerDialog;
