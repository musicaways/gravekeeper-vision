
import { useState } from "react";

interface UseImageDragProps {
  setPosition: (pos: { x: number; y: number }) => void;
}

export const useImageDrag = ({ setPosition }: UseImageDragProps) => {
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Start image dragging (panning) when zoomed in
  const handleImageDragStart = (e: React.MouseEvent | React.TouchEvent, scale: number, position: { x: number; y: number }) => {
    if (scale <= 1) return;
    
    e.stopPropagation();
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
    e.preventDefault();
    
    let newX: number, newY: number;
    
    if ('touches' in e) {
      newX = e.touches[0].clientX - dragStart.x;
      newY = e.touches[0].clientY - dragStart.y;
    } else {
      newX = e.clientX - dragStart.x;
      newY = e.clientY - dragStart.y;
    }

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
