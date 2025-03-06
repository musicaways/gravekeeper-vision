
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

interface LightboxInfoBarProps {
  showControls: boolean;
  title: string;
  description: string;
  dateInfo: string;
}

const LightboxInfoBar = ({
  showControls,
  title,
  description,
  dateInfo
}: LightboxInfoBarProps) => {
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
          <div className="text-white space-y-2 max-w-3xl mx-auto">
            {title && (
              <p className="text-base md:text-lg font-medium">{title}</p>
            )}
            {description && (
              <p className="text-sm md:text-base text-white/90">{description}</p>
            )}
            {dateInfo && (
              <p className="text-xs md:text-sm text-white/80 flex items-center gap-1">
                <Info className="h-4 w-4" />
                {dateInfo}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LightboxInfoBar;
