
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { decodeText } from "@/utils/textFormatters";

// Validazione dati del form tramite Zod
const blockFormSchema = z.object({
  Nome: z.string().optional(),
  Codice: z.string().optional(),
  Descrizione: z.string().optional(),
  Note: z.string().optional(),
  Indirizzo: z.string().optional(),
  Latitudine: z.string().transform((val) => val === "" ? null : parseFloat(val)).nullable().optional(),
  Longitudine: z.string().transform((val) => val === "" ? null : parseFloat(val)).nullable().optional(),
  NumeroLoculi: z.string().transform((val) => val === "" ? null : parseInt(val, 10)).nullable().optional(),
  NumeroFile: z.string().transform((val) => val === "" ? null : parseInt(val, 10)).nullable().optional(),
  DataCreazione: z.string().optional(),
});

type BlockFormValues = z.infer<typeof blockFormSchema>;

interface BlockInfoEditFormProps {
  block: any;
  onSave: (data: BlockFormValues) => void;
  onCancel: () => void;
}

const BlockInfoEditForm: React.FC<BlockInfoEditFormProps> = ({ block, onSave, onCancel }) => {
  // Inizializzazione del form con i dati attuali
  const form = useForm<BlockFormValues>({
    resolver: zodResolver(blockFormSchema),
    defaultValues: {
      Nome: decodeText(block.Nome) || "",
      Codice: decodeText(block.Codice) || "",
      Descrizione: decodeText(block.Descrizione) || "",
      Note: decodeText(block.Note) || "",
      Indirizzo: decodeText(block.Indirizzo) || "",
      Latitudine: block.Latitudine ? String(block.Latitudine) : "",
      Longitudine: block.Longitudine ? String(block.Longitudine) : "",
      NumeroLoculi: block.NumeroLoculi !== undefined ? String(block.NumeroLoculi) : "",
      NumeroFile: block.NumeroFile !== undefined ? String(block.NumeroFile) : "",
      DataCreazione: block.DataCreazione || "",
    }
  });

  function onSubmit(data: BlockFormValues) {
    console.log("Form data submitted:", data);
    onSave(data);
  }

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Modifica informazioni blocco</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Informazioni di base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="Nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome del blocco" {...field} />
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
                      <Input placeholder="Codice del blocco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Numeri */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="NumeroLoculi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numero Loculi</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Descrizione */}
            <FormField
              control={form.control}
              name="Descrizione"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrizione</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Inserisci una descrizione del blocco"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Note */}
            <FormField
              control={form.control}
              name="Note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Inserisci eventuali note"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Indirizzo */}
            <FormField
              control={form.control}
              name="Indirizzo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indirizzo</FormLabel>
                  <FormControl>
                    <Input placeholder="Indirizzo del blocco" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Data di costruzione */}
            <FormField
              control={form.control}
              name="DataCreazione"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data di costruzione</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Coordinate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="Latitudine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitudine</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="es. 41.902782" {...field} />
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
                      <Input type="text" placeholder="es. 12.496366" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annulla
            </Button>
            <Button type="submit">Salva modifiche</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default BlockInfoEditForm;
