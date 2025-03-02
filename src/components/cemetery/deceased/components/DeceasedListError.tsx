
import React from "react";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";

interface DeceasedListErrorProps {
  onRetry: () => void;
}

export const DeceasedListError: React.FC<DeceasedListErrorProps> = ({ onRetry }) => {
  return (
    <div className="text-center py-10">
      <CircleX className="h-12 w-12 text-destructive mx-auto mb-4" />
      <p className="text-muted-foreground">Si è verificato un errore durante il caricamento dei dati</p>
      <Button variant="outline" className="mt-4" onClick={onRetry}>
        Riprova
      </Button>
    </div>
  );
};
