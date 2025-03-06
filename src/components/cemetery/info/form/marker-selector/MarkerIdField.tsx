
import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HelpCircle, Map } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Control, useWatch } from "react-hook-form";
import CustomMapMarkerDialog from "./CustomMapMarkerDialog";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface MarkerIdFieldProps {
  control: Control<any>;
}

const MarkerIdField = ({ control }: MarkerIdFieldProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customMapId, setCustomMapId] = useState<string>("");
  const isMobile = useIsMobile();
  
  // Utilizza useWatch per ottenere le coordinate del cimitero dal form
  const latitude = useWatch({
    control,
    name: "Latitudine",
  });
  
  const longitude = useWatch({
    control,
    name: "Longitudine",
  });

  // Recupera anche l'ID del marker per controllare se è valido
  const markerId = useWatch({
    control,
    name: "custom_map_marker_id",
  });
  
  // Recupera l'ID della mappa personalizzata dalla configurazione o dal localStorage
  useEffect(() => {
    // Prima controlla se c'è un ID nel localStorage (impostato in precedenza)
    const storedMapId = localStorage.getItem("customMapId");
    
    if (storedMapId) {
      setCustomMapId(storedMapId);
    } else {
      // Altrimenti usa un ID predefinito
      const defaultMapId = "1dzlxUTK3bz-7kChq1HASlXEpn6t5uQ8";
      setCustomMapId(defaultMapId);
      localStorage.setItem("customMapId", defaultMapId);
    }
  }, []);

  // Funzione per verificare l'ID del marker
  const verifyMarker = () => {
    if (!markerId) {
      toast.error("Nessun ID marker da verificare");
      return;
    }
    
    // Apre una nuova finestra con il marker selezionato
    const url = `https://www.google.com/maps/d/viewer?mid=${customMapId}&msid=${markerId}&z=18`;
    window.open(url, '_blank');
    toast.info("Verifica che il marker si evidenzi correttamente nella mappa appena aperta");
  };

  return (
    <FormField
      control={control}
      name="custom_map_marker_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-1">
            ID marker sulla mappa
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-80 p-3">
                  <p>Inserisci l'ID del marker nella mappa personalizzata o selezionalo direttamente.</p>
                  <p className="mt-1">Come trovare l'ID del marker:</p>
                  <ol className="list-decimal pl-4 mt-1 space-y-1 text-xs">
                    <li>Apri la mappa in Google My Maps</li>
                    <li>Fai clic sul marker che vuoi associare</li>
                    <li>Cerca il parametro 'msid=' nell'URL seguito da un ID</li>
                  </ol>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <div className={isMobile ? "flex flex-col gap-2" : "flex gap-2"}>
            <FormControl>
              <Input {...field} placeholder="ID del marker dalla mappa personalizzata" />
            </FormControl>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  if (!customMapId) {
                    toast.error("Configurazione mappa personalizzata mancante");
                    return;
                  }
                  setDialogOpen(true);
                }}
                title="Seleziona dalla mappa"
                className={isMobile ? "flex-1 text-xs h-8 py-0" : "shrink-0"}
              >
                <Map className="h-4 w-4 mr-2" />
                Seleziona
              </Button>
              
              {field.value && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={verifyMarker}
                  title="Verifica marker"
                  className={isMobile ? "flex-1 text-xs h-8 py-0" : "shrink-0"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  Verifica
                </Button>
              )}
            </div>
          </div>
          <FormDescription>
            Questo ID verrà utilizzato per evidenziare un marker specifico nella mappa personalizzata.
            Dopo aver salvato, nella visualizzazione "Mappa personalizzata" nella scheda Info, il marker sarà visibile.
          </FormDescription>
          <FormMessage />

          <CustomMapMarkerDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onSelect={(markerId) => {
              field.onChange(markerId);
              toast.success("ID marker impostato con successo");
            }}
            customMapId={customMapId}
            initialMarkerId={field.value}
            cemeteryCoordinates={{
              latitude: latitude || null,
              longitude: longitude || null
            }}
          />
        </FormItem>
      )}
    />
  );
};

export default MarkerIdField;
