
import { useState, useRef, useEffect, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocumentProxy } from "pdfjs-dist";

// Set the worker source from CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface UsePdfDocumentProps {
  url: string;
}

export const usePdfDocument = ({ url }: UsePdfDocumentProps) => {
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const loadingTaskRef = useRef<pdfjsLib.PDFDocumentLoadingTask | null>(null);
  const loadAttemptsRef = useRef<number>(0);
  
  const cleanupPdf = useCallback(async () => {
    // Cancel the loading task if it's still in progress
    if (loadingTaskRef.current) {
      try {
        console.log("Cancelling PDF loading task");
        await loadingTaskRef.current.destroy();
        loadingTaskRef.current = null;
      } catch (err) {
        console.error("Error destroying PDF loading task:", err);
      }
    }
    
    // Clean up the PDF document
    if (pdfDocRef.current) {
      try {
        console.log("Destroying previous PDF document");
        await pdfDocRef.current.destroy();
        pdfDocRef.current = null;
      } catch (err) {
        console.error("Error destroying PDF document:", err);
      }
    }
  }, []);

  const reloadPdf = useCallback(async () => {
    console.log("Manually reloading PDF:", url);
    await cleanupPdf();
    setPdfLoading(true);
    setPdfError(null);
    loadAttemptsRef.current = 0; // Reset load attempts counter
    loadPdf(true);
  }, [url, cleanupPdf]);
  
  const loadPdf = useCallback(async (isRetry = false) => {
    let isActive = true; // Flag to prevent state updates after unmount
    
    if (!url) {
      console.error("No URL provided for PDF");
      setPdfError("URL PDF non valido");
      setPdfLoading(false);
      return;
    }

    console.log(`${isRetry ? "Retrying" : "Loading"} PDF:`, url);
    
    try {
      if (!isRetry) {
        setPdfLoading(true);
        setPdfError(null);
      }
      
      // Cleanup previous PDF if exists (already done if this is a retry)
      if (!isRetry) {
        await cleanupPdf();
      }
      
      // Load the PDF document with retry mechanism
      const loadWithRetry = async (retries = 3) => {
        try {
          // Log worker URL to help debug worker issues
          console.log("PDF.js worker URL:", pdfjsLib.GlobalWorkerOptions.workerSrc);
          console.log("Creating PDF loading task...");
          
          loadingTaskRef.current = pdfjsLib.getDocument({
            url: url,
            cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
            cMapPacked: true,
          });
          
          console.log("PDF loading task created, waiting for promise to resolve");
          
          // Add debug logging for promise state
          const loadingPromise = loadingTaskRef.current.promise;
          
          // Create a timeout for the loading task
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error("PDF load timeout after 30 seconds"));
            }, 30000); // 30 second timeout
          });
          
          // Race between the loading promise and timeout
          const pdf = await Promise.race([
            loadingPromise,
            timeoutPromise
          ]) as PDFDocumentProxy;
          
          console.log("PDF loading task promise resolved");
          return pdf;
        } catch (error) {
          console.error("Error in PDF loading task:", error);
          loadAttemptsRef.current += 1;
          console.log(`PDF load attempt ${loadAttemptsRef.current} failed`);
          
          if (retries > 0 && isActive) {
            console.warn(`PDF load failed, retrying... (${retries} attempts left)`);
            // Add exponential backoff for retries
            const backoffDelay = Math.min(1000 * Math.pow(2, 3 - retries), 5000);
            console.log(`Waiting ${backoffDelay}ms before next attempt`);
            
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
            return await loadWithRetry(retries - 1);
          }
          throw error;
        }
      };
      
      const pdf = await loadWithRetry();
      
      if (!isActive) {
        // If component unmounted, clean up the PDF and return
        pdf.destroy().catch(err => console.error("Error destroying PDF after unmount:", err));
        return;
      }
      
      console.log("PDF loaded successfully, pages:", pdf.numPages);
      
      pdfDocRef.current = pdf;
      setTotalPages(pdf.numPages);
      setPdfLoading(false);
      loadAttemptsRef.current = 0; // Reset counter on success
    } catch (error) {
      console.error("Error loading PDF:", error);
      if (isActive) {
        setPdfError("Impossibile caricare il PDF. Prova a scaricarlo.");
        setPdfLoading(false);
      }
    }
  }, [url, cleanupPdf]);
  
  // Load PDF document when URL changes
  useEffect(() => {
    let isActive = true; // Flag to prevent state updates after unmount
    loadPdf();
    
    // Cleanup function
    return () => {
      isActive = false;
      cleanupPdf();
    };
  }, [url, loadPdf, cleanupPdf]);

  return {
    pdfLoading,
    pdfError,
    pdfDocRef,
    totalPages,
    reloadPdf
  };
};
