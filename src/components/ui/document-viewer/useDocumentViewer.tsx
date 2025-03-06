
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
  
  // Reset current index and scale when viewer opens or files change
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setShowControls(true);
      console.log("Document viewer reset state on open, initialIndex:", initialIndex);
    }
  }, [initialIndex, open, files]);
  
  const goToPreviousFile = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev === 0 ? files.length - 1 : prev - 1;
      console.log("Going to previous file, new index:", newIndex);
      return newIndex;
    });
    // Reset zoom when changing file
    setScale(1);
  };

  const goToNextFile = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev === files.length - 1 ? 0 : prev + 1;
      console.log("Going to next file, new index:", newIndex);
      return newIndex;
    });
    // Reset zoom when changing file
    setScale(1);
  };
  
  const toggleControls = () => {
    setShowControls((prev) => !prev);
  };

  const handleZoomIn = () => {
    setScale((prev) => {
      const newScale = prev >= 3 ? 3 : prev + 0.5;
      console.log("Zooming in from:", prev, "to:", newScale);
      return newScale;
    });
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = prev <= 1 ? 1 : prev - 0.5;
      console.log("Zooming out from:", prev, "to:", newScale);
      return newScale;
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
