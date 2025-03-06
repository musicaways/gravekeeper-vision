
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
    setScale((prev) => {
      const newScale = Math.min(prev + 0.5, 3);
      return newScale;
    });
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

  // Double click/tap to zoom in or reset
  const handleDoubleClick = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (scale > 1) {
      // Reset zoom
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      // Zoom in to 2x
      setScale(2);
    }
  };
  
  return {
    scale,
    position,
    setScale,
    setPosition,
    handleZoomIn,
    handleZoomOut,
    handleDoubleClick
  };
};
