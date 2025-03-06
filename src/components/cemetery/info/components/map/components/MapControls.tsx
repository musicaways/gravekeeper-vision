
import React from "react";
import { Button } from "@/components/ui/button";

interface MapControlsProps {
  onRefresh: () => void;
  onOpenInGoogleMaps: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ 
  onRefresh, 
  onOpenInGoogleMaps 
}) => {
  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        className="text-xs flex items-center gap-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-refresh-cw"
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
        Aggiorna mappa
      </Button>
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
