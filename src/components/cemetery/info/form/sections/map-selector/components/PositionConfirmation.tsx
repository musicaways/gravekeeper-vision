
import React from "react";
import { Button } from "@/components/ui/button";

interface PositionConfirmationProps {
  selectedPosition: { lat: number, lng: number } | null;
  onConfirm: () => void;
}

const PositionConfirmation: React.FC<PositionConfirmationProps> = ({
  selectedPosition,
  onConfirm
}) => {
  return (
    <div className="mt-4">
      {selectedPosition && (
        <div className="text-sm mb-2 text-center">
          <span className="font-medium">Posizione selezionata:</span> {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
        </div>
      )}
      
      <div className="flex justify-center">
        <Button
          onClick={onConfirm}
          disabled={!selectedPosition}
          className="px-6"
        >
          Conferma posizione
        </Button>
      </div>
    </div>
  );
};

export default PositionConfirmation;
