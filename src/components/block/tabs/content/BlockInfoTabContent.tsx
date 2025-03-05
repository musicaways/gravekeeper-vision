
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BlockInfoTabContentProps {
  block: any;
}

const BlockInfoTabContent: React.FC<BlockInfoTabContentProps> = ({ block }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
    toast({
      title: "Modalità modifica",
      description: "Ora puoi modificare le informazioni del blocco.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="w-full shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl md:text-2xl">Informazioni blocco</CardTitle>
          <Button variant="outline" size="sm" onClick={handleEdit} className="gap-1">
            <Pencil className="h-4 w-4" />
            <span>Modifica</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Nome</h3>
              <p>{block.Nome || "Non specificato"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Codice</h3>
              <p>{block.Codice || "Non specificato"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Numero Loculi</h3>
              <p>{block.NumeroLoculi || 0}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Numero File</h3>
              <p>{block.NumeroFile || 0}</p>
            </div>
            
            {block.Annotazioni && (
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-sm font-medium mb-2">Annotazioni</h3>
                <p className="whitespace-pre-wrap">{block.Annotazioni}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Integrazione della mappa */}
      <Card className="w-full shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
            <Map className="h-5 w-5" />
            Mappa del blocco
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-md overflow-hidden h-[300px] md:h-[400px] relative">
            {block.geo_boundary ? (
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <p className="text-muted-foreground text-center">Mappa disponibile</p>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Map className="h-12 w-12 mx-auto text-muted-foreground/30 mb-2" />
                  <h3 className="text-lg font-medium text-muted-foreground">Mappa non disponibile</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    La mappa per questo blocco non è ancora stata creata.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockInfoTabContent;
