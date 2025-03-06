
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DownloadCloud, Trash2, ZoomIn, ZoomOut } from "lucide-react";

interface ViewerControlsProps {
  showControls: boolean;
  currentIndex: number;
  filesLength: number;
  onDeleteRequest: () => void;
  onDownload: () => void;
  fileType?: string;
  scale: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
}

const ViewerControls = ({
  showControls,
  currentIndex,
  filesLength,
  onDeleteRequest,
  onDownload,
  fileType,
  scale,
  handleZoomIn,
  handleZoomOut
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
            <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded">Zoom: {scale}x</span>
          </div>
          <div className="flex gap-3 mr-10">
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
                handleZoomOut();
                console.log("Zoom out clicked, new scale should be:", scale > 1 ? scale - 0.5 : 1);
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
                console.log("Zoom in clicked, new scale should be:", scale < 3 ? scale + 0.5 : 1);
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
