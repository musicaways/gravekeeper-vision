
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface ContactSectionProps {
  control: Control<any>;
}

const ContactSection = ({ control }: ContactSectionProps) => (
  <div className="space-y-4">
    <FormField
      control={control}
      name="contact_info.phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Telefono</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
        </FormItem>
      )}
    />

    <FormField
      control={control}
      name="contact_info.email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" {...field} />
          </FormControl>
        </FormItem>
      )}
    />

    <FormField
      control={control}
      name="contact_info.website"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sito Web</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  </div>
);

export default ContactSection;
