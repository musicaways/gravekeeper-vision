
import { useState, useEffect } from "react";
import { DocumentViewerFile } from "./types";
import CloseButton from "./CloseButton";
import ViewerControls from "./ViewerControls";
import ViewerNavigation from "./ViewerNavigation";
import ViewerInfoBar from "./ViewerInfoBar";
import FilePreview from "./FilePreview";

interface DocumentViewerContentProps {
  currentIndex: number;
  showControls: boolean;
  currentFile: DocumentViewerFile | undefined;
  scale: number;
  files: DocumentViewerFile[];
  fileDetails: {
    title: string;
    description: string;
    dateInfo: string;
    fileType: string;
  };
  onClose: () => void;
  onDeleteRequest: () => void;
  goToPreviousFile: () => void;
  goToNextFile: () => void;
  toggleControls: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleDownload: () => void;
}

const DocumentViewerContent = ({
  currentIndex,
  showControls,
  currentFile,
  scale,
  files,
  fileDetails,
  onClose,
  onDeleteRequest,
  goToPreviousFile,
  goToNextFile,
  toggleControls,
  handleZoomIn,
  handleZoomOut,
  handleDownload
}: DocumentViewerContentProps) => {
  const { title, description, dateInfo, fileType } = fileDetails;
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  
  // Reset swipe direction
  useEffect(() => {
    setSwipeDirection(null);
  }, [currentIndex]);

  // Handle touch events for swipe navigation (when not zoomed in)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale > 1) return; // Don't capture swipes when zoomed in
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (scale > 1) return; // Don't capture swipes when zoomed in
    setTouchEnd(e.touches[0].clientX);
    
    // Calculate direction for visual feedback
    const diff = touchStart - e.touches[0].clientX;
    if (diff > 50) {
      setSwipeDirection("right");
    } else if (diff < -50) {
      setSwipeDirection("left");
    } else {
      setSwipeDirection(null);
    }
  };

  const handleTouchEnd = () => {
    if (scale > 1) return; // Don't capture swipes when zoomed in
    
    const swipeThreshold = 100; // Minimum swipe distance
    const diff = touchStart - touchEnd;
    
    if (diff > swipeThreshold && files.length > 1) {
      // Swiped left, go to next file
      goToNextFile();
    } else if (diff < -swipeThreshold && files.length > 1) {
      // Swiped right, go to previous file
      goToPreviousFile();
    }
    
    // Reset state
    setSwipeDirection(null);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden touch-none">
      {/* Close button - always visible */}
      <CloseButton onClose={onClose} />
      
      <div 
        className={`relative w-full h-full flex items-center justify-center ${scale <= 1 ? 'touch-auto' : 'touch-none'}`}
        onClick={toggleControls}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Swipe direction indicators */}
        {swipeDirection === "left" && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full">
            &lt;
          </div>
        )}
        {swipeDirection === "right" && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full">
            &gt;
          </div>
        )}
        
        {/* Top controls bar - always visible */}
        <ViewerControls 
          showControls={true}
          currentIndex={currentIndex}
          filesLength={files.length}
          onDeleteRequest={onDeleteRequest}
          onDownload={handleDownload}
          fileType={fileType}
          scale={scale}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
        />
        
        {/* Navigation buttons - always visible for multiple files */}
        {files.length > 1 && (
          <ViewerNavigation 
            showControls={true}
            goToPreviousFile={goToPreviousFile}
            goToNextFile={goToNextFile}
          />
        )}
        
        {/* File Content */}
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 h-full flex items-center overflow-hidden">
          <FilePreview 
            currentFile={currentFile}
            fileType={fileType}
            title={title}
            scale={scale}
            handleDownload={handleDownload}
            handleZoomIn={handleZoomIn}
            toggleControls={toggleControls}
          />
        </div>
        
        {/* Bottom info bar - always visible */}
        <ViewerInfoBar 
          showControls={true}
          title={title}
          description={description}
          dateInfo={dateInfo}
          fileType={fileType}
        />
      </div>
    </div>
  );
};

export default DocumentViewerContent;
