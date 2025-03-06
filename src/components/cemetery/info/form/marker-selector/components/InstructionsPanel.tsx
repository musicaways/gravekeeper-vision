
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Info } from "lucide-react";

interface InstructionsPanelProps {
  showInstructions: boolean;
  onHideInstructions: () => void;
}

const InstructionsPanel = ({ showInstructions, onHideInstructions }: InstructionsPanelProps) => {
  if (!showInstructions) return null;
  
  return (
    <div className="bg-amber-50 border-y border-amber-200 p-4">
      <div className="flex items-start">
        <Info className="text-amber-500 h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="ml-3">
          <h3 className="font-medium text-amber-800">Istruzioni per la selezione</h3>
          <ol className="mt-2 space-y-3 text-amber-700">
            <li className="flex gap-2">
              <span className="font-bold">1.</span> 
              <span>Naviga sulla mappa fino a trovare il marker desiderato</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span> 
              <span>Clicca sul marker per selezionarlo</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span> 
              <span>Se visualizzi il marker ma non riesci a selezionarlo a causa delle restrizioni di sicurezza:</span>
            </li>
            <ul className="pl-8 mt-1 space-y-2">
              <li className="text-sm">
                • Copia manualmente l'ID del marker dall'URL (parametro <span className="font-mono bg-amber-100 px-1 rounded">msid=</span> seguito da un codice)
              </li>
              <li className="text-sm">
                • Oppure usa i pulsanti "Inserisci ID" o "Incolla URL" che appaiono sotto la mappa
              </li>
            </ul>
            <li className="flex gap-2">
              <span className="font-bold">4.</span> 
              <span>Clicca su "Conferma selezione" per utilizzare questo marker</span>
            </li>
          </ol>
          <p className="mt-3 text-amber-700 bg-amber-100 p-2 rounded">
            <strong>Nota:</strong> A causa delle restrizioni di sicurezza di Google Maps, potrebbe essere necessario selezionare manualmente l'ID del marker dall'URL o utilizzare i pulsanti di aiuto forniti.
          </p>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onHideInstructions}
          className="text-amber-700 hover:text-amber-900 hover:bg-amber-100"
        >
          Nascondi istruzioni
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default InstructionsPanel;
