
import React from "react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  errorMessage: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-muted/40 rounded-md p-4">
      <p className="text-center text-sm text-destructive mb-4">
        Si è verificato un errore durante il caricamento dell'API di Google Maps:
        <br />
        {errorMessage || "Controlla la chiave API nelle impostazioni."}
      </p>
      <Button
        variant="outline"
        onClick={() => window.location.href = '/settings'}
      >
        Vai alle impostazioni
      </Button>
    </div>
  );
};

export default ErrorDisplay;
