
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Map } from "lucide-react";
import { Control, useFormContext } from "react-hook-form";

interface CoordinateFieldsProps {
  control: Control<any>;
  isGettingLocation: boolean;
  getGPSCoordinates: () => void;
  onOpenMapSelector: () => void;
}

const CoordinateFields = ({ 
  control, 
  isGettingLocation, 
  getGPSCoordinates,
  onOpenMapSelector
}: CoordinateFieldsProps) => {
  const form = useFormContext();
  
  return (
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
  );
};

export default CoordinateFields;
