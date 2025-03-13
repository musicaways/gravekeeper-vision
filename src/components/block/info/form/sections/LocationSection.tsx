
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { MapPin, Map } from "lucide-react";

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
  onOpenMapSelector = () => {}
}) => {
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
                  onClick={onOpenMapSelector}
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
    </div>
  );
};

export default LocationSection;
