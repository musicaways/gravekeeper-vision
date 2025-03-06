
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import LightboxControls from "./LightboxControls";
import LightboxNavigation from "./LightboxNavigation";
import LightboxImage from "./LightboxImage";
import LightboxInfoBar from "./LightboxInfoBar";
import SwipeIndicator from "./SwipeIndicator";
import { useImageLightbox } from "./useImageLightbox";
import { ImageLightboxProps } from "./types";

const ImageLightbox = ({ images, open, initialIndex, onClose }: ImageLightboxProps) => {
  const {
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
    parseImageDetails,
    setScale
  } = useImageLightbox({ images, open, initialIndex, onClose });

  if (images.length === 0) return null;

  const { title, description, dateInfo } = parseImageDetails();
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && onClose()} modal>
      <DialogContent 
        className="fixed inset-0 p-0 m-0 w-full h-full max-w-none max-h-none bg-black/95 border-none overflow-hidden rounded-none"
        onMouseLeave={handleMouseUp}
        aria-describedby="lightbox-description"
      >
        <DialogTitle className="sr-only">Visualizzatore foto</DialogTitle>
        <span id="lightbox-description" className="sr-only">Visualizzatore immagini a schermo intero</span>
        
        <div 
          className="fixed inset-0 w-full h-full flex flex-col justify-center items-center overflow-hidden"
          ref={contentRef}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleImageClick}
          >
            {/* Top controls bar */}
            <LightboxControls 
              showControls={showControls}
              currentIndex={currentIndex}
              imagesLength={images.length}
              scale={scale}
              handleZoomIn={handleZoomIn}
              handleZoomOut={handleZoomOut}
              onClose={onClose}
            />
            
            {/* Navigation buttons */}
            <LightboxNavigation 
              showControls={showControls}
              scale={scale}
              goToPreviousImage={goToPreviousImage}
              goToNextImage={goToNextImage}
            />
            
            {/* Image */}
            <LightboxImage 
              imageRef={imageRef}
              currentImage={currentImage}
              title={title}
              scale={scale}
              position={position}
              dragging={dragging}
              swipeDirection={swipeDirection}
              setScale={setScale}
            />
            
            {/* Bottom info bar */}
            <LightboxInfoBar 
              showControls={showControls}
              title={title}
              description={description}
              dateInfo={dateInfo}
            />
            
            {/* Swipe indicator */}
            {swipeDirection && (
              <SwipeIndicator direction={swipeDirection} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox;
