
import { useState } from "react";
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

  return (
    <div className="w-full h-full flex flex-col overflow-hidden touch-none">
      {/* Close button - always visible */}
      <CloseButton onClose={onClose} />
      
      <div 
        className="relative w-full h-full flex items-center justify-center touch-none"
        onClick={toggleControls}
      >
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
