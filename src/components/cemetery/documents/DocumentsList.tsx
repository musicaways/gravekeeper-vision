
import React from "react";
import DocumentItem from "./DocumentItem";
import DocumentsEmptyState from "./DocumentsEmptyState";
import { DocumentItemType } from "./types";

interface DocumentsListProps {
  documents: DocumentItemType[];
  loading: boolean;
  onDownload: (document: DocumentItemType) => void;
  onDelete: (document: DocumentItemType) => void;
}

const DocumentsList: React.FC<DocumentsListProps> = ({ 
  documents, 
  loading, 
  onDownload, 
  onDelete 
}) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Caricamento documenti...</p>
      </div>
    );
  }

  if (!documents.length) {
    return <DocumentsEmptyState />;
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <DocumentItem 
          key={doc.id} 
          document={doc} 
          onDownload={onDownload} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default DocumentsList;
