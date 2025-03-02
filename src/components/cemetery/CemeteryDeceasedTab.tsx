
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export const CemeteryDeceasedTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Elenco defunti
        </CardTitle>
        <CardDescription>
          Visualizza e gestisci l'elenco dei defunti sepolti in questo cimitero
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nessun dato disponibile sui defunti in questo cimitero</p>
          <Button variant="outline" className="mt-4">
            Aggiungi un nuovo defunto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
