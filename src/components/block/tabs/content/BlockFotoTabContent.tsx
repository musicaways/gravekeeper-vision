
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Plus } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface BlockFotoTabContentProps {
  blockId: string;
}

const BlockFotoTabContent: React.FC<BlockFotoTabContentProps> = ({ blockId }) => {
  // Mock foto - in una vera applicazione, queste verrebbero recuperate dal database
  const photos = [
    { id: 1, url: "https://images.unsplash.com/photo-1553875039-969e5a872727?auto=format&fit=crop&w=300&h=300&q=80", descrizione: "Vista frontale" },
    { id: 2, url: "https://images.unsplash.com/photo-1552559789-c57c0a79a8cd?auto=format&fit=crop&w=300&h=300&q=80", descrizione: "Panoramica laterale" },
    { id: 3, url: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=300&h=300&q=80", descrizione: "Dettaglio loculi" },
    { id: 4, url: "https://images.unsplash.com/photo-1591115765373-5207764f72e4?auto=format&fit=crop&w=300&h=300&q=80", descrizione: "Vista posteriore" },
  ];

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Image className="h-5 w-5" />
          Galleria fotografica
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="group rounded-md overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all">
                <div className="relative">
                  <AspectRatio ratio={1} className="bg-muted">
                    <img 
                      src={photo.url} 
                      alt={photo.descrizione} 
                      className="object-cover w-full h-full rounded-t-md" 
                    />
                  </AspectRatio>
                </div>
                <div className="p-2">
                  <p className="text-sm text-muted-foreground truncate">{photo.descrizione}</p>
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
  );
};

export default BlockFotoTabContent;
