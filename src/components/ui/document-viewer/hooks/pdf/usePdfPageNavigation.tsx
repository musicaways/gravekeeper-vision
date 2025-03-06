
import { useState, useRef, MutableRefObject } from "react";
import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

interface UsePdfPageNavigationProps {
  initialPage: number;
  totalPages: number;
  pdfDocRef: MutableRefObject<PDFDocumentProxy | null>;
  renderInProgress: MutableRefObject<boolean>;
}

export const usePdfPageNavigation = ({ 
  initialPage, 
  totalPages, 
  pdfDocRef,
  renderInProgress
}: UsePdfPageNavigationProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  const loadPdfPage = async (pageNum: number) => {
    if (!pdfDocRef.current) return;
    
    try {
      console.log(`Loading page ${pageNum}`);
      const page = await pdfDocRef.current.getPage(pageNum);
      return page;
    } catch (error) {
      console.error("Error loading PDF page:", error);
      return null;
    }
  };

  // Handle page navigation
  const goToNextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pdfDocRef.current && currentPage < totalPages && !renderInProgress.current) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pdfDocRef.current && currentPage > 1 && !renderInProgress.current) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return {
    currentPage,
    setCurrentPage,
    loadPdfPage,
    goToNextPage,
    goToPrevPage
  };
};
