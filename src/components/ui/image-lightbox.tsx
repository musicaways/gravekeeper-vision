
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

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
    // Prevent navigation when clicking on image
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

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];
  
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

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && onClose()}>
      <DialogContent 
        className="sm:max-w-5xl max-h-[90vh] p-0 flex flex-col bg-transparent border-none"
        onMouseLeave={handleMouseUp}
      >
        {/* Hidden DialogTitle for accessibility - required by RadixUI Dialog */}
        <DialogTitle className="sr-only">Visualizzatore foto</DialogTitle>
        
        <div 
          className="relative h-full flex flex-col bg-transparent overflow-hidden"
          ref={contentRef}
        >
          {/* Main image container */}
          <div 
            className="relative w-full h-full flex-1 flex items-center justify-center bg-black/95"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleImageClick}
          >
            {/* Top controls bar */}
            <AnimatePresence>
              {showControls && (
                <motion.div 
                  className="absolute top-0 left-0 right-0 z-10 bg-black/75 backdrop-blur-sm p-3 flex justify-between items-center"
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleZoomOut();
                      }}
                      className="text-white hover:bg-white/30"
                      disabled={scale <= 1}
                    >
                      <ZoomOut className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleZoomIn();
                      }}
                      className="text-white hover:bg-white/30"
                      disabled={scale >= 3}
                    >
                      <ZoomIn className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                      }}
                      className="text-white hover:bg-white/30"
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
                      variant="default" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPreviousImage();
                      }}
                      className="bg-black/75 hover:bg-black/90 text-white h-10 w-10 rounded-full shadow-lg border border-white/20"
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
                      variant="default" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNextImage();
                      }}
                      className="bg-black/75 hover:bg-black/90 text-white h-10 w-10 rounded-full shadow-lg border border-white/20"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
            
            {/* Image */}
            <motion.img 
              ref={imageRef}
              src={currentImage.url} 
              alt={title || ""}
              className={`max-h-full max-w-full object-contain select-none ${swipeDirection ? "transition-transform duration-300" : ""}`}
              style={{ 
                scale,
                x: position.x,
                y: position.y,
                cursor: dragging ? "grabbing" : (scale > 1 ? "grab" : "default"),
                transform: swipeDirection ? `translateX(${swipeDirection === "right" ? "-50px" : "50px"})` : undefined
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
            />
            
            {/* Bottom info bar */}
            <AnimatePresence>
              {showControls && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 z-10 bg-black/75 backdrop-blur-sm p-3"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-white space-y-1">
                    {title && (
                      <p className="text-sm font-medium">{title}</p>
                    )}
                    {description && (
                      <p className="text-sm text-white/90">{description}</p>
                    )}
                    {dateInfo && (
                      <p className="text-xs text-white/80 flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        {dateInfo}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Swipe indicator */}
            {swipeDirection && (
              <div className={`absolute inset-0 pointer-events-none flex items-center ${swipeDirection === "right" ? "justify-start" : "justify-end"}`}>
                <div className={`bg-white/10 h-full w-20 ${swipeDirection === "right" ? "rounded-r-full" : "rounded-l-full"}`}></div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox;
