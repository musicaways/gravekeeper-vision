
import React from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PhotoUploadButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const PhotoUploadButton: React.FC<PhotoUploadButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={onClick}
            size="icon"
            className="fixed right-6 bottom-6 w-14 h-14 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600"
            disabled={disabled}
          >
            <Camera className="h-6 w-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Carica nuova foto</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PhotoUploadButton;
