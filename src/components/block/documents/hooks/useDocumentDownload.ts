
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DocumentItemType } from "@/components/cemetery/documents/types";

export const useDocumentDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async (document: DocumentItemType) => {
    try {
      setIsDownloading(true);

      console.log("Starting download for document:", document.name);
      
      // Attempt to fetch the file
      const response = await fetch(document.url);
      
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }
      
      // Get the file as a blob
      const blob = await response.blob();
      
      // Create a URL for the blob
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = document.name;
      
      // Append the link to the body
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
      
      console.log("Document download completed successfully");
      
      toast({
        title: "File scaricato",
        description: `${document.name} è stato scaricato con successo`
      });
    } catch (error) {
      console.error("Error during download:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il download del file",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return { isDownloading, handleDownload };
};
