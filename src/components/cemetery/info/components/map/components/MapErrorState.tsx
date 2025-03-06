
import React from "react";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapErrorStateProps {
  message: string;
  buttonText?: string;
  buttonAction?: () => void;
}

const MapErrorState: React.FC<MapErrorStateProps> = ({ 
  message, 
  buttonText, 
  buttonAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 bg-muted/30 rounded-md border border-border">
      <div className="bg-muted/50 p-4 rounded-full mb-3">
        <Map className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground mb-4 text-center max-w-md">{message}</p>
      {buttonText && buttonAction && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={buttonAction}
          className="text-xs flex items-center gap-1.5"
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default MapErrorState;
