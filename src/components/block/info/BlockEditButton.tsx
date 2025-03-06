
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlockEditButtonProps {
  onClick: () => void;
}

const BlockEditButton: React.FC<BlockEditButtonProps> = ({ onClick }) => {
  return (
    <Button 
      onClick={onClick}
      size="icon"
      variant="secondary"
      className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-md z-10 bg-primary hover:bg-primary-dark text-white transition-all duration-300"
    >
      <Edit className="h-5 w-5" />
    </Button>
  );
};

export default BlockEditButton;
