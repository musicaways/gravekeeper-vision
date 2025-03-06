
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";

interface DescriptionSectionProps {
  control: Control<any>;
}

const DescriptionSection = ({ control }: DescriptionSectionProps) => (
  <div className="w-full">
    <FormField
      control={control}
      name="Descrizione"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">Descrizione</FormLabel>
          <FormControl>
            <Textarea 
              {...field} 
              className="min-h-24 resize-vertical w-full"
            />
          </FormControl>
        </FormItem>
      )}
    />

    <div className="mt-4">
      <FormField
        control={control}
        name="Note"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Note</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="min-h-24 resize-vertical w-full"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  </div>
);

export default DescriptionSection;
