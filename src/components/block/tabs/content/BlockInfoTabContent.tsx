
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil } from "lucide-react";
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

  // In una applicazione reale, qui andrebbe implementata
  // la logica di salvataggio delle modifiche 

  return (
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
  );
};

export default BlockInfoTabContent;
