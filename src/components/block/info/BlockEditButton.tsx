
import React from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlockEditButtonProps {
  onClick: () => void;
}

const BlockEditButton: React.FC<BlockEditButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      size="sm"
      variant="outline"
      className="flex items-center gap-1 z-10 relative"
    >
      <Edit className="h-4 w-4" />
      <span>Modifica</span>
    </Button>
  );
};

export default BlockEditButton;
