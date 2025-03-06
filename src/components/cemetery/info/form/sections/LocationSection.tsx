
import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Map } from "lucide-react";
import { Control } from "react-hook-form";
import MapSelector from "./map-selector/MapSelector";

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
        <DialogContent className="sm:max-w-[650px] h-[600px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Seleziona posizione sulla mappa</DialogTitle>
            <DialogDescription>
              Fai clic sulla mappa per selezionare la posizione del cimitero
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 h-[450px] relative">
            <MapSelector
              onSelectLocation={(lat, lng) => {
                // Use setValue function from react-hook-form's Control
                control.setValue('Latitudine', lat.toString());
                control.setValue('Longitudine', lng.toString());
                setShowMapSelector(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationSection;
