
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DownloadCloud, Trash2, X } from "lucide-react";

interface ViewerControlsProps {
  showControls: boolean;
  currentIndex: number;
  filesLength: number;
  onDeleteRequest: () => void;
  onDownload: () => void;
  fileType?: string;
}

const ViewerControls = ({
  showControls,
  currentIndex,
  filesLength,
  onDeleteRequest,
  onDownload,
  fileType
}: ViewerControlsProps) => {
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
          <div className="text-white text-sm md:text-base flex items-center gap-2">
            <span>{currentIndex + 1}/{filesLength}</span>
            {fileType && <span className="text-xs bg-white/20 px-2 py-0.5 rounded uppercase">{fileType}</span>}
          </div>
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              className="text-white hover:bg-white/20"
            >
              <DownloadCloud className="h-5 w-5 text-blue-400" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRequest();
              }}
              className="text-white hover:bg-white/20"
            >
              <Trash2 className="h-5 w-5 text-red-400" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViewerControls;
