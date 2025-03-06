
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { LightboxImage } from "../types";

interface UseImageNavigationProps {
  images: LightboxImage[];
  initialIndex: number;
  open: boolean;
}

export const useImageNavigation = ({ 
  images, 
  initialIndex, 
  open 
}: UseImageNavigationProps) => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  // Reset current index when lightbox opens
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, open]);
  
  const goToPreviousImage = (scale: number) => {
    if (scale > 1) {
      toast({
        title: "Zoom attivo",
        description: "Riduci lo zoom per navigare tra le foto",
        variant: "default"
      });
      return;
    }
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = (scale: number) => {
    if (scale > 1) {
      toast({
        title: "Zoom attivo",
        description: "Riduci lo zoom per navigare tra le foto",
        variant: "default"
      });
      return;
    }
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const currentImage = images[currentIndex];
  
  return {
    currentIndex,
    currentImage,
    goToPreviousImage,
    goToNextImage
  };
};
