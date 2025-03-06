
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentItemType } from "../types";

export const useDocumentDownload = () => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (document: DocumentItemType) => {
    try {
      setIsDownloading(true);
      
      // First try to open in a new tab (quickest user experience)
      window.open(document.url, '_blank');
      
      // Alternative method: Fetch and trigger download
      // This is a fallback if opening in a new tab doesn't work well
      // for certain document types
      
      // Uncomment this code if you need the alternative download method:
      /*
      const response = await fetch(document.url);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      a.download = document.name || 'document';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      */
      
      toast({
        title: "Download avviato",
        description: `Il file "${document.name}" si aprirà in una nuova scheda.`,
      });
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
