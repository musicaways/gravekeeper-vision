
import { Loader2 } from "lucide-react";
import { DocumentViewerFile } from "./types";
import PdfViewer from "./PdfViewer";
import ImageViewer from "./ImageViewer";
import GenericFileViewer from "./GenericFileViewer";
import { getFileLoaderComponent } from "./fileViewerUtils";
import { useEffect } from "react";

interface FilePreviewProps {
  currentFile: DocumentViewerFile | undefined;
  fileType: string;
  title: string;
  scale: number;
  handleDownload: () => void;
  handleZoomIn: () => void;
  toggleControls: () => void;
  setSwipeEnabled: (enabled: boolean) => void;
}

const FilePreview = ({
  currentFile,
  fileType,
  title,
  scale,
  handleDownload,
  handleZoomIn,
  toggleControls,
  setSwipeEnabled
}: FilePreviewProps) => {
  // Handle double click for zoom
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleZoomIn();
  };

  // Force render when file changes
  useEffect(() => {
    if (currentFile) {
      console.log("FilePreview: New file loaded, type:", fileType);
    }
  }, [currentFile, fileType]);

  if (!currentFile) {
    return (
      <div className="flex items-center justify-center w-full">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const fileViewerType = getFileLoaderComponent(fileType);
  console.log("File viewer type:", fileViewerType, "for file type:", fileType);

  if (fileViewerType === 'pdf') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative">
        <PdfViewer
          url={currentFile.url}
          title={title}
          scale={scale}
          handleDownload={handleDownload}
          handleDoubleClick={handleDoubleClick}
          toggleControls={toggleControls}
          setSwipeEnabled={setSwipeEnabled}
        />
      </div>
    );
  }

  if (fileViewerType === 'image') {
    return (
      <ImageViewer
        url={currentFile.url}
        title={title}
        scale={scale}
        toggleControls={toggleControls}
        handleDoubleClick={handleDoubleClick}
        setSwipeEnabled={setSwipeEnabled}
      />
    );
  }

  // For all other file types
  return (
    <GenericFileViewer
      title={title}
      handleDownload={handleDownload}
    />
  );
};

export default FilePreview;
