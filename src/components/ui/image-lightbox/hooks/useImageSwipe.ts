
import { useState } from "react";

interface UseImageSwipeProps {
  goToPreviousImage: (scale: number) => void;
  goToNextImage: (scale: number) => void;
}

export const useImageSwipe = ({ 
  goToPreviousImage, 
  goToNextImage 
}: UseImageSwipeProps) => {
  const [swipeDirection, setSwipeDirection] = useState<null | "left" | "right">(null);
  const [startX, setStartX] = useState(0);
  const [dragging, setDragging] = useState(false);
  
  const handleSwipeStart = (e: React.TouchEvent | React.MouseEvent, scale: number) => {
    if (scale > 1) return;
    
    if ('touches' in e) {
      setStartX(e.touches[0].clientX);
    } else {
      setStartX(e.clientX);
    }
    
    setDragging(true);
  };
  
  const handleSwipeMove = (e: React.TouchEvent | React.MouseEvent, scale: number) => {
    if (scale > 1 || !dragging) return;
    
    let currentX: number;
    
    if ('touches' in e) {
      currentX = e.touches[0].clientX;
    } else {
      currentX = e.clientX;
    }
    
    const diff = startX - currentX;
    
    if (diff > 50) {
      setSwipeDirection("right");
    } else if (diff < -50) {
      setSwipeDirection("left");
    } else {
      setSwipeDirection(null);
    }
  };
  
  const handleSwipeEnd = (scale: number) => {
    if (scale > 1) return;
    
    if (dragging) {
      if (swipeDirection === "right") {
        goToNextImage(scale);
      } else if (swipeDirection === "left") {
        goToPreviousImage(scale);
      }
    }
    
    setDragging(false);
    setSwipeDirection(null);
  };
  
  return {
    swipeDirection,
    dragging: dragging && swipeDirection !== null,
    handleSwipeStart,
    handleSwipeMove,
    handleSwipeEnd
  };
};
