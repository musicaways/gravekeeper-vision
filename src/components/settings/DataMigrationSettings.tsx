
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoculiMigration } from "../block/loculi/LoculiMigration";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";

export function DataMigrationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Migrazione Dati</h3>
        <p className="text-sm text-muted-foreground">
          Gestisci la migrazione dei dati da tabelle temporanee alle tabelle principali
        </p>
      </div>
      
      <Separator />
      
      <div className="space-y-8">
        <div>
          <h4 className="text-base font-medium mb-2">Migrazione Loculi</h4>
          
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-md p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">
                  Risoluzione errore importazione CSV
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Se stai ricevendo un errore di colonne incompatibili durante l'importazione del CSV, 
                  assicurati che i nomi delle colonne nel file CSV corrispondano esattamente ai nomi delle 
                  colonne nella tabella <code>loculi_import</code>. Le colonne necessarie sono:
                </p>
                <ul className="text-sm text-amber-700 mt-1 list-disc list-inside">
                  <li>id</li>
                  <li>numero</li>
                  <li>fila</li>
                  <li>annotazioni</li>
                  <li>idblocco</li>
                  <li>tipotomba</li>
                  <li>alias</li>
                  <li>filadaalto</li>
                  <li>numeropostiresti</li>
                  <li>numeroposti</li>
                  <li>superficie</li>
                  <li>concesso</li>
                </ul>
              </div>
            </div>
          </div>
          
          <LoculiMigration blockId={0} />
        </div>
      </div>
    </div>
  );
}
