
import React from "react";
import { MapPin } from "lucide-react";

const BlockMapEmpty: React.FC = () => {
  return (
    <div className="w-full h-[400px] flex flex-col items-center justify-center bg-muted/30 rounded-md">
      <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-muted-foreground text-center">
        Nessuna mappa disponibile per questo blocco
      </p>
      <p className="text-muted-foreground text-sm text-center mt-2">
        La mappa non è stata configurata o non è accessibile
      </p>
    </div>
  );
};

export default BlockMapEmpty;
