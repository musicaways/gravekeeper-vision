
import { useState, useRef, useCallback } from 'react';

interface UseSwipeNavigationProps {
  currentIndex: number;
  filesLength: number;
  goToPreviousFile: () => void;
  goToNextFile: () => void;
  swipeEnabled: boolean;
  scale?: number;
}

export const useSwipeNavigation = ({
  currentIndex,
  filesLength,
  goToPreviousFile,
  goToNextFile,
  swipeEnabled,
  scale = 1
}: UseSwipeNavigationProps) => {
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const swipeThreshold = 80; // minimum distance in pixels to trigger a swipe
  
  const resetSwipeState = useCallback(() => {
    touchStartX.current = null;
    touchEndX.current = null;
    setSwipeDirection(null);
  }, []);
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!swipeEnabled || (scale && scale > 1)) {
      return;
    }
    
    touchStartX.current = e.touches[0].clientX;
    console.log("Touch start event captured for swipe navigation");
  }, [swipeEnabled, scale]);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swipeEnabled || touchStartX.current === null || (scale && scale > 1)) {
      return;
    }
    
    const currentX = e.touches[0].clientX;
    const diff = touchStartX.current - currentX;
    
    // Show swipe direction indicator
    if (Math.abs(diff) > 20) {
      setSwipeDirection(diff > 0 ? "right" : "left");
    } else {
      setSwipeDirection(null);
    }
  }, [swipeEnabled, scale]);
  
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!swipeEnabled || touchStartX.current === null || (scale && scale > 1)) {
      resetSwipeState();
      return;
    }
    
    touchEndX.current = e.changedTouches[0].clientX;
    
    const diff = touchStartX.current - touchEndX.current;
    console.log("Swipe end, diff:", diff, "threshold:", swipeThreshold, "swipe enabled:", swipeEnabled);
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left to right
        console.log("Swiping to next file");
        goToNextFile();
      } else {
        // Swiped right to left
        console.log("Swiping to previous file");
        goToPreviousFile();
      }
    }
    
    resetSwipeState();
  }, [goToNextFile, goToPreviousFile, resetSwipeState, swipeEnabled, swipeThreshold, scale]);
  
  return {
    swipeDirection,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
