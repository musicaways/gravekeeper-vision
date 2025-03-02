
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";

export const CemeteryMapTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          Mappa del cimitero
        </CardTitle>
        <CardDescription>
          Visualizza la mappa interattiva del cimitero
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <p className="text-muted-foreground">Mappa non disponibile per questo cimitero</p>
          <Button variant="outline" className="mt-4">
            Carica una mappa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
