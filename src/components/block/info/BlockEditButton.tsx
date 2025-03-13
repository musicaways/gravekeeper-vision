
import React from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BlockEditButtonProps {
  onClick: () => void;
}

const BlockEditButton: React.FC<BlockEditButtonProps> = ({ onClick }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={onClick}
            size="icon"
            className="fixed right-6 bottom-6 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
          >
            <Pencil className="h-6 w-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Modifica informazioni</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BlockEditButton;
