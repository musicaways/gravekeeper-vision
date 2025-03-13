
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface NumericInfoSectionProps {
  control: Control<any>;
}

const NumericInfoSection: React.FC<NumericInfoSectionProps> = ({ control }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="NumeroLoculi"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numero Loculi</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                value={field.value === null || field.value === undefined ? "" : field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="NumeroFile"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numero File</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                value={field.value === null || field.value === undefined ? "" : field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default NumericInfoSection;
