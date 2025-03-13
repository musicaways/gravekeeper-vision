
import React from "react";
import { MapPin, Calendar, Map } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { decodeText } from "@/utils/textFormatters";

interface BlockLocationInfoProps {
  block: {
    Indirizzo?: string;
    DataCreazione?: string;
    NumeroFile?: number;
    NumeroLoculi?: number;
    Latitudine?: number;
    Longitudine?: number;
    Settore?: any;
  };
}

const BlockLocationInfo: React.FC<BlockLocationInfoProps> = ({ block }) => {
  return (
    <div className="w-full">
      <div className="flex items-center mb-3">
        <MapPin className="h-5 w-5 text-primary mr-2.5" />
        <h3 className="text-base font-medium text-foreground">Informazioni sulla posizione</h3>
      </div>
      
      <div className="pl-7 pr-1 space-y-4 mb-4">
        {block.Indirizzo && (
          <div>
            <h4 className="font-medium text-sm mb-1.5">Indirizzo</h4>
            <p className="text-sm text-muted-foreground">{decodeText(block.Indirizzo)}</p>
          </div>
        )}

        {block.Settore && (
          <div>
            <div className="flex items-center">
              <Map className="h-4 w-4 text-muted-foreground mr-1.5" />
              <h4 className="font-medium text-sm mb-0">Settore</h4>
            </div>
            <p className="text-sm text-muted-foreground mt-1 pl-5.5">
              {decodeText(block.Settore.Nome) || `Settore ${block.Settore.Id}`}
            </p>
          </div>
        )}

        {block.DataCreazione && (
          <div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground mr-1.5" />
              <h4 className="font-medium text-sm mb-0">Data di costruzione</h4>
            </div>
            <p className="text-sm text-muted-foreground mt-1 pl-5.5">{formatDate(block.DataCreazione, "long")}</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          {block.NumeroLoculi !== undefined && (
            <div>
              <h4 className="font-medium text-sm mb-1">Numero Loculi</h4>
              <p className="text-sm text-muted-foreground">{block.NumeroLoculi}</p>
            </div>
          )}
          
          {block.NumeroFile !== undefined && (
            <div>
              <h4 className="font-medium text-sm mb-1">Numero File</h4>
              <p className="text-sm text-muted-foreground">{block.NumeroFile}</p>
            </div>
          )}
        </div>
      </div>
      
      <Separator className="mb-4" />
    </div>
  );
};

export default BlockLocationInfo;
