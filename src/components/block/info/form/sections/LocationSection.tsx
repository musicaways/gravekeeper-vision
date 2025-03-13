
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface LocationSectionProps {
  control: Control<any>;
}

const LocationSection: React.FC<LocationSectionProps> = ({ control }) => {
  return (
    <>
      <FormField
        control={control}
        name="Indirizzo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Indirizzo</FormLabel>
            <FormControl>
              <Input placeholder="Indirizzo del blocco" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormField
          control={control}
          name="Latitudine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitudine</FormLabel>
              <FormControl>
                <Input type="text" placeholder="es. 41.902782" {...field} />
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
              <FormControl>
                <Input type="text" placeholder="es. 12.496366" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="DataCreazione"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Data di costruzione</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default LocationSection;
