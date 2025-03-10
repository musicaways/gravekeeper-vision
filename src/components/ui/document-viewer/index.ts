
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
import DocumentViewerOverlay from "./DocumentViewerOverlay";
import DocumentViewerContent from "./DocumentViewerContent";
import { useDocumentViewer } from "./useDocumentViewer";
import { isImageFile, isPdfFile, getFileLoaderComponent } from "./fileViewerUtils";
import { usePdfViewer } from "./hooks/usePdfViewer";
import { usePdfDocument } from "./hooks/pdf/usePdfDocument";
import { usePdfPageNavigation } from "./hooks/pdf/usePdfPageNavigation";
import { usePdfRenderer } from "./hooks/pdf/usePdfRenderer";
import PdfCanvas from "./components/PdfCanvas";
import PdfPageNavigation from "./components/PdfPageNavigation";
import PdfError from "./components/PdfError";
import PdfLoading from "./components/PdfLoading";
import SwipeDirectionIndicator from "./components/SwipeDirectionIndicator";
import ViewerContentContainer from "./components/ViewerContentContainer";
import { useSwipeNavigation } from "./hooks/useSwipeNavigation";

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
  DocumentViewerOverlay,
  DocumentViewerContent,
  useDocumentViewer,
  usePdfViewer,
  usePdfDocument,
  usePdfPageNavigation,
  usePdfRenderer,
  PdfCanvas,
  PdfPageNavigation,
  PdfError,
  PdfLoading,
  SwipeDirectionIndicator,
  ViewerContentContainer,
  useSwipeNavigation,
  isImageFile,
  isPdfFile,
  getFileLoaderComponent
};

export type { DocumentViewerFile };
export default DocumentViewer;
