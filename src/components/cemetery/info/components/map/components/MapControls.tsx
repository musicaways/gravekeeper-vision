
import React from "react";
import { Button } from "@/components/ui/button";

interface MapControlsProps {
  onOpenInGoogleMaps: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ 
  onOpenInGoogleMaps 
}) => {
  return (
    <div className="flex justify-start items-center">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onOpenInGoogleMaps}
        className="flex items-center gap-1 text-xs"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-navigation"
        >
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
        Apri in Google Maps
      </Button>
    </div>
  );
};

export default MapControls;
