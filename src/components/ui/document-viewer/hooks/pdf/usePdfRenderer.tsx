
import { useEffect, useRef, MutableRefObject } from "react";
import { PDFDocumentProxy } from "pdfjs-dist";

interface UsePdfRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  pdfDocRef: MutableRefObject<PDFDocumentProxy | null>;
  currentPage: number;
  scale: number;
  setInitialRenderComplete: (complete: boolean) => void;
  initialRenderComplete: boolean;
  renderInProgress: MutableRefObject<boolean>;
  setSwipeEnabled: (enabled: boolean) => void;
}

export const usePdfRenderer = ({
  canvasRef,
  pdfDocRef,
  currentPage,
  scale,
  setInitialRenderComplete,
  initialRenderComplete,
  renderInProgress,
  setSwipeEnabled
}: UsePdfRendererProps) => {
  const lastPageRef = useRef<number>(0);
  const lastScaleRef = useRef<number>(1);
  
  // Render the current page of the PDF
  useEffect(() => {
    let isActive = true; // Flag to prevent operations after unmount
    
    const renderPage = async () => {
      if (!canvasRef.current || !pdfDocRef.current || !isActive) {
        return;
      }
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) {
        console.error("Canvas context not available");
        return;
      }
      
      try {
        renderInProgress.current = true;
        
        // Check if we're rendering the same page at the same scale
        if (currentPage === lastPageRef.current && 
            scale === lastScaleRef.current && 
            initialRenderComplete) {
          renderInProgress.current = false;
          return;
        }
        
        console.log(`Rendering PDF page ${currentPage} at scale ${scale}`);
        
        // Load the page
        const page = await pdfDocRef.current.getPage(currentPage);
        if (!isActive) {
          renderInProgress.current = false;
          return;
        }
        
        // Update viewport with current scale
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Render the page
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        
        const renderTask = page.render(renderContext);
        await renderTask.promise;
        
        if (!isActive) {
          renderInProgress.current = false;
          return;
        }
        
        // Update refs after successful render
        lastPageRef.current = currentPage;
        lastScaleRef.current = scale;
        
        if (!initialRenderComplete) {
          setInitialRenderComplete(true);
        }
        
        // Determine if swipe should be enabled based on scale
        setSwipeEnabled(scale <= 1);
        console.log(`After render, swipe navigation ${scale <= 1 ? 'enabled' : 'disabled'}`);
        
      } catch (error) {
        console.error("Error rendering PDF page:", error);
      } finally {
        if (isActive) {
          renderInProgress.current = false;
        }
      }
    };
    
    renderPage();
    
    // Cleanup
    return () => {
      isActive = false;
      renderInProgress.current = false;
    };
  }, [canvasRef, pdfDocRef, currentPage, scale, setInitialRenderComplete, initialRenderComplete, renderInProgress, setSwipeEnabled]);
};
