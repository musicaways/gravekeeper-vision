
import { useState, useEffect } from 'react';

interface UseSwipeNavigationProps {
  currentIndex: number;
  filesLength: number;
  goToPreviousFile: () => void;
  goToNextFile: () => void;
  swipeEnabled: boolean;
  scale: number;
}

export const useSwipeNavigation = ({
  currentIndex,
  filesLength,
  goToPreviousFile,
  goToNextFile,
  swipeEnabled,
  scale
}: UseSwipeNavigationProps) => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  
  // Reset swipe direction and touch points on file change or scale change
  useEffect(() => {
    setSwipeDirection(null);
    setTouchStart(0);
    setTouchEnd(0);
  }, [currentIndex, scale]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!swipeEnabled) {
      console.log("Touch start ignored - swipe navigation disabled");
      return;
    }
    
    console.log("Touch start event captured for swipe navigation");
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeEnabled) {
      return;
    }
    
    setTouchEnd(e.touches[0].clientX);
    
    // Calculate direction for visual feedback
    const diff = touchStart - e.touches[0].clientX;
    console.log("Swipe diff:", diff);
    
    if (diff > 50) {
      setSwipeDirection("right");
    } else if (diff < -50) {
      setSwipeDirection("left");
    } else {
      setSwipeDirection(null);
    }
  };

  const handleTouchEnd = () => {
    if (!swipeEnabled) {
      console.log("Touch end ignored - swipe navigation disabled");
      return;
    }
    
    const swipeThreshold = 80; // Lower threshold for easier swipes
    const diff = touchStart - touchEnd;
    
    console.log("Swipe end, diff:", diff, "threshold:", swipeThreshold, "swipe enabled:", swipeEnabled);
    
    if (diff > swipeThreshold && filesLength > 1) {
      // Swiped left, go to next file
      console.log("Swiping to next file");
      goToNextFile();
    } else if (diff < -swipeThreshold && filesLength > 1) {
      // Swiped right, go to previous file
      console.log("Swiping to previous file");
      goToPreviousFile();
    }
    
    // Reset state
    setSwipeDirection(null);
  };

  return {
    swipeDirection,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};
