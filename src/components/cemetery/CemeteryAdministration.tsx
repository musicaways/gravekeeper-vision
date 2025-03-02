
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Info, Home } from "lucide-react";

const CemeteryAdministration = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Amministrazione
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full justify-start">
          <Users className="mr-2 h-4 w-4" />
          Gestione personale
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Calendar className="mr-2 h-4 w-4" />
          Pianifica manutenzione
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Info className="mr-2 h-4 w-4" />
          Visualizza statistiche
        </Button>
      </CardContent>
    </Card>
  );
};

export default CemeteryAdministration;
