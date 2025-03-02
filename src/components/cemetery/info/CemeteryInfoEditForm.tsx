
import { Card, CardContent } from "@/components/ui/card";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CemeteryInfoEditFormProps {
  cemetery: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

const CemeteryInfoEditForm = ({ cemetery, onSave, onCancel }: CemeteryInfoEditFormProps) => {
  // Create form with the current cemetery data
  const form = useForm({
    defaultValues: {
      Descrizione: cemetery.Descrizione || "",
      Note: cemetery.Note || "",
      Indirizzo: cemetery.Indirizzo || "",
      city: cemetery.city || "",
      postal_code: cemetery.postal_code || "",
      state: cemetery.state || "",
      country: cemetery.country || "",
      established_date: cemetery.established_date || "",
      total_area_sqm: cemetery.total_area_sqm || "",
      contact_info: {
        phone: cemetery.contact_info?.phone || "",
        email: cemetery.contact_info?.email || "",
        website: cemetery.contact_info?.website || ""
      },
      ricevimento_salme: cemetery.ricevimento_salme,
      chiesa: cemetery.chiesa,
      camera_mortuaria: cemetery.camera_mortuaria,
      cavalletti: cemetery.cavalletti,
      impalcatura: cemetery.impalcatura
    }
  });

  return (
    <Card className="w-full shadow-sm relative">
      <CardContent className="space-y-6 pt-6">
        <ScrollArea className="h-[calc(100vh-220px)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-6 pr-4">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="Descrizione"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrizione</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="min-h-24 bg-white dark:bg-slate-900 resize-vertical w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full">
                <FormField
                  control={form.control}
                  name="Note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="min-h-24 bg-white dark:bg-slate-900 resize-vertical w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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

                  <FormField
                    control={form.control}
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
                    control={form.control}
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

                <div className="space-y-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium">Strutture e servizi</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {['ricevimento_salme', 'chiesa', 'camera_mortuaria', 'cavalletti', 'impalcatura'].map((facility) => (
                    <FormField
                      key={facility}
                      control={form.control}
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

              <div className="flex justify-end space-x-2 py-4">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={onCancel}
                >
                  Annulla
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-1" />
                  Salva
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CemeteryInfoEditForm;
