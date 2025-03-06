
import { useState, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

// Set the worker source from CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface UsePdfViewerProps {
  url: string;
  scale: number;
  initialPage?: number;
}

export const usePdfViewer = ({ url, scale, initialPage = 1 }: UsePdfViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const lastRenderedScale = useRef<number>(0); // Track last rendered scale to avoid unnecessary rendering
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  
  // Function to render PDF page
  const renderPage = async (page: PDFPageProxy, forceScale?: number) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Use the provided scale or current scale prop
    const scaleToUse = forceScale !== undefined ? forceScale : scale;
    
    // Skip rendering if scale hasn't changed
    if (scaleToUse === lastRenderedScale.current && initialRenderComplete) {
      console.log("Skipping render - scale unchanged:", scaleToUse);
      return;
    }
    
    // Apply scaling factor
    const viewport = page.getViewport({ scale: scaleToUse * 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    try {
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      console.log("Page rendered successfully with scale:", scaleToUse);
      
      // Update last rendered scale
      lastRenderedScale.current = scaleToUse;
      
      if (!initialRenderComplete) {
        setInitialRenderComplete(true);
      }
    } catch (error) {
      console.error("Error rendering PDF page:", error);
      setPdfError("Errore nel rendering della pagina PDF");
    }
  };

  const loadPdfPage = async (pageNum: number) => {
    if (!pdfDocRef.current) return;
    
    try {
      console.log(`Loading page ${pageNum} with scale ${scale}`);
      const page = await pdfDocRef.current.getPage(pageNum);
      await renderPage(page);
    } catch (error) {
      console.error("Error loading PDF page:", error);
      setPdfError("Impossibile caricare la pagina del PDF");
    }
  };

  // Load PDF document
  useEffect(() => {
    if (!url) return;

    const loadPdf = async () => {
      console.log("Loading PDF:", url);
      try {
        setPdfLoading(true);
        setPdfError(null);
        setInitialRenderComplete(false);
        lastRenderedScale.current = 0; // Reset last rendered scale
        
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({
          url: url,
          cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
          cMapPacked: true,
        });
        
        const pdf = await loadingTask.promise;
        console.log("PDF loaded successfully, pages:", pdf.numPages);
        
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        
        // Get the first page
        const page = await pdf.getPage(1);
        
        // Force initial render with scale=1 to ensure visibility
        await renderPage(page, 1);
        setPdfLoading(false);
      } catch (error) {
        console.error("Error loading PDF:", error);
        setPdfError("Impossibile caricare il PDF. Prova a scaricarlo.");
        setPdfLoading(false);
      }
    };

    loadPdf();
    
    // Cleanup function
    return () => {
      if (pdfDocRef.current) {
        pdfDocRef.current.destroy().catch(err => {
          console.error("Error destroying PDF document:", err);
        });
        pdfDocRef.current = null;
      }
    };
  }, [url]);

  // Update rendering when scale changes
  useEffect(() => {
    const updatePdfScale = async () => {
      console.log("Scale changed to:", scale, "Last rendered scale:", lastRenderedScale.current);
      if (pdfDocRef.current && canvasRef.current) {
        try {
          const page = await pdfDocRef.current.getPage(currentPage);
          await renderPage(page);
        } catch (error) {
          console.error("Error updating PDF scale:", error);
        }
      }
    };

    // Only update scale if scale has changed AND initial render is complete
    if (initialRenderComplete && scale !== lastRenderedScale.current) {
      updatePdfScale();
    }
  }, [scale, currentPage, initialRenderComplete]);

  // Force a re-render after the component has mounted
  useEffect(() => {
    const forceRender = async () => {
      if (!initialRenderComplete && pdfDocRef.current) {
        try {
          const page = await pdfDocRef.current.getPage(currentPage);
          await renderPage(page, 1);
        } catch (error) {
          console.error("Error forcing render:", error);
        }
      }
    };
    
    // Small delay to ensure component is fully mounted
    const timer = setTimeout(forceRender, 500);
    return () => clearTimeout(timer);
  }, [initialRenderComplete, currentPage]);

  // Handle page navigation
  const goToNextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pdfDocRef.current && currentPage < totalPages) {
      setCurrentPage(prev => {
        const nextPage = prev + 1;
        loadPdfPage(nextPage);
        return nextPage;
      });
    }
  };

  const goToPrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pdfDocRef.current && currentPage > 1) {
      setCurrentPage(prev => {
        const prevPage = prev - 1;
        loadPdfPage(prevPage);
        return prevPage;
      });
    }
  };

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
