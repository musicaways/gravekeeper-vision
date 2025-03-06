
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
  
  const {
    canvasRef,
    pdfLoading,
    pdfError,
    currentPage,
    totalPages,
    initialRenderComplete,
    goToNextPage,
    goToPrevPage,
    reloadPdf
  } = usePdfViewer({
    url,
    scale,
    initialPage: 1,
    setSwipeEnabled
  });

  // Force a render when the component mounts
  useEffect(() => {
    console.log("PdfViewer: Component mounted, url:", url, "scale:", scale);
    mountedRef.current = true;
    
    // Force a re-render after component mounts
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }
    
    renderTimeoutRef.current = setTimeout(() => {
      console.log("PdfViewer: Forcing re-render to ensure PDF is displayed");
      if (!initialRenderComplete && mountedRef.current) {
        // If PDF hasn't rendered yet, try reloading it
        console.log("PDF not rendered yet, attempting reload");
        reloadPdf();
      }
    }, 500);
    
    return () => {
      mountedRef.current = false;
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [url, scale, initialRenderComplete, reloadPdf]);

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
