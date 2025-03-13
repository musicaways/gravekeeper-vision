
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Schema di validazione
const blockFormSchema = z.object({
  Nome: z.string().min(1, "Il nome è obbligatorio"),
  Codice: z.string().optional(),
  Descrizione: z.string().optional(),
  Note: z.string().optional(),
  Indirizzo: z.string().optional(),
  NumeroLoculi: z.number().optional(),
  NumeroFile: z.number().optional(),
  Latitudine: z.string().optional(),
  Longitudine: z.string().optional(),
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
      NumeroLoculi: block.NumeroLoculi || undefined,
      NumeroFile: block.NumeroFile || undefined,
      Latitudine: block.Latitudine ? block.Latitudine.toString() : "",
      Longitudine: block.Longitudine ? block.Longitudine.toString() : "",
    }
  });

  const onSubmit = async (data: BlockFormData) => {
    try {
      console.log("Form data:", data);

      // Conversione dei campi numerici
      const numericData = {
        ...data,
        NumeroLoculi: data.NumeroLoculi !== undefined ? Number(data.NumeroLoculi) : null,
        NumeroFile: data.NumeroFile !== undefined ? Number(data.NumeroFile) : null,
        Latitudine: data.Latitudine ? Number(data.Latitudine) : null,
        Longitudine: data.Longitudine ? Number(data.Longitudine) : null,
      };

      const { error } = await supabase
        .from('Blocco')
        .update(numericData)
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <FormField
                control={form.control}
                name="Nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Codice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codice</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="Descrizione"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrizione</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
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
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Indirizzo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indirizzo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <FormField
                control={form.control}
                name="NumeroLoculi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numero Loculi</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="NumeroFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numero File</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <FormField
                control={form.control}
                name="Latitudine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitudine</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Es. 41.9028" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Longitudine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitudine</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Es. 12.4964" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
