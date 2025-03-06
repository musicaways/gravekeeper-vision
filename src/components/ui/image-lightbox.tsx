
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface LightboxImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  open: boolean;
  initialIndex: number;
  onClose: () => void;
}

const ImageLightbox = ({ images, open, initialIndex, onClose }: ImageLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(true);
  const [dragging, setDragging] = useState(false);
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
    if (scale > 1) return; // Don't allow navigation when zoomed in
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    if (scale > 1) return; // Don't allow navigation when zoomed in
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
    // Prevent navigation when clicking on image
    e.stopPropagation();
    toggleControls();
  };

  // Swipe handlers
  const handleDragStart = () => {
    setDragging(true);
    setShowControls(true); // Show controls when user interacts
  };

  const handleDragEnd = (e: any, info: any) => {
    setDragging(false);
    
    if (scale > 1) {
      // When zoomed in, handle panning limits
      if (imageRef.current && contentRef.current) {
        const imageBounds = imageRef.current.getBoundingClientRect();
        const contentBounds = contentRef.current.getBoundingClientRect();
        
        const maxX = (imageBounds.width * scale - contentBounds.width) / 2;
        const maxY = (imageBounds.height * scale - contentBounds.height) / 2;
        
        setPosition({
          x: Math.max(Math.min(position.x + info.offset.x, maxX), -maxX),
          y: Math.max(Math.min(position.y + info.offset.y, maxY), -maxY),
        });
      }
    } else {
      // When not zoomed, handle image swipe
      if (Math.abs(info.offset.x) > 100) {
        if (info.offset.x > 0) {
          goToPreviousImage();
        } else {
          goToNextImage();
        }
      }
    }
  };

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];
  const formattedDate = currentImage.description?.includes("Date:")
    ? currentImage.description.split("Date:")[1].trim()
    : "";

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && onClose()}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] p-0 flex flex-col bg-transparent border-none">
        <div 
          className="relative h-full flex flex-col bg-transparent overflow-hidden"
          ref={contentRef}
        >
          {/* Main image container */}
          <div className="relative w-full h-full flex-1 flex items-center justify-center bg-black/95">
            {/* Top controls bar */}
            <AnimatePresence>
              {showControls && (
                <motion.div 
                  className="absolute top-0 left-0 right-0 z-10 bg-black/60 backdrop-blur-sm p-3 flex justify-between items-center"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-white">
                    <span className="text-sm">{currentIndex + 1}/{images.length}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleZoomOut}
                      className="text-white hover:bg-white/20"
                      disabled={scale <= 1}
                    >
                      <ZoomOut className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleZoomIn}
                      className="text-white hover:bg-white/20"
                      disabled={scale >= 3}
                    >
                      <ZoomIn className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={onClose}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Navigation buttons */}
            <AnimatePresence>
              {showControls && scale === 1 && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-2 z-20"
                  >
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPreviousImage();
                      }}
                      className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-2 z-20"
                  >
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNextImage();
                      }}
                      className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
            
            {/* Draggable image */}
            <motion.div
              className="relative w-full h-full flex items-center justify-center"
              onClick={handleImageClick}
              drag={scale > 1}
              dragConstraints={contentRef}
              dragElastic={0.1}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              style={{ 
                touchAction: "none" 
              }}
            >
              <motion.img 
                ref={imageRef}
                src={currentImage.url} 
                alt={currentImage.title || ""}
                className="max-h-full max-w-full object-contain select-none"
                style={{ 
                  scale,
                  x: position.x,
                  y: position.y,
                  cursor: scale > 1 ? "grab" : "default",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (scale > 1) {
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                  } else {
                    setScale(2);
                  }
                }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                drag={false}
              />
            </motion.div>
            
            {/* Bottom info bar */}
            <AnimatePresence>
              {showControls && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 z-10 bg-black/60 backdrop-blur-sm p-3"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  {(currentImage.title || currentImage.description) && (
                    <div className="text-white">
                      {currentImage.title && (
                        <p className="text-sm font-medium">{currentImage.title}</p>
                      )}
                      {formattedDate && (
                        <p className="text-xs text-white/80 mt-1">
                          <span className="inline-flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            {formattedDate}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox;
