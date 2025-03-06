
import { DocumentViewerFile } from "./types";
import { Loader2, FileText, Download, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface FilePreviewProps {
  currentFile: DocumentViewerFile | undefined;
  fileType: string;
  title: string;
  scale: number;
  handleDownload: () => void;
  handleZoomIn: () => void;
}

const FilePreview = ({
  currentFile,
  fileType,
  title,
  scale,
  handleDownload,
  handleZoomIn
}: FilePreviewProps) => {
  const isPdf = fileType.toLowerCase() === 'pdf';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(fileType.toLowerCase());
  
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

  if (isPdf) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative">
        <iframe
          src={`${currentFile.url}#zoom=${scale < 1.5 ? '100' : '150'}`}
          title={title}
          className="w-full h-full"
          style={{ backgroundColor: "white" }}
        ></iframe>
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="opacity-80 hover:opacity-100"
          >
            <Download className="w-4 h-4 mr-1" /> Apri PDF
          </Button>
        </div>
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
            handleZoomIn();
          }}
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
