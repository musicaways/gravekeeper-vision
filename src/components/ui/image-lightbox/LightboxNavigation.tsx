
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxNavigationProps {
  showControls: boolean;
  scale: number;
  goToPreviousImage: () => void;
  goToNextImage: () => void;
}

const LightboxNavigation = ({
  showControls,
  scale,
  goToPreviousImage,
  goToNextImage
}: LightboxNavigationProps) => {
  return (
    <AnimatePresence>
      {showControls && scale === 1 && (
        <>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute left-4 z-20"
          >
            <Button 
              variant="default" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousImage();
              }}
              className="bg-black/75 hover:bg-black/90 text-white h-12 w-12 rounded-full shadow-lg border-2 border-white/30"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute right-4 z-20"
          >
            <Button 
              variant="default" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                goToNextImage();
              }}
              className="bg-black/75 hover:bg-black/90 text-white h-12 w-12 rounded-full shadow-lg border-2 border-white/30"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LightboxNavigation;
