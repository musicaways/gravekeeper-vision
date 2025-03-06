
import DocumentViewer from "./DocumentViewer";
import { DocumentViewerFile } from "./types";
import FilePreview from "./FilePreview";
import PdfViewer from "./PdfViewer";
import ImageViewer from "./ImageViewer";
import GenericFileViewer from "./GenericFileViewer";
import CloseButton from "./CloseButton";
import ViewerControls from "./ViewerControls";
import ViewerInfoBar from "./ViewerInfoBar";
import ViewerNavigation from "./ViewerNavigation";
import DeleteFileDialog from "./DeleteFileDialog";
import { useDocumentViewer } from "./useDocumentViewer";
import { isImageFile, isPdfFile, getFileLoaderComponent } from "./fileViewerUtils";

export {
  FilePreview,
  PdfViewer,
  ImageViewer,
  GenericFileViewer,
  CloseButton,
  ViewerControls,
  ViewerInfoBar,
  ViewerNavigation,
  DeleteFileDialog,
  useDocumentViewer,
  isImageFile,
  isPdfFile,
  getFileLoaderComponent
};

export type { DocumentViewerFile };
export default DocumentViewer;
