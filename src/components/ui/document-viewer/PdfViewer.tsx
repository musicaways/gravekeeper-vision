
import { useEffect, useRef, useState } from "react";
import { Loader2, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

// Set the worker source from CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  
  // Function to render PDF page
  const renderPage = async (page: PDFPageProxy) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const viewport = page.getViewport({ scale: scale * 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };

    try {
      await page.render(renderContext).promise;
    } catch (error) {
      console.error("Error rendering PDF page:", error);
      setPdfError("Errore nel rendering della pagina PDF");
    }
  };

  // Handle page navigation
  const goToNextPage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pdfDocRef.current && currentPage < totalPages) {
      setCurrentPage(prev => {
        const nextPage = prev + 1;
        loadPdfPage(nextPage);
        return nextPage;
      });
    }
  };

  const goToPrevPage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pdfDocRef.current && currentPage > 1) {
      setCurrentPage(prev => {
        const prevPage = prev - 1;
        loadPdfPage(prevPage);
        return prevPage;
      });
    }
  };

  const loadPdfPage = async (pageNum: number) => {
    if (!pdfDocRef.current) return;
    
    try {
      const page = await pdfDocRef.current.getPage(pageNum);
      renderPage(page);
    } catch (error) {
      console.error("Error loading PDF page:", error);
      setPdfError("Impossibile caricare la pagina del PDF");
    }
  };

  // Load PDF document
  useEffect(() => {
    if (!url || !canvasRef.current) return;

    // Function to load PDF
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
        console.log("PDF loaded successfully, pages:", pdf.numPages);
        
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        
        // Get the first page
        const page = await pdf.getPage(currentPage);
        await renderPage(page);
      } catch (error) {
        console.error("Error loading PDF:", error);
        setPdfError("Impossibile caricare il PDF. Prova a scaricarlo.");
      } finally {
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
      if (pdfDocRef.current && canvasRef.current) {
        try {
          const page = await pdfDocRef.current.getPage(currentPage);
          renderPage(page);
        } catch (error) {
          console.error("Error updating PDF scale:", error);
        }
      }
    };

    updatePdfScale();
  }, [scale]);

  if (pdfLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-white text-sm">Caricamento PDF in corso...</p>
      </div>
    );
  }

  if (pdfError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 text-center bg-white/10 rounded-lg">
        <FileText className="w-16 h-16 text-muted-foreground" />
        <p className="text-muted-foreground">{pdfError}</p>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-1" /> Scarica PDF
        </Button>
      </div>
    );
  }

  return (
    <>
      <div 
        className="flex-1 overflow-auto w-full flex items-center justify-center cursor-zoom-in"
        onClick={toggleControls}
        onDoubleClick={handleDoubleClick}
      >
        <canvas ref={canvasRef} className="max-w-full shadow-lg" />
      </div>
      
      {totalPages > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/80 text-white rounded-md px-4 py-2 text-sm z-10">
          <button 
            onClick={goToPrevPage} 
            disabled={currentPage <= 1}
            className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none"
            aria-label="Pagina precedente"
          >
            ←
          </button>
          <span className="mx-2">
            {currentPage} / {totalPages}
          </span>
          <button 
            onClick={goToNextPage} 
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none"
            aria-label="Pagina successiva"
          >
            →
          </button>
        </div>
      )}
    </>
  );
};

export default PdfViewer;
