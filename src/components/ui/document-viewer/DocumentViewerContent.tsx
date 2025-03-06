
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
  const [swipeEnabled, setSwipeEnabled] = useState(true);
  
  // Reset swipe direction and touch points on file change
  useEffect(() => {
    setSwipeDirection(null);
    setTouchStart(0);
    setTouchEnd(0);
    // Reset swipe enabled when file changes
    setSwipeEnabled(true);
  }, [currentIndex]);

  // Disable swipe navigation when scaled
  useEffect(() => {
    if (scale > 1) {
      console.log("Disabling swipe navigation due to zoom level:", scale);
      setSwipeEnabled(false);
    } else {
      console.log("Enabling swipe navigation at zoom level:", scale);
      setSwipeEnabled(true);
    }
  }, [scale]);

  // Handle touch events for swipe navigation (when not zoomed in)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!swipeEnabled) {
      console.log("Touch start ignored - swipe navigation disabled");
      return;
    }
    
    console.log("Touch start event captured for swipe navigation");
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeEnabled) {
      return;
    }
    
    setTouchEnd(e.touches[0].clientX);
    
    // Calculate direction for visual feedback
    const diff = touchStart - e.touches[0].clientX;
    console.log("Swipe diff:", diff);
    
    if (diff > 50) {
      setSwipeDirection("right");
    } else if (diff < -50) {
      setSwipeDirection("left");
    } else {
      setSwipeDirection(null);
    }
  };

  const handleTouchEnd = () => {
    if (!swipeEnabled) {
      console.log("Touch end ignored - swipe navigation disabled");
      return;
    }
    
    const swipeThreshold = 80; // Lower threshold for easier swipes
    const diff = touchStart - touchEnd;
    
    console.log("Swipe end, diff:", diff, "threshold:", swipeThreshold, "swipe enabled:", swipeEnabled);
    
    if (diff > swipeThreshold && files.length > 1) {
      // Swiped left, go to next file
      console.log("Swiping to next file");
      goToNextFile();
    } else if (diff < -swipeThreshold && files.length > 1) {
      // Swiped right, go to previous file
      console.log("Swiping to previous file");
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
        className={`relative w-full h-full flex items-center justify-center ${swipeEnabled ? 'touch-auto' : 'touch-none'}`}
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
            setSwipeEnabled={setSwipeEnabled}
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
