
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { decodeText } from "@/utils/textFormatters";
import { 
  BasicInfoSection,
  NumericInfoSection,
  TextAreaSection,
  LocationSection
} from "./form/sections";

// Validazione dati del form tramite Zod - fixed to handle string inputs that will be converted to numbers
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
  // Inizializzazione del form con i dati attuali - fixed to use strings for all inputs
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
      NumeroLoculi: block.NumeroLoculi ? String(block.NumeroLoculi) : "",
      NumeroFile: block.NumeroFile ? String(block.NumeroFile) : "",
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
            <BasicInfoSection control={form.control} />
            
            {/* Numeri */}
            <NumericInfoSection control={form.control} />
            
            {/* Descrizione */}
            <TextAreaSection 
              control={form.control}
              name="Descrizione"
              label="Descrizione"
              placeholder="Inserisci una descrizione del blocco"
            />
            
            {/* Note */}
            <TextAreaSection 
              control={form.control}
              name="Note"
              label="Note"
              placeholder="Inserisci eventuali note"
            />
            
            {/* Indirizzo e coordinate */}
            <LocationSection control={form.control} />
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
