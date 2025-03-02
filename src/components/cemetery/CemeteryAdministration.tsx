import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

export interface CemeteryAdministrationProps {
  cemeteryId: string;
}

const CemeteryAdministration = ({ cemeteryId }: CemeteryAdministrationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Amministrazione
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            Informazioni sull'amministrazione del cimitero non disponibili.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CemeteryAdministration;
