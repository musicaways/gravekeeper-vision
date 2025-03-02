
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DownloadCloud, File } from "lucide-react";

export interface CemeteryDocumentsProps {
  cemeteryId: string;
}

const CemeteryDocuments: React.FC<CemeteryDocumentsProps> = ({ cemeteryId }) => {
  // Mock documents - in a real application, these would be fetched from a database
  const documents = [
    { id: 1, name: "Regolamento cimiteriale", type: "PDF", size: "1.2 MB", date: "01/03/2023" },
    { id: 2, name: "Piano manutenzione", type: "DOCX", size: "850 KB", date: "15/06/2023" },
    { id: 3, name: "Mappa dei settori", type: "PDF", size: "3.5 MB", date: "22/09/2023" },
    { id: 4, name: "Autorizzazioni comunali", type: "PDF", size: "1.8 MB", date: "10/12/2023" },
  ];

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <FileText className="h-5 w-5" />
          Documenti
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        {documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-accent rounded-md hover:bg-accent/80 transition-colors">
                <div className="flex items-center gap-3">
                  <File className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium text-sm sm:text-base">{doc.name}</h3>
                    <p className="text-xs text-muted-foreground">{doc.type} • {doc.size} • {doc.date}</p>
                  </div>
                </div>
                <button className="p-2 rounded-full hover:bg-background transition-colors">
                  <DownloadCloud className="h-4 w-4 text-primary" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
            <h3 className="font-medium text-lg mb-1">Nessun documento</h3>
            <p className="text-sm text-muted-foreground">Non ci sono documenti disponibili per questo cimitero.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CemeteryDocuments;
