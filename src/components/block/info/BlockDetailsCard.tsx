
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Phone, Map } from "lucide-react";

interface BlockDetailsCardProps {
  block: any;
}

const BlockDetailsCard: React.FC<BlockDetailsCardProps> = ({ block }) => {
  return (
    <Card className="w-full shadow-sm rounded-lg bg-card">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
          <MapPin className="h-5 w-5 text-primary" />
          Dettagli
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium text-foreground">Nome</h4>
                <p className="text-sm text-muted-foreground">{block.Nome || "Non disponibile"}</p>
              </div>
            </div>

            {block.Codice && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Codice</h4>
                  <p className="text-sm text-muted-foreground">{block.Codice}</p>
                </div>
              </div>
            )}

            {block.NumeroLoculi !== undefined && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Numero Loculi</h4>
                  <p className="text-sm text-muted-foreground">{block.NumeroLoculi}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {block.NumeroFile !== undefined && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Numero File</h4>
                  <p className="text-sm text-muted-foreground">{block.NumeroFile}</p>
                </div>
              </div>
            )}

            {block.Settore && (
              <div className="flex items-start gap-3">
                <Map className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Settore</h4>
                  <p className="text-sm text-muted-foreground">
                    {block.Settore.Nome || block.Settore.Codice || `Settore ${block.Settore.Id}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockDetailsCard;
