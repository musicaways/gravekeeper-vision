
import { useState, useRef, useEffect, useCallback } from "react";
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
  const previousUrl = useRef<string>(url);
  
  // Reset initial render state when url changes
  useEffect(() => {
    if (previousUrl.current !== url) {
      console.log("PDF url changed from", previousUrl.current, "to", url, "resetting render state");
      setInitialRenderComplete(false);
      forceRender.current = true; // Force render on URL change
      previousUrl.current = url;
    }
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

  // Reset position and force render when scale is reset to 1
  useEffect(() => {
    if (scale === 1 && previousScale.current !== 1) {
      console.log("Scale reset to 1, forcing render");
      forceRender.current = true;
    }
  }, [scale]);
  
  // Force a new render every few seconds until initial render is complete
  useEffect(() => {
    let renderCheckInterval: NodeJS.Timeout | null = null;
    
    if (!initialRenderComplete && !pdfLoading && pdfDocRef.current) {
      console.log("Setting up render check interval");
      renderCheckInterval = setInterval(() => {
        if (!initialRenderComplete && !renderInProgress.current) {
          console.log("Automatic render check - forcing render");
          forceRender.current = true;
        } else if (initialRenderComplete) {
          console.log("Initial render complete, clearing interval");
          if (renderCheckInterval) clearInterval(renderCheckInterval);
        }
      }, 2000); // Check every 2 seconds
    }
    
    return () => {
      if (renderCheckInterval) {
        clearInterval(renderCheckInterval);
      }
    };
  }, [initialRenderComplete, pdfLoading, pdfDocRef.current]);
  
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

  // Manual force render function
  const forceRerender = useCallback(() => {
    console.log("Manual force render requested");
    forceRender.current = true;
  }, []);

  return {
    canvasRef,
    pdfLoading,
    pdfError,
    currentPage,
    totalPages,
    initialRenderComplete,
    goToNextPage,
    goToPrevPage,
    reloadPdf,
    forceRerender
  };
};
