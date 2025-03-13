
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  BasicInfoSection,
  NumericInfoSection,
  TextAreaSection,
  LocationSection
} from "./form/sections";

// Schema di validazione
const blockFormSchema = z.object({
  Nome: z.string().min(1, "Il nome è obbligatorio"),
  Codice: z.string().optional(),
  Descrizione: z.string().optional(),
  Note: z.string().optional(),
  Indirizzo: z.string().optional(),
  NumeroLoculi: z.string().transform(val => val === "" ? null : parseInt(val, 10)).nullable().optional(),
  NumeroFile: z.string().transform(val => val === "" ? null : parseInt(val, 10)).nullable().optional(),
  Latitudine: z.string().transform(val => val === "" ? null : parseFloat(val)).nullable().optional(),
  Longitudine: z.string().transform(val => val === "" ? null : parseFloat(val)).nullable().optional(),
  DataCreazione: z.string().optional(),
});

type BlockFormData = z.infer<typeof blockFormSchema>;

interface BlockInfoFormProps {
  block: any;
  onSave: () => void;
  onCancel: () => void;
}

const BlockInfoForm: React.FC<BlockInfoFormProps> = ({ block, onSave, onCancel }) => {
  const { toast } = useToast();
  
  // Inizializzazione del form
  const form = useForm<BlockFormData>({
    resolver: zodResolver(blockFormSchema),
    defaultValues: {
      Nome: block.Nome || "",
      Codice: block.Codice || "",
      Descrizione: block.Descrizione || "",
      Note: block.Note || "",
      Indirizzo: block.Indirizzo || "",
      NumeroLoculi: block.NumeroLoculi ? String(block.NumeroLoculi) : "",
      NumeroFile: block.NumeroFile ? String(block.NumeroFile) : "",
      Latitudine: block.Latitudine ? String(block.Latitudine) : "",
      Longitudine: block.Longitudine ? String(block.Longitudine) : "",
      DataCreazione: block.DataCreazione || "",
    }
  });

  const onSubmit = async (data: BlockFormData) => {
    try {
      console.log("Form data:", data);

      const { error } = await supabase
        .from('Blocco')
        .update(data)
        .eq('Id', block.Id);

      if (error) {
        throw error;
      }

      toast({
        title: "Modifiche salvate",
        description: "Le informazioni del blocco sono state aggiornate con successo",
      });

      onSave();
    } catch (error: any) {
      console.error("Error updating block:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: `Non è stato possibile salvare le modifiche: ${error.message || 'Errore sconosciuto'}`,
      });
    }
  };

  return (
    <Card className="shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="p-4 md:p-6 space-y-4">
            {/* Informazioni di base */}
            <BasicInfoSection control={form.control} />
            
            {/* Sezioni di testo */}
            <TextAreaSection 
              control={form.control}
              name="Descrizione"
              label="Descrizione"
              placeholder="Inserisci una descrizione del blocco"
            />
            
            <TextAreaSection 
              control={form.control}
              name="Note"
              label="Note"
              placeholder="Inserisci eventuali note"
            />
            
            {/* Informazioni numeriche */}
            <NumericInfoSection control={form.control} />
            
            {/* Posizione */}
            <LocationSection control={form.control} />
          </CardContent>

          <CardFooter className="bg-muted/50 px-4 md:px-6 py-4 flex justify-between">
            <Button variant="outline" type="button" onClick={onCancel}>
              Annulla
            </Button>
            <Button type="submit">Salva modifiche</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default BlockInfoForm;
