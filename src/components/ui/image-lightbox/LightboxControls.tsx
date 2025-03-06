
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, X } from "lucide-react";

interface LightboxControlsProps {
  showControls: boolean;
  currentIndex: number;
  imagesLength: number;
  scale: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  onClose: () => void;
}

const LightboxControls = ({
  showControls,
  currentIndex,
  imagesLength,
  scale,
  handleZoomIn,
  handleZoomOut,
  onClose
}: LightboxControlsProps) => {
  return (
    <AnimatePresence>
      {showControls && (
        <motion.div 
          className="absolute top-0 left-0 right-0 z-10 bg-black/75 backdrop-blur-sm p-4 flex justify-between items-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-white text-sm md:text-base">
            <span>{currentIndex + 1}/{imagesLength}</span>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              className="text-white hover:bg-white/20"
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
              className="text-white hover:bg-white/20"
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
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LightboxControls;
