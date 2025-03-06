
import { useState, useRef, useEffect } from "react";
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
  
  // Load PDF document when URL changes
  useEffect(() => {
    let isActive = true; // Flag to prevent state updates after unmount
    
    if (!url) return;

    const loadPdf = async () => {
      console.log("Loading PDF:", url);
      try {
        setPdfLoading(true);
        setPdfError(null);
        
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({
          url: url,
          cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
          cMapPacked: true,
        });
        
        const pdf = await loadingTask.promise;
        if (!isActive) return; // Prevent state updates if component unmounted
        
        console.log("PDF loaded successfully, pages:", pdf.numPages);
        
        // Cleanup previous PDF if exists
        if (pdfDocRef.current) {
          try {
            await pdfDocRef.current.destroy();
          } catch (err) {
            console.error("Error destroying previous PDF document:", err);
          }
        }
        
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        setPdfLoading(false);
      } catch (error) {
        console.error("Error loading PDF:", error);
        if (isActive) {
          setPdfError("Impossibile caricare il PDF. Prova a scaricarlo.");
          setPdfLoading(false);
        }
      }
    };

    loadPdf();
    
    // Cleanup function
    return () => {
      isActive = false;
      if (pdfDocRef.current) {
        pdfDocRef.current.destroy().catch(err => {
          console.error("Error destroying PDF document:", err);
        });
        pdfDocRef.current = null;
      }
    };
  }, [url]);

  return {
    pdfLoading,
    pdfError,
    pdfDocRef,
    totalPages
  };
};
