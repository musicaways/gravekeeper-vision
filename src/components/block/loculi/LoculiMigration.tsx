
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { migrateLoculiData, migrateDefuntiReferences, IdMapping } from "@/utils/loculiMigrationUtils";
import { checkLoculiMigrationStatus, getTableMetadata } from "@/utils/loculiDebugUtils";
import { toast } from "sonner";
import { AlertCircle, ArrowRightLeft, Check, Loader2, Bug } from "lucide-react";

interface LoculiMigrationProps {
  blockId?: number;
}

export function LoculiMigration({ blockId }: LoculiMigrationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [idMappings, setIdMappings] = useState<IdMapping[]>([]);
  const [debugLoading, setDebugLoading] = useState(false);

  const handleMigration = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setMigrationComplete(false);
    
    try {
      // Esegui la migrazione dei loculi
      const mappings = await migrateLoculiData();
      setIdMappings(mappings);
      
      if (mappings.length > 0) {
        // Aggiorna i riferimenti dei defunti
        await migrateDefuntiReferences(mappings);
        setMigrationComplete(true);
        toast.success(`Migrazione completata: ${mappings.length} loculi migrati`);
      } else {
        toast.info("Nessun dato da migrare o migrazione non riuscita");
      }
    } catch (error) {
      console.error("Errore durante il processo di migrazione:", error);
      toast.error("Si è verificato un errore durante la migrazione");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDebug = async () => {
    if (debugLoading) return;
    
    setDebugLoading(true);
    
    try {
      // Verifica lo stato della migrazione
      await checkLoculiMigrationStatus(blockId);
      
      // Verifica i metadati delle tabelle
      await getTableMetadata('loculi');
      await getTableMetadata('defunti');
      
      toast.success("Diagnostica completata. Controlla la console per i dettagli.");
    } catch (error) {
      console.error("Errore durante la diagnostica:", error);
      toast.error("Errore durante la diagnostica");
    } finally {
      setDebugLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Migrazione Dati Loculi</CardTitle>
        <CardDescription>
          Trasferisci i dati dalla tabella temporanea loculi_import alla tabella loculi principale,
          generando UUID per ciascuna riga.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span>
              Questa operazione migrerà tutti i loculi dalla tabella temporanea alla tabella principale
              e aggiornerà i riferimenti dei defunti associati. Assicurati di aver importato tutti i dati
              necessari prima di procedere.
            </span>
          </div>
          
          {migrationComplete && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <p className="text-sm font-medium text-green-900">
                  Migrazione completata con successo!
                </p>
              </div>
              <p className="text-sm text-green-700 mt-1">
                {idMappings.length} loculi sono stati trasferiti alla tabella principale.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        <Button 
          onClick={handleMigration} 
          disabled={isLoading || migrationComplete}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrazione in corso...
            </>
          ) : migrationComplete ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Migrazione completata
            </>
          ) : (
            <>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Avvia migrazione
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleDebug} 
          disabled={debugLoading}
          variant="outline"
          className="w-full"
        >
          {debugLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Diagnostica in corso...
            </>
          ) : (
            <>
              <Bug className="mr-2 h-4 w-4" />
              Verifica stato migrazione
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
