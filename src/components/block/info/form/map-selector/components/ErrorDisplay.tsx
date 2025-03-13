
import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorDisplayProps {
  errorMessage: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-muted/40 rounded-md p-6 text-center">
      <AlertTriangle className="h-8 w-8 text-destructive mb-4" />
      <h3 className="text-base font-medium mb-2">Errore caricamento mappa</h3>
      <p className="text-sm text-muted-foreground">
        {errorMessage || "Impossibile caricare Google Maps. Verificare la chiave API nelle impostazioni."}
      </p>
    </div>
  );
};

export default ErrorDisplay;
