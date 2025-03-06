
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DocumentViewerOverlayProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const DocumentViewerOverlay = ({ open, onClose, children }: DocumentViewerOverlayProps) => {
  if (!open) return null;
  
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/95 touch-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      aria-modal="true"
      role="dialog"
      aria-label="Visualizzatore documenti"
      aria-describedby="document-viewer-description"
    >
      <span id="document-viewer-description" className="sr-only">Visualizzatore documenti a schermo intero</span>
      {children}
    </motion.div>
  );
};

export default DocumentViewerOverlay;
