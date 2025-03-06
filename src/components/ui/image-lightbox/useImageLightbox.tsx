
import { useRef } from "react";
import { ImageLightboxProps } from "./types";
import { useImageNavigation } from "./hooks/useImageNavigation";
import { useImageZoom } from "./hooks/useImageZoom";
import { useImageDrag } from "./hooks/useImageDrag";
import { useImageSwipe } from "./hooks/useImageSwipe";
import { useImageControls } from "./hooks/useImageControls";
import { parseImageDetails } from "./utils/imageUtils";

export const useImageLightbox = ({ images, open, initialIndex, onClose }: ImageLightboxProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Use our smaller hooks
  const { currentIndex, currentImage, goToPreviousImage, goToNextImage } = useImageNavigation({ 
    images, initialIndex, open 
  });
  
  const { scale, position, setScale, setPosition, handleZoomIn, handleZoomOut } = useImageZoom({ 
    open 
  });
  
  const { showControls, toggleControls } = useImageControls();
  
  const { dragging: isDragging, handleImageDragStart, handleImageDrag, handleImageDragEnd } = useImageDrag({
    setPosition
  });
  
  const { swipeDirection, dragging: isSwipeDragging, handleSwipeStart, handleSwipeMove, handleSwipeEnd } = useImageSwipe({
    goToPreviousImage: (scale) => goToPreviousImage(scale),
    goToNextImage: (scale) => goToNextImage(scale)
  });
  
  // Combined handlers for different events
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleControls();
  };
  
  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale > 1) {
      handleImageDragStart(e, scale, position);
    } else {
      handleSwipeStart(e, scale);
      showControls && toggleControls();
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (scale > 1) {
      handleImageDrag(e, scale);
    } else {
      handleSwipeMove(e, scale);
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (scale > 1) {
      handleImageDragEnd();
    } else {
      handleSwipeEnd(scale);
    }
  };
  
  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      handleImageDragStart(e, scale, position);
    } else {
      handleSwipeStart(e, scale);
      showControls && toggleControls();
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (scale > 1) {
      handleImageDrag(e, scale);
    } else {
      handleSwipeMove(e, scale);
    }
  };
  
  const handleMouseUp = (e: React.MouseEvent) => {
    if (scale > 1) {
      handleImageDragEnd();
    } else {
      handleSwipeEnd(scale);
    }
  };
  
  return {
    currentIndex,
    scale,
    position,
    showControls,
    dragging: isDragging || isSwipeDragging,
    swipeDirection,
    imageRef,
    contentRef,
    goToPreviousImage: () => goToPreviousImage(scale),
    goToNextImage: () => goToNextImage(scale),
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
    parseImageDetails: () => parseImageDetails(currentImage),
    setScale,
    setPosition
  };
};
