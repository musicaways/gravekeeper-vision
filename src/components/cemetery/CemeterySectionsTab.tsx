
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapIcon } from "lucide-react";
import React from "react";

export interface CemeterySectionsTabProps {
  cemeteryId: string;
}

export const CemeterySectionsTab: React.FC<CemeterySectionsTabProps> = ({ cemeteryId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapIcon className="h-5 w-5" />
          Settori del cimitero
        </CardTitle>
        <CardDescription>
          Visualizza e gestisci le diverse aree e settori del cimitero
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nessun settore disponibile per questo cimitero</p>
          <Button variant="outline" className="mt-4">
            Aggiungi un nuovo settore
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
