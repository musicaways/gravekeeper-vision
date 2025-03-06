
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface UseImageDragProps {
  setPosition: (pos: { x: number; y: number }) => void;
}

export const useImageDrag = ({ setPosition }: UseImageDragProps) => {
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  
  // Start image dragging (panning) when zoomed in
  const handleImageDragStart = (e: React.MouseEvent | React.TouchEvent, scale: number, position: { x: number; y: number }) => {
    if (scale <= 1) return;
    
    e.stopPropagation();
    e.preventDefault();
    setDragging(true);
    
    if ('touches' in e) {
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    } else {
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  // Handle image dragging (panning) movement
  const handleImageDrag = (e: React.MouseEvent | React.TouchEvent, scale: number) => {
    if (!dragging || scale <= 1) return;
    
    e.stopPropagation();
    if ('touches' in e) {
      e.preventDefault(); // Only prevent default for touch events
    }
    
    let newX: number, newY: number;
    
    if ('touches' in e) {
      newX = e.touches[0].clientX - dragStart.x;
      newY = e.touches[0].clientY - dragStart.y;
    } else {
      newX = e.clientX - dragStart.x;
      newY = e.clientY - dragStart.y;
    }

    // Add bounds to prevent dragging too far
    const maxDrag = (scale - 1) * 500; // Limit based on scale
    newX = Math.min(Math.max(newX, -maxDrag), maxDrag);
    newY = Math.min(Math.max(newY, -maxDrag), maxDrag);
    
    setPosition({ x: newX, y: newY });
  };

  // End image dragging
  const handleImageDragEnd = () => {
    setDragging(false);
  };
  
  return {
    dragging,
    handleImageDragStart,
    handleImageDrag,
    handleImageDragEnd
  };
};
