
import React from "react";
import { FileText } from "lucide-react";

const DocumentsEmptyState: React.FC = () => {
  return (
    <div className="text-center py-8">
      <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
      <h3 className="font-medium text-lg mb-1">Nessun file</h3>
      <p className="text-sm text-muted-foreground">Non ci sono file disponibili per questo blocco.</p>
    </div>
  );
};

export default DocumentsEmptyState;
