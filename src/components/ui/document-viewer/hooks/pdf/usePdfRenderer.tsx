
import { useEffect, MutableRefObject } from "react";
import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

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
  // Track last rendered scale and page to avoid unnecessary rendering
  const lastRenderedScale = useRef<number>(0);
  const lastRenderedPage = useRef<number>(0);
  
  // Update swipe enabled when scale changes
  useEffect(() => {
    const shouldEnableSwipe = scale <= 1;
    console.log("PDF hook: Setting swipe enabled based on scale:", shouldEnableSwipe);
    setSwipeEnabled(shouldEnableSwipe);
  }, [scale, setSwipeEnabled]);
  
  // Function to render PDF page
  const renderPage = async (page: PDFPageProxy, forceScale?: number) => {
    if (!canvasRef.current || renderInProgress.current) return;

    renderInProgress.current = true;
    
    try {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) {
        renderInProgress.current = false;
        return;
      }

      // Use the provided scale or current scale prop
      const scaleToUse = forceScale !== undefined ? forceScale : scale;
      
      // Skip rendering if scale and page haven't changed
      if (scaleToUse === lastRenderedScale.current && 
          page.pageNumber === lastRenderedPage.current && 
          initialRenderComplete) {
        console.log("Skipping render - no changes detected:", 
                    {scale: scaleToUse, page: page.pageNumber, lastScale: lastRenderedScale.current, lastPage: lastRenderedPage.current});
        renderInProgress.current = false;
        return;
      }
      
      console.log("Rendering page", page.pageNumber, "with scale", scaleToUse);
      
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
      } catch (renderError) {
        console.error("Error in page render method:", renderError);
        // Continue despite render error - don't throw
      }
      
      // Update last rendered values
      lastRenderedScale.current = scaleToUse;
      lastRenderedPage.current = page.pageNumber;
      
      if (!initialRenderComplete) {
        setInitialRenderComplete(true);
      }
    } catch (error) {
      console.error("Error rendering PDF page:", error);
    } finally {
      renderInProgress.current = false;
    }
  };

  // Load and render current page when it changes
  useEffect(() => {
    const loadAndRenderPage = async () => {
      if (pdfDocRef.current && !renderInProgress.current) {
        try {
          const page = await pdfDocRef.current.getPage(currentPage);
          await renderPage(page);
        } catch (error) {
          console.error("Error loading and rendering page:", error);
        }
      }
    };
    
    loadAndRenderPage();
  }, [currentPage, pdfDocRef.current]);

  // Update rendering when scale changes
  useEffect(() => {
    const updatePdfScale = async () => {
      console.log("Scale changed to:", scale, "Last rendered scale:", lastRenderedScale.current);
      if (pdfDocRef.current && canvasRef.current && !renderInProgress.current) {
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
    if (!initialRenderComplete && pdfDocRef.current && !renderInProgress.current) {
      const forceRender = async () => {
        try {
          const page = await pdfDocRef.current!.getPage(currentPage);
          await renderPage(page, 1);
        } catch (error) {
          console.error("Error forcing render:", error);
        }
      };
      
      // Small delay to ensure component is fully mounted
      const timer = setTimeout(forceRender, 300);
      return () => clearTimeout(timer);
    }
  }, [initialRenderComplete, currentPage]);

  return { renderPage };
};
