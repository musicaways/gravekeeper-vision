
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface BlockInfoTabContentProps {
  block: any;
}

const BlockInfoTabContent: React.FC<BlockInfoTabContentProps> = ({ block }) => {
  return (
    <Card className="w-full shadow-sm">
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
