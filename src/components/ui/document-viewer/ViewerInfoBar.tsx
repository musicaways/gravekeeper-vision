
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, FileType } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ViewerInfoBarProps {
  showControls: boolean;
  title: string;
  description: string;
  dateInfo: string;
  fileType?: string;
}

const ViewerInfoBar = ({
  showControls,
  title,
  description,
  dateInfo,
  fileType
}: ViewerInfoBarProps) => {
  return (
    <AnimatePresence>
      {showControls && (
        <motion.div 
          className="absolute bottom-0 left-0 right-0 z-10 bg-black/75 backdrop-blur-sm p-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-white max-w-3xl mx-auto">
            {title && (
              <p className="text-base md:text-lg font-medium">{title}</p>
            )}
            {description && (
              <ScrollArea className="max-h-[150px] mt-2" orientation="vertical">
                <p className="text-sm md:text-base text-white/90 pr-2">{description}</p>
              </ScrollArea>
            )}
            <div className="flex items-center gap-4 mt-2">
              {dateInfo && (
                <p className="text-xs md:text-sm text-white/80 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{dateInfo}</span>
                </p>
              )}
              {fileType && (
                <p className="text-xs md:text-sm text-white/80 flex items-center gap-1">
                  <FileType className="h-4 w-4" />
                  <span>{fileType.toUpperCase()}</span>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViewerInfoBar;
