
import React, { useEffect } from "react";
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
  const {
    canvasRef,
    pdfLoading,
    pdfError,
    currentPage,
    totalPages,
    initialRenderComplete,
    goToNextPage,
    goToPrevPage
  } = usePdfViewer({
    url,
    scale,
    initialPage: 1,
    setSwipeEnabled
  });

  // Force a render when the component mounts to ensure PDF is displayed
  useEffect(() => {
    console.log("PdfViewer: Component mounted, url:", url, "scale:", scale);
    
    // Force a re-render after a short delay to ensure the PDF is displayed
    const timer = setTimeout(() => {
      console.log("PdfViewer: Forcing re-render to ensure PDF is displayed");
      // This empty setState call is just to trigger a re-render
      // The actual rendering will happen in the usePdfRenderer hook
    }, 200);
    
    return () => clearTimeout(timer);
  }, [url, scale]);

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
