
import React from 'react';
import { Loader2 } from "lucide-react";

const PdfLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-white text-sm">Caricamento PDF in corso...</p>
    </div>
  );
};

export default PdfLoading;
