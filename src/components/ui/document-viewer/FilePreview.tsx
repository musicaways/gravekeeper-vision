
import { Loader2 } from "lucide-react";
import { DocumentViewerFile } from "./types";
import PdfViewer from "./PdfViewer";
import ImageViewer from "./ImageViewer";
import GenericFileViewer from "./GenericFileViewer";
import { getFileLoaderComponent } from "./fileViewerUtils";

interface FilePreviewProps {
  currentFile: DocumentViewerFile | undefined;
  fileType: string;
  title: string;
  scale: number;
  handleDownload: () => void;
  handleZoomIn: () => void;
  toggleControls: () => void;
}

const FilePreview = ({
  currentFile,
  fileType,
  title,
  scale,
  handleDownload,
  handleZoomIn,
  toggleControls
}: FilePreviewProps) => {
  // Handle double click for zoom
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleZoomIn();
  };

  if (!currentFile) {
    return (
      <div className="flex items-center justify-center w-full">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const fileViewerType = getFileLoaderComponent(fileType);

  if (fileViewerType === 'pdf') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative bg-black/10">
        <PdfViewer
          url={currentFile.url}
          title={title}
          scale={scale}
          handleDownload={handleDownload}
          handleDoubleClick={handleDoubleClick}
          toggleControls={toggleControls}
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
