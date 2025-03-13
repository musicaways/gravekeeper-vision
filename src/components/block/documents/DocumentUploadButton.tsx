
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DocumentUploadButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const DocumentUploadButton: React.FC<DocumentUploadButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={onClick}
            size="icon"
            className="fixed right-6 bottom-6 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            disabled={disabled}
          >
            <Upload className="h-6 w-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Carica nuovo file</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DocumentUploadButton;
