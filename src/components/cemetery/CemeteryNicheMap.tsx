
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid3X3 } from "lucide-react";

export interface CemeteryNicheMapProps {
  // No props needed for now
}

export const CemeteryNicheMap: React.FC<CemeteryNicheMapProps> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3X3 className="h-5 w-5" />
          Mappa delle Nicchie
        </CardTitle>
        <CardDescription>
          Visualizza la mappa delle nicchie e la loro occupazione
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nessuna mappa di nicchie disponibile</p>
        </div>
      </CardContent>
    </Card>
  );
};
