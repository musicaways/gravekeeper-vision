
import { useState, useEffect } from "react";

export const useImageControls = () => {
  const [showControls, setShowControls] = useState(true);
  
  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (!showControls) return;
    
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [showControls]);
  
  const toggleControls = () => {
    setShowControls((prev) => !prev);
  };
  
  return {
    showControls,
    toggleControls
  };
};
