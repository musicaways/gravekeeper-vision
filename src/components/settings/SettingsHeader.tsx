
import { Badge } from "@/components/ui/badge";
import { SettingsIcon } from "lucide-react";

export function SettingsHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <h1 className="text-3xl font-bold">Impostazioni</h1>
      <div className="flex items-center space-x-2 mt-2 md:mt-0">
        <Badge variant="outline" className="flex items-center gap-1">
          <SettingsIcon className="h-3 w-3" />
          Configurazione
        </Badge>
      </div>
    </div>
  );
}
