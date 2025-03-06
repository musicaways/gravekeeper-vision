import { useState, useEffect } from "react";
import { DocumentViewerProps, DocumentViewerFile } from "./types";

export const useDocumentViewer = ({ 
  files, 
  open, 
  initialIndex, 
  onClose 
}: DocumentViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showControls, setShowControls] = useState(true);
  const [scale, setScale] = useState(1);
  
  // Reset current index and scale when viewer opens
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setScale(1);
      // Sempre mostrare i controlli quando si apre il visualizzatore
      setShowControls(true);
    }
  }, [initialIndex, open]);
  
  // Non nascondere automaticamente i controlli - li manteniamo sempre visibili
  // per migliorare l'usabilità
  
  const goToPreviousFile = () => {
    setCurrentIndex((prev) => (prev === 0 ? files.length - 1 : prev - 1));
    // Reset zoom when changing file
    setScale(1);
  };

  const goToNextFile = () => {
    setCurrentIndex((prev) => (prev === files.length - 1 ? 0 : prev + 1));
    // Reset zoom when changing file
    setScale(1);
  };
  
  const toggleControls = () => {
    setShowControls((prev) => !prev);
  };

  const handleZoomIn = () => {
    setScale((prev) => {
      console.log("Zooming in from:", prev);
      // If the scale is at max (3), go back to 1, otherwise increment by 0.5
      if (prev >= 3) {
        return 1;
      } else {
        return prev + 0.5;
      }
    });
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      console.log("Zooming out from:", prev);
      // If the scale is at min (1), keep it at 1, otherwise decrement by 0.5
      if (prev <= 1) {
        return 1;
      } else {
        return prev - 0.5;
      }
    });
  };
  
  const currentFile = files[currentIndex];
  
  const parseFileDetails = () => {
    return {
      title: currentFile?.title || '',
      description: currentFile?.description || '',
      dateInfo: currentFile?.date || '',
      fileType: currentFile?.type || getFileTypeFromUrl(currentFile?.url || '')
    };
  };
  
  const getFileTypeFromUrl = (url: string): string => {
    if (!url) return '';
    const extension = url.split('.').pop()?.toLowerCase();
    return extension || '';
  };
  
  return {
    currentIndex,
    currentFile,
    showControls,
    scale,
    setScale,
    parseFileDetails,
    goToPreviousFile,
    goToNextFile,
    toggleControls,
    handleZoomIn,
    handleZoomOut
  };
};
