
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
  const lastScaleRef = useRef<number>(0); // Force initial render with 0
  
  // Render the current page of the PDF
  useEffect(() => {
    let isActive = true; // Flag to prevent operations after unmount
    
    const renderPage = async () => {
      if (!canvasRef.current || !pdfDocRef.current || !isActive) {
        console.log("Cannot render PDF: Canvas or PDF document not available");
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
        
        // Force render on first load or on scale/page change
        const shouldForceRender = 
          !initialRenderComplete || // Always force render on first load
          currentPage !== lastPageRef.current || 
          scale !== lastScaleRef.current;
        
        console.log(`PDF render check: Page: ${currentPage}, Scale: ${scale}, Force: ${shouldForceRender}, initialRender: ${initialRenderComplete}`);
        
        if (!shouldForceRender && initialRenderComplete) {
          console.log("Skipping PDF render - no changes detected");
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
        
        // Set initial render complete if not already done
        if (!initialRenderComplete) {
          console.log("Initial PDF render complete");
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
    
    // Add a small delay before rendering to ensure the component is fully mounted
    const timerId = setTimeout(() => {
      renderPage();
    }, 100);
    
    // Cleanup
    return () => {
      isActive = false;
      clearTimeout(timerId);
      renderInProgress.current = false;
    };
  }, [canvasRef, pdfDocRef, currentPage, scale, setInitialRenderComplete, initialRenderComplete, renderInProgress, setSwipeEnabled]);
};
