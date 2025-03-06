
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ViewerNavigationProps {
  showControls: boolean;
  goToPreviousFile: () => void;
  goToNextFile: () => void;
}

const ViewerNavigation = ({
  showControls,
  goToPreviousFile,
  goToNextFile
}: ViewerNavigationProps) => {
  return (
    <AnimatePresence>
      {showControls && (
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
                goToPreviousFile();
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
                goToNextFile();
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

export default ViewerNavigation;
