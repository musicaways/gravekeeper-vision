
import { useState, useRef, useEffect } from "react";
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
  const previousScale = useRef<number>(scale);
  const forceRender = useRef<boolean>(true); // Force initial render
  
  // Reset initial render state when url changes
  useEffect(() => {
    console.log("PDF url changed, resetting render state:", url);
    setInitialRenderComplete(false);
    forceRender.current = true; // Force render on URL change
  }, [url]);
  
  // Track scale changes
  useEffect(() => {
    if (previousScale.current !== scale) {
      console.log(`Scale changed from ${previousScale.current} to ${scale}, forcing render`);
      forceRender.current = true; // Force render on scale change
      previousScale.current = scale;
    }
  }, [scale]);
  
  // Load and manage the PDF document
  const { 
    pdfLoading, 
    pdfError, 
    pdfDocRef, 
    totalPages,
    reloadPdf
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
  
  // Force render after document is loaded
  useEffect(() => {
    if (pdfDocRef.current && !pdfLoading && !initialRenderComplete) {
      console.log("PDF document loaded, forcing initial render");
      forceRender.current = true;
    }
  }, [pdfDocRef.current, pdfLoading, initialRenderComplete]);
  
  // Handle PDF rendering
  usePdfRenderer({
    canvasRef,
    pdfDocRef,
    currentPage,
    scale,
    setInitialRenderComplete,
    initialRenderComplete,
    renderInProgress,
    setSwipeEnabled,
    forceRender
  });

  return {
    canvasRef,
    pdfLoading,
    pdfError,
    currentPage,
    totalPages,
    initialRenderComplete,
    goToNextPage,
    goToPrevPage,
    reloadPdf
  };
};
