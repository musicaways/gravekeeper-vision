
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";

interface TextAreaSectionProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  rows?: number;
}

const TextAreaSection: React.FC<TextAreaSectionProps> = ({ 
  control, 
  name, 
  label, 
  placeholder, 
  rows = 4 
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              rows={rows}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextAreaSection;
