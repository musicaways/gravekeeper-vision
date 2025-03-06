
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Control } from "react-hook-form";

interface FacilitiesSectionProps {
  control: Control<any>;
}

const facilityLabels = {
  ricevimento_salme: 'Ricevimento salme',
  chiesa: 'Chiesa',
  camera_mortuaria: 'Camera mortuaria',
  cavalletti: 'Cavalletti',
  impalcatura: 'Impalcatura'
};

type FacilityKey = keyof typeof facilityLabels;

const FacilitiesSection = ({ control }: FacilitiesSectionProps) => (
  <div className="space-y-3">
    <h3 className="text-lg font-medium">Strutture e servizi</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {(Object.keys(facilityLabels) as FacilityKey[]).map((facility) => (
        <FormField
          key={facility}
          control={control}
          name={facility as any}
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </FormControl>
              <FormLabel className="text-sm font-normal">
                {facilityLabels[facility]}
              </FormLabel>
            </FormItem>
          )}
        />
      ))}
    </div>
  </div>
);

export default FacilitiesSection;
