
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { ImageLightboxProps, LightboxImage } from "./types";

export const useImageLightbox = ({ images, open, initialIndex, onClose }: ImageLightboxProps) => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<null | "left" | "right">(null);
  const [startX, setStartX] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset state when lightbox opens or image changes
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setShowControls(true);
    }
  }, [initialIndex, open]);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (!showControls) return;
    
    const timer = setTimeout(() => {
      if (!dragging) {
        setShowControls(false);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [showControls, dragging]);

  const goToPreviousImage = () => {
    if (scale > 1) {
      toast({
        title: "Zoom attivo",
        description: "Riduci lo zoom per navigare tra le foto",
        variant: "default"
      });
      return;
    }
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    if (scale > 1) {
      toast({
        title: "Zoom attivo",
        description: "Riduci lo zoom per navigare tra le foto",
        variant: "default"
      });
      return;
    }
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

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

  const toggleControls = () => {
    setShowControls((prev) => !prev);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleControls();
  };

  // Touch event handlers for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setDragging(true);
    setShowControls(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (scale > 1) return; // Don't allow swipe when zoomed in
    
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    
    if (diff > 50) {
      setSwipeDirection("right");
    } else if (diff < -50) {
      setSwipeDirection("left");
    } else {
      setSwipeDirection(null);
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
    
    if (scale > 1) return; // Don't allow swipe when zoomed in
    
    if (swipeDirection === "right") {
      goToNextImage();
    } else if (swipeDirection === "left") {
      goToPreviousImage();
    }
    
    setSwipeDirection(null);
  };

  // Mouse event handlers for swipe simulation with mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setDragging(true);
    setShowControls(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || scale > 1) return;
    
    const currentX = e.clientX;
    const diff = startX - currentX;
    
    if (diff > 50) {
      setSwipeDirection("right");
    } else if (diff < -50) {
      setSwipeDirection("left");
    } else {
      setSwipeDirection(null);
    }
  };

  const handleMouseUp = () => {
    if (!dragging) return;
    
    if (scale <= 1) {
      if (swipeDirection === "right") {
        goToNextImage();
      } else if (swipeDirection === "left") {
        goToPreviousImage();
      }
    }
    
    setDragging(false);
    setSwipeDirection(null);
  };

  const currentImage = images[currentIndex];
  
  const parseImageDetails = () => {
    // Parse and format the description and date information
    const title = currentImage.title || "";
    let description = "";
    let dateInfo = "";
    
    if (currentImage.description) {
      const parts = currentImage.description.split("Date:");
      description = parts[0].trim();
      if (parts.length > 1) {
        dateInfo = parts[1].trim();
      }
    }
    
    return { title, description, dateInfo };
  };

  return {
    currentIndex,
    scale,
    position,
    showControls,
    dragging,
    swipeDirection,
    startX,
    imageRef,
    contentRef,
    goToPreviousImage,
    goToNextImage,
    handleZoomIn,
    handleZoomOut,
    toggleControls,
    handleImageClick,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    currentImage,
    parseImageDetails
  };
};
