
import React from "react";
import { Map } from "lucide-react";

const BlockMapEmpty: React.FC = () => {
  return (
    <div className="text-center py-6 bg-muted/30 rounded-md">
      <Map className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
      <p className="text-muted-foreground mb-2">Mappa non disponibile per questo blocco</p>
    </div>
  );
};

export default BlockMapEmpty;
