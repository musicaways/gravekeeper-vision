
import { DocumentViewerFile } from "./types";
import ViewerContentContainer from "./components/ViewerContentContainer";

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

const DocumentViewerContent = (props: DocumentViewerContentProps) => {
  return <ViewerContentContainer {...props} />;
};

export default DocumentViewerContent;
