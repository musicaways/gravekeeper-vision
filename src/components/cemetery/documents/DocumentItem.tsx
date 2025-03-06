
import React from "react";
import { File, DownloadCloud, Trash2 } from "lucide-react";
import { DocumentItemType } from "./types";

interface DocumentItemProps {
  document: DocumentItemType;
  onDownload: (document: DocumentItemType) => void;
  onDelete: (document: DocumentItemType) => void;
  onClick?: () => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ 
  document, 
  onDownload, 
  onDelete,
  onClick 
}) => {
  return (
    <div 
      className="flex items-center justify-between p-3 bg-accent rounded-md hover:bg-accent/80 transition-colors"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="flex items-center gap-3">
        <File className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium text-sm sm:text-base">{document.name}</h3>
          <p className="text-xs text-muted-foreground">{document.description}</p>
          <p className="text-xs text-muted-foreground">{document.type} • {document.date}</p>
        </div>
      </div>
      <div className="flex gap-1">
        <button 
          className="p-2 rounded-full hover:bg-background transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDownload(document);
          }}
          aria-label="Scarica documento"
        >
          <DownloadCloud className="h-4 w-4 text-primary" />
        </button>
        <button 
          className="p-2 rounded-full hover:bg-background transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(document);
          }}
          aria-label="Elimina documento"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </button>
      </div>
    </div>
  );
};

export default DocumentItem;
