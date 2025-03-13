
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { MapPin, Map } from "lucide-react";
import MapSelectorDialog from "../map-selector/MapSelectorDialog";
import { useFormContext } from "react-hook-form";

interface LocationSectionProps {
  control: Control<any>;
  isGettingLocation?: boolean;
  getGPSCoordinates?: () => void;
  onOpenMapSelector?: () => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({ 
  control,
  isGettingLocation = false,
  getGPSCoordinates = () => {},
  onOpenMapSelector
}) => {
  const [showMapSelector, setShowMapSelector] = useState(false);
  const form = useFormContext();
  
  // Get current lat/lng values from the form to pass to the map selector
  const getInitialCoordinates = () => {
    const latValue = form.getValues('Latitudine');
    const lngValue = form.getValues('Longitudine');
    
    return {
      lat: latValue ? parseFloat(latValue) : undefined,
      lng: lngValue ? parseFloat(lngValue) : undefined
    };
  };
  
  const handleMapLocationSelect = (lat: number, lng: number) => {
    form.setValue('Latitudine', lat.toString(), { shouldValidate: true });
    form.setValue('Longitudine', lng.toString(), { shouldValidate: true });
    setShowMapSelector(false);
  };
  
  // Get initial coordinates for the map
  const { lat: initialLat, lng: initialLng } = getInitialCoordinates();
  
  const handleOpenMapSelector = onOpenMapSelector || (() => setShowMapSelector(true));
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Posizione</h3>
      
      <FormField
        control={control}
        name="Indirizzo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Indirizzo</FormLabel>
            <FormControl>
              <Input placeholder="Indirizzo del blocco" {...field} />
            </FormControl>
            <FormDescription>
              L'indirizzo viene utilizzato per posizionare il blocco sulla mappa
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <FormMessage />
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
                  onClick={handleOpenMapSelector}
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
        name="DataCreazione"
        render={({ field: { value, onChange, ...rest } }) => (
          <FormItem>
            <FormLabel>Data di costruzione</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                value={value || ''} 
                onChange={onChange}
                {...rest} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {!onOpenMapSelector && (
        <MapSelectorDialog 
          isOpen={showMapSelector} 
          onOpenChange={setShowMapSelector}
          onSelectLocation={handleMapLocationSelect}
          initialLat={initialLat}
          initialLng={initialLng}
        />
      )}
    </div>
  );
};

export default LocationSection;
