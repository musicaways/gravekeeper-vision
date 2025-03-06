
import { useState, useEffect } from "react";

interface UseImageZoomProps {
  open: boolean;
}

export const useImageZoom = ({ open }: UseImageZoomProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Reset zoom when lightbox opens
  useEffect(() => {
    if (open) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [open]);
  
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 }); // Reset position when fully zoomed out
      }
      return newScale;
    });
  };
  
  return {
    scale,
    position,
    setScale,
    setPosition,
    handleZoomIn,
    handleZoomOut
  };
};
