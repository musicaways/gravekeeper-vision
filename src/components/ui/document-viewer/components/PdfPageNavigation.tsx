
import React from 'react';

interface PdfPageNavigationProps {
  currentPage: number;
  totalPages: number;
  goToPrevPage: (e: React.MouseEvent) => void;
  goToNextPage: (e: React.MouseEvent) => void;
}

const PdfPageNavigation = ({
  currentPage,
  totalPages,
  goToPrevPage,
  goToNextPage
}: PdfPageNavigationProps) => {
  if (totalPages <= 1) return null;
  
  return (
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
  );
};

export default PdfPageNavigation;
