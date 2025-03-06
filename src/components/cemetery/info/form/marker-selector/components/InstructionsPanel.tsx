
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

interface InstructionsPanelProps {
  showInstructions: boolean;
  onHideInstructions: () => void;
  isMobile?: boolean;
}

const InstructionsPanel = ({ showInstructions, onHideInstructions, isMobile = false }: InstructionsPanelProps) => {
  if (!showInstructions) {
    return (
      <div className="bg-amber-50/80 border-b border-amber-200 px-3 py-2 flex justify-between items-center">
        <div className="flex items-center text-amber-700 text-sm">
          <Info className="h-4 w-4 mr-1.5 text-amber-500" />
          <span>Istruzioni nascoste</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onHideInstructions()}
          className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 h-7 px-2"
        >
          <ChevronUp className="h-4 w-4 mr-1" />
          <span className="text-xs">Mostra</span>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-amber-50 border-b border-amber-200 p-3">
      <div className="flex items-start">
        <Info className="text-amber-500 h-4 w-4 mt-0.5 flex-shrink-0" />
        <div className="ml-2">
          <h3 className="font-medium text-amber-800 text-sm">Istruzioni per la selezione</h3>
          <ol className={`mt-1 space-y-1 text-amber-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            <li className="flex gap-1.5">
              <span className="font-bold">1.</span> 
              <span>Naviga sulla mappa fino a trovare il marker desiderato</span>
            </li>
            <li className="flex gap-1.5">
              <span className="font-bold">2.</span> 
              <span>Clicca sul marker per selezionarlo</span>
            </li>
            <li className="flex gap-1.5">
              <span className="font-bold">3.</span> 
              <span>Se visualizzi il marker ma non riesci a selezionarlo:</span>
            </li>
            <ul className="pl-5 mt-0.5 space-y-0.5">
              <li className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                • Copia l'ID del marker dall'URL o usa i pulsanti sottostanti
              </li>
            </ul>
          </ol>
          <p className={`mt-2 text-amber-700 bg-amber-100 p-1.5 rounded ${isMobile ? 'text-xs' : 'text-sm'}`}>
            <strong>Nota:</strong> A causa delle restrizioni di sicurezza di Google Maps, potrebbe essere necessario selezionare manualmente l'ID.
          </p>
        </div>
      </div>
      <div className="mt-1 flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onHideInstructions}
          className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 h-7 px-2"
        >
          <ChevronDown className="h-4 w-4 mr-1" />
          <span className="text-xs">Nascondi</span>
        </Button>
      </div>
    </div>
  );
};

export default InstructionsPanel;
