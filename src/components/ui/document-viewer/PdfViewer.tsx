
import React, { useEffect, useRef } from "react";
import { usePdfViewer } from "./hooks/usePdfViewer";
import PdfCanvas from "./components/PdfCanvas";
import PdfPageNavigation from "./components/PdfPageNavigation";
import PdfError from "./components/PdfError";
import PdfLoading from "./components/PdfLoading";

interface PdfViewerProps {
  url: string;
  title: string;
  scale: number;
  handleDownload: () => void;
  handleDoubleClick: (e: React.MouseEvent) => void;
  toggleControls: () => void;
  setSwipeEnabled: (enabled: boolean) => void;
}

const PdfViewer = ({
  url,
  title,
  scale,
  handleDownload,
  handleDoubleClick,
  toggleControls,
  setSwipeEnabled
}: PdfViewerProps) => {
  const mountedRef = useRef(false);
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const renderAttemptsRef = useRef(0);
  
  const {
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
  } = usePdfViewer({
    url,
    scale,
    initialPage: 1,
    setSwipeEnabled
  });

  // Force a render when the component mounts and periodically check render status
  useEffect(() => {
    console.log("PdfViewer: Component mounted, url:", url, "scale:", scale);
    mountedRef.current = true;
    
    // Initial render attempt
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }
    
    // Series of render attempts with increasing delays
    const scheduleRenderAttempt = (delay: number) => {
      renderTimeoutRef.current = setTimeout(() => {
        console.log(`PdfViewer: Render attempt ${renderAttemptsRef.current + 1} (delay: ${delay}ms)`);
        
        if (!initialRenderComplete && mountedRef.current) {
          renderAttemptsRef.current += 1;
          forceRerender();
          
          // If PDF still hasn't rendered, try reloading it
          if (renderAttemptsRef.current >= 3) {
            console.log("PDF not rendered after multiple attempts, reloading PDF");
            reloadPdf();
          }
          
          // Schedule next attempt with increasing delay if needed (up to 5 attempts)
          if (renderAttemptsRef.current < 5) {
            scheduleRenderAttempt(delay * 1.5); // Increase delay for next attempt
          }
        }
      }, delay);
    };
    
    // Start the sequence of render attempts
    scheduleRenderAttempt(500);
    
    return () => {
      mountedRef.current = false;
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [url, scale, initialRenderComplete, reloadPdf, forceRerender]);

  if (pdfLoading) {
    return <PdfLoading />;
  }

  if (pdfError) {
    return <PdfError errorMessage={pdfError} handleDownload={handleDownload} />;
  }

  return (
    <>
      <PdfCanvas 
        canvasRef={canvasRef}
        initialRenderComplete={initialRenderComplete}
        handleDoubleClick={handleDoubleClick}
        toggleControls={toggleControls}
        scale={scale}
        setSwipeEnabled={setSwipeEnabled}
      />
      
      <PdfPageNavigation 
        currentPage={currentPage}
        totalPages={totalPages}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
      />
    </>
  );
};

export default PdfViewer;
