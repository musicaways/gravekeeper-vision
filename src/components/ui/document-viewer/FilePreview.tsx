
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentViewerFile } from "./types";

interface FilePreviewProps {
  currentFile: DocumentViewerFile;
  fileType: string;
  title: string;
  scale: number;
  handleDownload: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  currentFile,
  fileType,
  title,
  scale,
  handleDownload
}) => {
  const fileUrl = currentFile?.url || '';
  const fileTypeLower = fileType?.toLowerCase() || '';

  // PDF Preview
  if (fileTypeLower === 'pdf') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/5 rounded-md overflow-hidden" style={{ transform: `scale(${scale})`, transition: "transform 0.3s ease" }}>
        <iframe 
          src={`${fileUrl}#toolbar=0`} 
          className="w-full h-full max-h-[75vh]"
          title={title || "PDF Document"}
        />
      </div>
    );
  }
  
  // Image Preview (jpg, png, gif, bmp, etc.)
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(fileTypeLower)) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <img 
          src={fileUrl} 
          alt={title || "Image"} 
          className="max-h-[75vh] max-w-full object-contain"
          style={{ transform: `scale(${scale})`, transition: "transform 0.3s ease" }}
          onError={(e) => {
            console.error("Image load error:", e);
            e.currentTarget.src = "/placeholder.svg";
            e.currentTarget.alt = "Errore nel caricamento dell'immagine";
          }}
        />
      </div>
    );
  }
  
  // Generic Document
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-muted/30 rounded-md" style={{ transform: `scale(${scale})`, transition: "transform 0.3s ease" }}>
      <FileText className="h-24 w-24 text-primary/80 mb-4" />
      <h3 className="text-lg font-medium mb-2">{title || "Documento"}</h3>
      {fileType && <p className="text-sm text-muted-foreground mb-6 uppercase">{fileType}</p>}
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2"
        onClick={handleDownload}
      >
        <FileText className="h-4 w-4" />
        Scarica file
      </Button>
    </div>
  );
};

export default FilePreview;
