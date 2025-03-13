
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentItemType } from "@/components/cemetery/documents/types";

export const useDocumentDownload = () => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (documentItem: DocumentItemType) => {
    try {
      setIsDownloading(true);
      
      // For PDFs and some document types, just opening might be better
      if (documentItem.type?.toLowerCase() === 'pdf') {
        window.open(documentItem.url, '_blank');
        
        toast({
          title: "PDF aperto",
          description: `Il file "${documentItem.name}" si aprirà in una nuova scheda.`,
        });
      } else {
        // For other files, use the fetch and download approach
        const response = await fetch(documentItem.url);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = downloadUrl;
        a.download = documentItem.name || 'document';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
        
        toast({
          title: "Download avviato",
          description: `Il file "${documentItem.name}" è stato scaricato.`,
        });
      }
    } catch (error) {
      console.error("Download error:", error);
      toast({
        variant: "destructive",
        title: "Errore di download",
        description: "Non è stato possibile scaricare il documento. Riprova più tardi.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return { handleDownload, isDownloading };
};
