
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Control } from "react-hook-form";

// Description Section
export const DescriptionSection = ({ control }: { control: Control<any> }) => (
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

// Location Section
export const LocationSection = ({ 
  control,
  isGettingLocation,
  getGPSCoordinates
}: { 
  control: Control<any>;
  isGettingLocation: boolean;
  getGPSCoordinates: () => void;
}) => (
  <div className="space-y-4">
    <FormField
      control={control}
      name="Indirizzo"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Indirizzo</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
        </FormItem>
      )}
    />

    <div className="grid grid-cols-2 gap-2">
      <FormField
        control={control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Città</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="postal_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CAP</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>

    <div className="grid grid-cols-2 gap-2">
      <FormField
        control={control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Provincia/Stato</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Paese</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>

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
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    <FormField
      control={control}
      name="custom_map_marker_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-1">
            ID marker sulla mappa personalizzata
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-80 p-3">
                  <p>Inserisci l'ID del marker nella mappa personalizzata di Google My Maps.</p>
                  <p className="mt-1">Come trovare l'ID del marker:</p>
                  <ol className="list-decimal pl-4 mt-1 space-y-1 text-xs">
                    <li>Apri la mappa in Google My Maps</li>
                    <li>Fai clic sul marker che vuoi associare</li>
                    <li>Nella finestra popup, fai clic sull'icona di condivisione</li>
                    <li>Copia l'URL e cerca il parametro 'msid=' seguito da un ID numerico</li>
                  </ol>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormControl>
            <Input {...field} placeholder="Es. 1Kd5EpcPnLnGAcBfZJl1u3cMyRplZqoWI" />
          </FormControl>
          <FormDescription>
            Associa questo cimitero a un marker esistente nella mappa personalizzata
          </FormDescription>
        </FormItem>
      )}
    />

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
  </div>
);

// Contact Section
export const ContactSection = ({ control }: { control: Control<any> }) => (
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

// Facilities Section
export const FacilitiesSection = ({ control }: { control: Control<any> }) => (
  <div className="space-y-3">
    <h3 className="text-lg font-medium">Strutture e servizi</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {['ricevimento_salme', 'chiesa', 'camera_mortuaria', 'cavalletti', 'impalcatura'].map((facility) => (
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
                {facility === 'ricevimento_salme' && 'Ricevimento salme'}
                {facility === 'chiesa' && 'Chiesa'}
                {facility === 'camera_mortuaria' && 'Camera mortuaria'}
                {facility === 'cavalletti' && 'Cavalletti'}
                {facility === 'impalcatura' && 'Impalcatura'}
              </FormLabel>
            </FormItem>
          )}
        />
      ))}
    </div>
  </div>
);
