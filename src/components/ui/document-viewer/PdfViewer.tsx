
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
  const maxRenderAttemptsRef = useRef(5); // Aumentiamo il numero di tentativi
  
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
    
    // Logghiamo lo stato iniziale
    console.log("PdfViewer: Initial state - initialRenderComplete:", initialRenderComplete);
    
    // Series of render attempts with increasing delays
    const scheduleRenderAttempt = (delay: number) => {
      renderTimeoutRef.current = setTimeout(() => {
        console.log(`PdfViewer: Render attempt ${renderAttemptsRef.current + 1} (delay: ${delay}ms)`);
        
        if (!initialRenderComplete && mountedRef.current) {
          renderAttemptsRef.current += 1;
          forceRerender();
          
          // If PDF still hasn't rendered, try reloading it
          if (renderAttemptsRef.current >= 3 && renderAttemptsRef.current < maxRenderAttemptsRef.current) {
            console.log("PDF not rendered after multiple attempts, reloading PDF");
            reloadPdf();
          }
          
          // Schedule next attempt with increasing delay if needed
          if (renderAttemptsRef.current < maxRenderAttemptsRef.current) {
            scheduleRenderAttempt(Math.min(delay * 1.5, 2000)); // Increase delay for next attempt, max 2000ms
          } else {
            console.log(`Maximum render attempts (${maxRenderAttemptsRef.current}) reached`);
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

  // Reagiamo anche ai cambiamenti di scala
  useEffect(() => {
    console.log("PdfViewer: Scale changed to:", scale);
    // Forziamo un re-render quando cambia lo scale
    if (mountedRef.current && !pdfLoading && scale > 0) {
      forceRerender();
    }
  }, [scale, forceRerender, pdfLoading]);

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
