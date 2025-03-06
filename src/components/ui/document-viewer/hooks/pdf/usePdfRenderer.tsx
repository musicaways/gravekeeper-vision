
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
  forceRender: MutableRefObject<boolean>;
}

export const usePdfRenderer = ({
  canvasRef,
  pdfDocRef,
  currentPage,
  scale,
  setInitialRenderComplete,
  initialRenderComplete,
  renderInProgress,
  setSwipeEnabled,
  forceRender
}: UsePdfRendererProps) => {
  const lastPageRef = useRef<number>(0);
  const lastScaleRef = useRef<number>(0); // Set to 0 to force initial render
  const renderAttempts = useRef<number>(0);
  const lastRenderTimestamp = useRef<number>(0);
  
  // Render the current page of the PDF
  useEffect(() => {
    let isActive = true; // Flag to prevent operations after unmount
    
    const renderPage = async () => {
      if (!pdfDocRef.current) {
        console.log("Cannot render PDF: No PDF document available");
        return;
      }
      
      if (!canvasRef.current) {
        console.log("Cannot render PDF: Canvas not available");
        
        // If we have a document but no canvas, retry after a short delay (up to 3 times)
        if (pdfDocRef.current && renderAttempts.current < 3) {
          renderAttempts.current += 1;
          console.log(`Render attempt ${renderAttempts.current}/3: Canvas not available, retrying in 200ms`);
          setTimeout(() => {
            if (isActive) renderPage();
          }, 200);
        }
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
        const currentTime = Date.now();
        
        // Force render on first load or on scale/page change or when explicitly requested
        // Also force if it's been more than 5 seconds since last render and initial render is not complete
        const timeSinceLastRender = currentTime - lastRenderTimestamp.current;
        const timeoutRender = !initialRenderComplete && timeSinceLastRender > 5000;
        
        const shouldForceRender = 
          forceRender.current || // Force render flag is set
          !initialRenderComplete || // Always force render on first load
          currentPage !== lastPageRef.current || 
          Math.abs(scale - lastScaleRef.current) > 0.01 || // Force render on scale change (with small tolerance)
          timeoutRender;
        
        console.log(`PDF render check: Page: ${currentPage}, Scale: ${scale}, Force: ${shouldForceRender}, initialRender: ${initialRenderComplete}, forceRender: ${forceRender.current}, timeoutRender: ${timeoutRender}, timeSinceLastRender: ${timeSinceLastRender}ms`);
        
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
        
        // Cancella il canvas prima di renderizzare per evitare artefatti
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Render the page
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        
        console.log("Starting PDF render task");
        const renderTask = page.render(renderContext);
        await renderTask.promise;
        console.log("PDF render task completed");
        
        if (!isActive) {
          renderInProgress.current = false;
          return;
        }
        
        // Update refs after successful render
        lastPageRef.current = currentPage;
        lastScaleRef.current = scale;
        forceRender.current = false; // Reset force render flag
        renderAttempts.current = 0; // Reset render attempts
        lastRenderTimestamp.current = Date.now();
        
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
        
        // If render fails and we haven't tried too many times, retry
        if (renderAttempts.current < 3) {
          renderAttempts.current += 1;
          console.log(`Render failed, attempt ${renderAttempts.current}/3: Retrying in 300ms`);
          setTimeout(() => {
            if (isActive) renderPage();
          }, 300);
        }
      } finally {
        if (isActive) {
          renderInProgress.current = false;
        }
      }
    };
    
    // Trigger render on mount and when dependencies change
    renderPage();
    
    // Schedule periodic re-renders if initial render is not complete
    const renderTimer = !initialRenderComplete ? 
      setInterval(() => {
        if (!initialRenderComplete && !renderInProgress.current && isActive) {
          console.log("Timer-triggered render attempt");
          forceRender.current = true;
          renderPage();
        }
      }, 2000) : null; // Riduciamo a 2 secondi per essere più reattivi
    
    // Cleanup
    return () => {
      isActive = false;
      if (renderTimer) clearInterval(renderTimer);
      renderInProgress.current = false;
    };
  }, [canvasRef, pdfDocRef, currentPage, scale, setInitialRenderComplete, initialRenderComplete, renderInProgress, setSwipeEnabled, forceRender]);
};
