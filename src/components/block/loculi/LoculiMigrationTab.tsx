
import React from 'react';
import { LoculiMigration } from './LoculiMigration';

interface LoculiMigrationTabProps {
  blockId: number;
}

export function LoculiMigrationTab({ blockId }: LoculiMigrationTabProps) {
  return (
    <div className="space-y-6 p-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Migrazione Loculi</h2>
        <p className="text-slate-600 mb-6">
          Questo strumento ti permette di trasferire i dati dalla tabella temporanea <code>loculi_import</code> 
          alla tabella <code>loculi</code> principale, generando UUID per ciascuna riga e aggiornando
          i riferimenti dei defunti.
        </p>
        
        <LoculiMigration blockId={blockId} />
      </div>
    </div>
  );
}
