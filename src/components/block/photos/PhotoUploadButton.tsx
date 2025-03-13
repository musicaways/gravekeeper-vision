
import React from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";

interface PhotoUploadButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const PhotoUploadButton: React.FC<PhotoUploadButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <Button 
      variant="outline" 
      className="w-full flex items-center gap-2"
      onClick={onClick}
      disabled={disabled}
    >
      <ImagePlus className="h-4 w-4" />
      <span>Carica una nuova foto</span>
    </Button>
  );
};

export default PhotoUploadButton;
