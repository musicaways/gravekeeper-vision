// Utility functions for loculi data

import { LoculoType } from "@/components/block/loculi/types";

export function formatLoculoRecord(loculo: LoculoType) {
  return {
    id: loculo.id, // Changed from loculo.Id
    numero: loculo.Numero,
    fila: loculo.Fila,
    bloccoId: loculo.IdBlocco,
    concesso: loculo.Concesso || false,
    // Additional formatting can be done here
  };
}

// Additional utility functions can be added here
