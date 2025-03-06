
import React from 'react';
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PdfErrorProps {
  errorMessage: string;
  handleDownload: () => void;
}

const PdfError = ({ errorMessage, handleDownload }: PdfErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 text-center bg-white/10 rounded-lg">
      <FileText className="w-16 h-16 text-muted-foreground" />
      <p className="text-muted-foreground">{errorMessage}</p>
      <Button variant="outline" onClick={handleDownload}>
        <Download className="w-4 h-4 mr-1" /> Scarica PDF
      </Button>
    </div>
  );
};

export default PdfError;
