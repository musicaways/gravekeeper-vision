
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import React from "react";

export interface CemeteryDeceasedTabProps {
  cemeteryId: string;
}

export const CemeteryDeceasedTab: React.FC<CemeteryDeceasedTabProps> = ({ cemeteryId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Defunti nel cimitero
        </CardTitle>
        <CardDescription>
          Visualizza e gestisci l'elenco dei defunti sepolti in questo cimitero
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nessun defunto registrato per questo cimitero</p>
          <Button variant="outline" className="mt-4">
            Aggiungi un nuovo defunto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
