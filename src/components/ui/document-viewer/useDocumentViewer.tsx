
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
  
  // Reset current index when viewer opens
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, open]);
  
  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (!showControls) return;
    
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [showControls]);
  
  const goToPreviousFile = () => {
    setCurrentIndex((prev) => (prev === 0 ? files.length - 1 : prev - 1));
  };

  const goToNextFile = () => {
    setCurrentIndex((prev) => (prev === files.length - 1 ? 0 : prev + 1));
  };
  
  const toggleControls = () => {
    setShowControls((prev) => !prev);
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
    parseFileDetails,
    goToPreviousFile,
    goToNextFile,
    toggleControls
  };
};
