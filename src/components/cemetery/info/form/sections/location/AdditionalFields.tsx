
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface AdditionalFieldsProps {
  control: Control<any>;
}

const AdditionalFields = ({ control }: AdditionalFieldsProps) => {
  return (
    <>
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
    </>
  );
};

export default AdditionalFields;
