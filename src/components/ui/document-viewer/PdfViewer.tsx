
import React from "react";
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
}

const PdfViewer = ({
  url,
  title,
  scale,
  handleDownload,
  handleDoubleClick,
  toggleControls
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
    initialPage: 1
  });

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
