
import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HelpCircle, Map } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Control, useWatch } from "react-hook-form";
import CustomMapMarkerDialog from "./CustomMapMarkerDialog";
import { toast } from "sonner";

interface MarkerIdFieldProps {
  control: Control<any>;
}

const MarkerIdField = ({ control }: MarkerIdFieldProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customMapId, setCustomMapId] = useState<string>("");
  
  // Utilizza useWatch per ottenere le coordinate del cimitero dal form
  const latitude = useWatch({
    control,
    name: "Latitudine",
  });
  
  const longitude = useWatch({
    control,
    name: "Longitudine",
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

  return (
    <FormField
      control={control}
      name="custom_map_marker_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-1">
            ID marker sulla mappa personalizzata
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-80 p-3">
                  <p>Inserisci l'ID del marker nella mappa personalizzata o selezionalo direttamente dalla mappa.</p>
                  <p className="mt-1">Come trovare l'ID del marker:</p>
                  <ol className="list-decimal pl-4 mt-1 space-y-1 text-xs">
                    <li>Apri la mappa in Google My Maps</li>
                    <li>Fai clic sul marker che vuoi associare</li>
                    <li>Nella finestra popup, fai clic sull'icona di condivisione</li>
                    <li>Copia l'URL e cerca il parametro 'msid=' seguito da un ID numerico</li>
                  </ol>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <div className="flex gap-2">
            <FormControl>
              <Input {...field} placeholder="Es. 1Kd5EpcPnLnGAcBfZJl1u3cMyRplZqoWI" />
            </FormControl>
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
              className="shrink-0"
            >
              <Map className="h-4 w-4 mr-2" />
              Seleziona
            </Button>
          </div>
          <FormDescription>
            Associa questo cimitero a un marker esistente nella mappa personalizzata
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
