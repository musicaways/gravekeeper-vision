
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, DownloadCloud, File, Image, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import CemeteryGallery from "./CemeteryGallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export interface CemeteryDocumentsProps {
  cemeteryId: string;
}

const CemeteryDocuments: React.FC<CemeteryDocumentsProps> = ({ cemeteryId }) => {
  const [galleryView, setGalleryView] = useState<"grid" | "list">("grid");
  const [galleryColumns, setGalleryColumns] = useState<1 | 2 | 3 | 4>(3);
  
  // Mock documents - in a real application, these would be fetched from a database
  const documents = [
    { id: 1, name: "Regolamento cimiteriale", type: "PDF", size: "1.2 MB", date: "01/03/2023" },
    { id: 2, name: "Piano manutenzione", type: "DOCX", size: "850 KB", date: "15/06/2023" },
    { id: 3, name: "Mappa dei settori", type: "PDF", size: "3.5 MB", date: "22/09/2023" },
    { id: 4, name: "Autorizzazioni comunali", type: "PDF", size: "1.8 MB", date: "10/12/2023" },
  ];

  return (
    <div className="w-full">
      <Tabs defaultValue="files" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="files" className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              <span>File</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-1.5">
              <Image className="h-4 w-4" />
              <span>Galleria</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Gallery view controls */}
          <TabsContent value="gallery" className="mt-0">
            <div className="flex items-center gap-2">
              <Button
                variant={galleryView === "grid" ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setGalleryView("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={galleryView === "list" ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setGalleryView("list")}
              >
                <List className="h-4 w-4" />
              </Button>

              {galleryView === "grid" && (
                <div className="flex items-center border rounded-md overflow-hidden">
                  {[2, 3, 4].map((cols) => (
                    <Button
                      key={cols}
                      variant="ghost"
                      size="sm"
                      className={`h-8 px-3 rounded-none ${galleryColumns === cols ? 'bg-muted' : ''}`}
                      onClick={() => setGalleryColumns(cols as 2 | 3 | 4)}
                    >
                      {cols}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </div>

        <TabsContent value="files" className="mt-0">
          <Card className="w-full shadow-sm mb-6">
            <CardHeader className="px-4 md:px-6 pb-2">
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                <FileText className="h-5 w-5" />
                File
              </CardTitle>
              <CardDescription>
                File relativi al cimitero
              </CardDescription>
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
                  <h3 className="font-medium text-lg mb-1">Nessun file</h3>
                  <p className="text-sm text-muted-foreground">Non ci sono file disponibili per questo cimitero.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="mt-4">
          <Card className="w-full shadow-sm">
            <CardHeader className="px-4 md:px-6 pb-2">
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                <Image className="h-5 w-5" />
                Galleria fotografica
              </CardTitle>
              <CardDescription>
                Foto relative al cimitero
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <CemeteryGallery 
                cemeteryId={cemeteryId} 
                columns={galleryColumns} 
                aspect={galleryView === "list" ? "wide" : "square"}
                className="mt-4"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CemeteryDocuments;
