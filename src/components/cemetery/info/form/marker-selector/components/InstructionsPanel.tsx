
import React from "react";
import { Button } from "@/components/ui/button";

interface InstructionsPanelProps {
  showInstructions: boolean;
  onHideInstructions: () => void;
}

const InstructionsPanel = ({ showInstructions, onHideInstructions }: InstructionsPanelProps) => {
  if (!showInstructions) return null;
  
  return (
    <div className="bg-muted/30 p-4">
      <div className="flex items-start space-x-2">
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md w-full">
          <h4 className="font-medium text-amber-900 mb-2">Istruzioni per la selezione</h4>
          <ol className="list-decimal pl-5 space-y-1 text-amber-800">
            <li>Naviga sulla mappa fino a trovare il marker desiderato</li>
            <li>Clicca sul marker per selezionarlo</li>
            <li>Il marker selezionato verrà evidenziato e le sue informazioni appariranno</li>
            <li>Clicca su "Conferma selezione" per utilizzare questo marker</li>
          </ol>
          <p className="mt-2 text-amber-800 text-sm">
            <strong>Nota:</strong> A causa delle restrizioni di sicurezza di Google Maps, potrebbe essere necessario 
            selezionare il marker, copiare manualmente l'ID dalla barra degli indirizzi e incollarlo nel campo.
          </p>
          <div className="mt-3 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onHideInstructions}
            >
              Nascondi istruzioni
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPanel;
