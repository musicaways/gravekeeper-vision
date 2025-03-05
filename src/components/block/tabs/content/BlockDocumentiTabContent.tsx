
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DownloadCloud, File, Image } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface BlockDocumentiTabContentProps {
  blockId: string;
}

const BlockDocumentiTabContent: React.FC<BlockDocumentiTabContentProps> = ({ blockId }) => {
  // Mock documenti - in una vera applicazione, questi verrebbero recuperati dal database
  const documenti = [
    { id: 1, name: "Planimetria blocco", type: "PDF", size: "1.2 MB", date: "01/03/2023" },
    { id: 2, name: "Schema numerazione loculi", type: "DOCX", size: "850 KB", date: "15/06/2023" },
    { id: 3, name: "Piano manutenzione blocco", type: "PDF", size: "3.5 MB", date: "22/09/2023" },
  ];

  // Mock foto - in una vera applicazione, queste verrebbero recuperate dal database
  const photos = [
    { id: 1, url: "https://images.unsplash.com/photo-1553875039-969e5a872727?auto=format&fit=crop&w=300&h=300&q=80", descrizione: "Vista frontale" },
    { id: 2, url: "https://images.unsplash.com/photo-1552559789-c57c0a79a8cd?auto=format&fit=crop&w=300&h=300&q=80", descrizione: "Panoramica laterale" },
    { id: 3, url: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=300&h=300&q=80", descrizione: "Dettaglio loculi" },
    { id: 4, url: "https://images.unsplash.com/photo-1591115765373-5207764f72e4?auto=format&fit=crop&w=300&h=300&q=80", descrizione: "Vista posteriore" },
  ];

  return (
    <div className="px-4 py-4">
      <Card className="w-full shadow-sm mb-6">
        <CardHeader className="px-4 md:px-6 pb-2">
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
            <FileText className="h-5 w-5" />
            Documenti
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          {documenti.length > 0 ? (
            <div className="space-y-4">
              {documenti.map((doc) => (
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
              <p className="text-sm text-muted-foreground">Non ci sono documenti disponibili per questo blocco.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Foto del blocco */}
      <Card className="w-full shadow-sm">
        <CardHeader className="px-4 md:px-6 pb-2">
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
            <Image className="h-5 w-5" />
            Galleria fotografica
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="group rounded-md overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all">
                  <AspectRatio ratio={1} className="bg-muted">
                    <img 
                      src={photo.url} 
                      alt={photo.descrizione} 
                      className="object-cover w-full h-full rounded-t-md" 
                    />
                  </AspectRatio>
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground truncate">{photo.descrizione}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Image className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
              <h3 className="font-medium text-lg mb-1">Nessuna foto</h3>
              <p className="text-sm text-muted-foreground">Non ci sono foto disponibili per questo blocco.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockDocumentiTabContent;
