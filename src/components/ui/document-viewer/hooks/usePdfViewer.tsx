
import { useState, useRef } from "react";
import { usePdfDocument } from "./pdf/usePdfDocument";
import { usePdfPageNavigation } from "./pdf/usePdfPageNavigation";
import { usePdfRenderer } from "./pdf/usePdfRenderer";

interface UsePdfViewerProps {
  url: string;
  scale: number;
  initialPage?: number;
  setSwipeEnabled: (enabled: boolean) => void;
}

export const usePdfViewer = ({ url, scale, initialPage = 1, setSwipeEnabled }: UsePdfViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  const renderInProgress = useRef<boolean>(false);
  
  // Load and manage the PDF document
  const { 
    pdfLoading, 
    pdfError, 
    pdfDocRef, 
    totalPages
  } = usePdfDocument({ url });
  
  // Handle PDF page navigation
  const { 
    currentPage, 
    setCurrentPage,  
    goToNextPage, 
    goToPrevPage 
  } = usePdfPageNavigation({ 
    initialPage, 
    totalPages, 
    pdfDocRef,
    renderInProgress 
  });
  
  // Handle PDF rendering
  usePdfRenderer({
    canvasRef,
    pdfDocRef,
    currentPage,
    scale,
    setInitialRenderComplete,
    initialRenderComplete,
    renderInProgress,
    setSwipeEnabled
  });

  return {
    canvasRef,
    pdfLoading,
    pdfError,
    currentPage,
    totalPages,
    initialRenderComplete,
    goToNextPage,
    goToPrevPage
  };
};
