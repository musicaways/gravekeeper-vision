
import DocumentViewer from "./DocumentViewer";
import { DocumentViewerFile } from "./types";
import FilePreview from "./FilePreview";
import CloseButton from "./CloseButton";
import ViewerControls from "./ViewerControls";
import ViewerInfoBar from "./ViewerInfoBar";
import ViewerNavigation from "./ViewerNavigation";
import DeleteFileDialog from "./DeleteFileDialog";
import { useDocumentViewer } from "./useDocumentViewer";

export {
  FilePreview,
  CloseButton,
  ViewerControls,
  ViewerInfoBar,
  ViewerNavigation,
  DeleteFileDialog,
  useDocumentViewer
};

export type { DocumentViewerFile };
export default DocumentViewer;
