
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
    <div className="text-center py-6 bg-muted/30 rounded-md">
      <Map className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
      <p className="text-muted-foreground mb-2">{message}</p>
      {buttonText && buttonAction && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={buttonAction}
          className="text-xs"
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default MapErrorState;
