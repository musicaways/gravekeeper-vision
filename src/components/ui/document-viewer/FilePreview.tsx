
import { useEffect, useRef, useState } from "react";
import { DocumentViewerFile } from "./types";
import { Loader2, FileText, Download, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FilePreviewProps {
  currentFile: DocumentViewerFile | undefined;
  fileType: string;
  title: string;
  scale: number;
  handleDownload: () => void;
  handleZoomIn: () => void;
  toggleControls: () => void;
}

const FilePreview = ({
  currentFile,
  fileType,
  title,
  scale,
  handleDownload,
  handleZoomIn,
  toggleControls
}: FilePreviewProps) => {
  const isPdf = fileType.toLowerCase() === 'pdf';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(fileType.toLowerCase());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  
  if (!currentFile) {
    return <div className="flex items-center justify-center w-full">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>;
  }

  const imageStyle = {
    transform: `scale(${scale})`,
    transformOrigin: 'center',
    transition: 'transform 0.2s ease-out'
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scale > 1) {
      // Reset zoom
      handleZoomIn();
    } else {
      // Zoom in
      handleZoomIn();
      handleZoomIn();
    }
  };

  // Function to render PDF page
  useEffect(() => {
    if (!isPdf || !currentFile?.url || !canvasRef.current) return;

    const loadPdf = async () => {
      try {
        setPdfLoading(true);
        setPdfError(null);
        
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument(currentFile.url);
        const pdf = await loadingTask.promise;
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        
        // Get the first page
        const page = await pdf.getPage(currentPage);
        renderPage(page);
      } catch (error) {
        console.error("Error loading PDF:", error);
        setPdfError("Impossibile caricare il PDF. Prova a scaricarlo.");
      } finally {
        setPdfLoading(false);
      }
    };

    loadPdf();
  }, [currentFile?.url, isPdf, currentPage]);

  // Function to render a specific page
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

    await page.render(renderContext).promise;
  };

  // Update rendering when scale changes
  useEffect(() => {
    const updatePdfScale = async () => {
      if (isPdf && pdfDocRef.current && canvasRef.current) {
        const page = await pdfDocRef.current.getPage(currentPage);
        renderPage(page);
      }
    };

    updatePdfScale();
  }, [scale, currentPage]);

  // Handle page navigation
  const goToNextPage = async () => {
    if (pdfDocRef.current && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = async () => {
    if (pdfDocRef.current && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (isPdf) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative bg-white">
        {pdfLoading ? (
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        ) : pdfError ? (
          <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
            <FileText className="w-16 h-16 text-muted-foreground" />
            <p className="text-muted-foreground">{pdfError}</p>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-1" /> Scarica PDF
            </Button>
          </div>
        ) : (
          <>
            <div 
              className="flex-1 overflow-auto w-full flex items-center justify-center cursor-zoom-in"
              onClick={toggleControls}
              onDoubleClick={handleDoubleClick}
            >
              <canvas ref={canvasRef} className="max-w-full" />
            </div>
            
            {totalPages > 1 && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-secondary/80 rounded-md px-3 py-1.5 text-sm">
                <button 
                  onClick={goToPrevPage} 
                  disabled={currentPage <= 1}
                  className="p-1 rounded hover:bg-secondary-foreground/10 disabled:opacity-50"
                >
                  ←
                </button>
                <span>
                  {currentPage} / {totalPages}
                </span>
                <button 
                  onClick={goToNextPage} 
                  disabled={currentPage >= totalPages}
                  className="p-1 rounded hover:bg-secondary-foreground/10 disabled:opacity-50"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  if (isImage) {
    return (
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <motion.img
          src={currentFile.url}
          alt={title}
          className="max-h-full max-w-full object-contain cursor-zoom-in"
          style={imageStyle}
          onClick={(e) => {
            e.stopPropagation();
            toggleControls();
          }}
          onDoubleClick={handleDoubleClick}
          draggable={false}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        />
      </div>
    );
  }

  // For all other file types
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <FileText className="w-16 h-16 text-muted-foreground" />
      <p className="text-center max-w-md text-muted-foreground">
        {title ? title : "Questo tipo di file non può essere visualizzato."}
      </p>
      <Button
        variant="outline"
        onClick={handleDownload}
      >
        <Download className="w-4 h-4 mr-1" /> Scarica file
      </Button>
    </div>
  );
};

export default FilePreview;
