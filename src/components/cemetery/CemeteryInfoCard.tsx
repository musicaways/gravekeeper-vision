
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Phone, Mail, Globe, Map, Check, X, Edit, Save } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CemeteryInfoCardProps {
  cemetery: any;
}

const CemeteryInfoCard = ({ cemetery }: CemeteryInfoCardProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
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
  
  // Helper function to render boolean fields with Yes/No icons
  const renderBooleanField = (label: string, value: boolean | null | undefined) => {
    if (value === null || value === undefined) return null;
    
    return (
      <div className="flex items-start gap-3">
        {value ? 
          <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" /> : 
          <X className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
        }
        <div>
          <h4 className="font-medium">{label}</h4>
          <p className="text-sm md:text-base">{value ? 'Sì' : 'No'}</p>
        </div>
      </div>
    );
  };

  // Check if any additional facilities exist to determine column layout
  const hasFacilities = cemetery.ricevimento_salme !== null || 
                      cemetery.chiesa !== null || 
                      cemetery.camera_mortuaria !== null || 
                      cemetery.cavalletti !== null || 
                      cemetery.impalcatura !== null;

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async (data: any) => {
    try {
      // Format the data for Supabase update
      const updateData = {
        Descrizione: data.Descrizione,
        Note: data.Note,
        Indirizzo: data.Indirizzo,
        city: data.city,
        postal_code: data.postal_code,
        state: data.state,
        country: data.country,
        established_date: data.established_date,
        total_area_sqm: data.total_area_sqm ? parseFloat(data.total_area_sqm) : null,
        contact_info: {
          phone: data.contact_info.phone,
          email: data.contact_info.email,
          website: data.contact_info.website
        },
        ricevimento_salme: data.ricevimento_salme,
        chiesa: data.chiesa,
        camera_mortuaria: data.camera_mortuaria,
        cavalletti: data.cavalletti,
        impalcatura: data.impalcatura
      };

      // Update the cemetery in Supabase
      const { error } = await supabase
        .from('Cimitero')
        .update(updateData)
        .eq('Id', cemetery.Id);

      if (error) throw error;

      toast({
        title: "Modifiche salvate",
        description: "Le informazioni del cimitero sono state aggiornate con successo.",
      });

      // Exit editing mode
      setIsEditing(false);
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Error updating cemetery:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Non è stato possibile salvare le modifiche. Riprova più tardi.",
      });
    }
  };

  // Only show edit button if user is logged in
  const canEdit = !!user;

  // Render edit form when in editing mode
  if (isEditing) {
    return (
      <Card className="w-full shadow-sm relative">
        <CardContent className="space-y-6 pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
              <FormField
                control={form.control}
                name="Descrizione"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrizione</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

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

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setIsEditing(false)}
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm relative">
      <CardContent className="space-y-6 pt-6">
        {cemetery.Descrizione && (
          <div>
            <h3 className="text-lg font-medium mb-2">Descrizione</h3>
            <p className="text-sm md:text-base">{cemetery.Descrizione}</p>
          </div>
        )}
        
        {cemetery.Note && (
          <div>
            <h3 className="text-lg font-medium mb-2">Note</h3>
            <p className="text-sm md:text-base">{cemetery.Note}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium">Indirizzo</h4>
                <p className="text-sm md:text-base">{cemetery.Indirizzo || "Non disponibile"}</p>
                <p className="text-sm md:text-base">{cemetery.city && cemetery.postal_code ? `${cemetery.city}, ${cemetery.postal_code}` : ""}</p>
                <p className="text-sm md:text-base">{cemetery.state && cemetery.country ? `${cemetery.state}, ${cemetery.country}` : ""}</p>
              </div>
            </div>

            {cemetery.established_date && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium">Data di fondazione</h4>
                  <p className="text-sm md:text-base">{formatDate(cemetery.established_date, "long")}</p>
                </div>
              </div>
            )}

            {cemetery.total_area_sqm && (
              <div className="flex items-start gap-3">
                <Map className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium">Area totale</h4>
                  <p className="text-sm md:text-base">{cemetery.total_area_sqm} m²</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {cemetery.contact_info && cemetery.contact_info.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium">Telefono</h4>
                  <p className="text-sm md:text-base">{cemetery.contact_info.phone}</p>
                </div>
              </div>
            )}

            {cemetery.contact_info && cemetery.contact_info.email && (
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-sm md:text-base break-words">{cemetery.contact_info.email}</p>
                </div>
              </div>
            )}

            {cemetery.contact_info && cemetery.contact_info.website && (
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium">Sito Web</h4>
                  <a href={cemetery.contact_info.website} target="_blank" rel="noopener noreferrer" 
                     className="text-sm md:text-base text-primary hover:underline break-words">
                    {cemetery.contact_info.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional facilities section - only shown if at least one facility is defined */}
        {hasFacilities && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Strutture e servizi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {renderBooleanField("Ricevimento salme", cemetery.ricevimento_salme)}
              {renderBooleanField("Chiesa", cemetery.chiesa)}
              {renderBooleanField("Camera mortuaria", cemetery.camera_mortuaria)}
              {renderBooleanField("Cavalletti", cemetery.cavalletti)}
              {renderBooleanField("Impalcatura", cemetery.impalcatura)}
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Floating edit button */}
      {canEdit && (
        <Button 
          onClick={handleEditToggle}
          size="icon"
          variant="secondary"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-md z-10 opacity-80 hover:opacity-100 transition-opacity"
        >
          <Edit className="h-5 w-5" />
        </Button>
      )}
    </Card>
  );
};

export default CemeteryInfoCard;
