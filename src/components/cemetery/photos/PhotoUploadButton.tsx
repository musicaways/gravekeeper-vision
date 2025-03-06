
import React from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface PhotoUploadButtonProps {
  onClick: () => void;
}

const PhotoUploadButton: React.FC<PhotoUploadButtonProps> = ({ onClick }) => {
  return (
    <Button 
      onClick={onClick}
      size="icon"
      className="fixed right-6 bottom-6 w-14 h-14 rounded-full shadow-lg"
    >
      <Camera className="h-6 w-6" />
    </Button>
  );
};

export default PhotoUploadButton;
