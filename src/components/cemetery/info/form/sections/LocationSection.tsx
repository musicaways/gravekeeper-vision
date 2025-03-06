
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Map } from "lucide-react";
import { Control } from "react-hook-form";

interface LocationSectionProps {
  control: Control<any>;
  isGettingLocation: boolean;
  getGPSCoordinates: () => void;
}

const LocationSection = ({ 
  control,
  isGettingLocation,
  getGPSCoordinates
}: LocationSectionProps) => {
  const [showMapSelector, setShowMapSelector] = useState(false);
  
  // Function to get coordinates from manual map click
  const handleManualSelection = (lat: string, lng: string) => {
    // This would be filled in by the parent form to update lat/lng values
    console.log("Selected coordinates:", lat, lng);
    setShowMapSelector(false);
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="Indirizzo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Indirizzo</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>
              L'indirizzo viene utilizzato per posizionare il cimitero sulla mappa
            </FormDescription>
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-2">
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Città</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CAP</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <FormField
          control={control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provincia/Stato</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paese</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <FormField
          control={control}
          name="Latitudine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitudine</FormLabel>
              <FormControl>
                <div className="flex">
                  <Input {...field} placeholder="Es. 41.9028" />
                </div>
              </FormControl>
              <FormDescription>
                Più preciso dell'indirizzo per posizionare il marker sulla mappa
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="Longitudine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitudine</FormLabel>
              <div className="flex space-x-2">
                <Input {...field} placeholder="Es. 12.4964" className="flex-1" />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={getGPSCoordinates}
                  disabled={isGettingLocation}
                  title="Usa GPS"
                  className="h-10 w-10 flex-shrink-0"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowMapSelector(true)}
                  className="h-10 w-10 flex-shrink-0"
                  title="Seleziona sulla mappa"
                >
                  <Map className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="established_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data di fondazione</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="total_area_sqm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Area totale (m²)</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      {/* Map Selection Dialog */}
      <Dialog open={showMapSelector} onOpenChange={setShowMapSelector}>
        <DialogContent className="sm:max-w-[600px] h-[500px]">
          <DialogHeader>
            <DialogTitle>Seleziona posizione sulla mappa</DialogTitle>
            <DialogDescription>
              Fai clic sulla mappa per selezionare la posizione del cimitero
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 h-[350px] relative">
            <MapSelector
              onSelectLocation={(lat, lng) => {
                // Update form values using the form context
                control._formState.setValue('Latitudine', lat.toString());
                control._formState.setValue('Longitudine', lng.toString());
                setShowMapSelector(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Map selector component that allows clicking to set coordinates
const MapSelector = ({ onSelectLocation }: { onSelectLocation: (lat: number, lng: number) => void }) => {
  // This is a simplified version - in a real implementation, you would:
  // 1. Embed a Google Map with proper API
  // 2. Add click handler to get coordinates
  // 3. Show a marker at the selected position
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-muted/40 rounded-md">
      <p className="text-center text-sm text-muted-foreground mb-4">
        Per implementare questa funzionalità è necessario utilizzare Google Maps JavaScript API.
        <br />
        Selezionando un punto sulla mappa verranno aggiornate le coordinate.
      </p>
      <Button
        onClick={() => {
          // Example coordinates for Rome, Italy
          onSelectLocation(41.9028, 12.4964);
        }}
      >
        Seleziona esempio (Roma)
      </Button>
    </div>
  );
};

export default LocationSection;
