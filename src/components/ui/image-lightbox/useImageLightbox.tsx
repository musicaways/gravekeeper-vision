
import { useRef, useState, useEffect } from "react";
import { LightboxImage } from "./types";
import { useImageZoom } from "./hooks/useImageZoom";
import { useImageDrag } from "./hooks/useImageDrag";
import { useImageControls } from "./hooks/useImageControls";
import { useImageSwipe } from "./hooks/useImageSwipe";
import { useImageNavigation } from "./hooks/useImageNavigation";

interface UseImageLightboxProps {
  images: LightboxImage[];
  open: boolean;
  initialIndex: number;
  onClose: () => void;
}

export const useImageLightbox = ({
  images,
  open,
  initialIndex,
  onClose
}: UseImageLightboxProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Zoom state management
  const {
    scale,
    position,
    setScale,
    setPosition,
    handleZoomIn,
    handleZoomOut,
    handleDoubleClick
  } = useImageZoom({ open });

  // Image dragging/panning functionality  
  const {
    dragging: isDragging,
    handleImageDragStart,
    handleImageDrag,
    handleImageDragEnd
  } = useImageDrag({ setPosition });

  // Image navigation
  const {
    currentIndex,
    currentImage,
    goToPreviousImage,
    goToNextImage
  } = useImageNavigation({ images, initialIndex, open });

  // Controls visibility
  const {
    showControls,
    toggleControls,
    handleImageClick
  } = useImageControls();

  // Swipe navigation
  const {
    swipeDirection,
    isSwipeDragging,
    handleSwipeStart,
    handleSwipeMove,
    handleSwipeEnd
  } = useImageSwipe({
    goNext: () => goToNextImage(),
    goPrevious: () => goToPreviousImage(),
    scale
  });

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleImageDragStart(e, scale, position);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleImageDrag(e, scale);
  };

  const handleMouseUp = () => {
    handleImageDragEnd();
  };

  // Touch events with proper prevention of default behaviors
  const handleImageDoubleClick = (e: React.MouseEvent | React.TouchEvent) => {
    handleDoubleClick(e);
  };

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleSwipeStart(e);
    handleImageDragStart(e, scale, position);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleSwipeMove(e);
    handleImageDrag(e, scale);
  };

  const handleTouchEnd = () => {
    handleSwipeEnd();
    handleImageDragEnd();
  };

  // Parse image details for display
  const parseImageDetails = () => {
    const image = currentImage;
    return {
      title: image?.title || '',
      description: image?.description || '',
      dateInfo: image?.date || ''
    };
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
    parseImageDetails,
    setScale,
    handleImageDoubleClick
  };
};
