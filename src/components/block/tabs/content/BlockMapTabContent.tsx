
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface BlockMapTabContentProps {
  block: any;
}

const BlockMapTabContent: React.FC<BlockMapTabContentProps> = ({ block }) => {
  return (
    <Card className="w-full shadow-sm">
      <CardContent className="pt-6">
        <div className="text-center p-12">
          <h3 className="text-lg font-medium text-muted-foreground">Mappa non disponibile</h3>
          <p className="text-sm text-muted-foreground mt-2">
            La visualizzazione della mappa per questo blocco non è attualmente disponibile.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockMapTabContent;
