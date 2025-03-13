
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { blockFormSchema, BlockFormData } from "./types/blockFormTypes";
import { useBlockFormSubmit } from "./hooks/useBlockFormSubmit";

interface BlockInfoEditFormProps {
  block: any;
  onSave: (data: BlockFormData) => void;
  onCancel: () => void;
}

const BlockInfoEditForm: React.FC<BlockInfoEditFormProps> = ({ block, onSave, onCancel }) => {
  const { submitBlockForm, isSubmitting } = useBlockFormSubmit({ 
    blockId: block.Id,
    onSuccess: () => {} // We'll handle success in the onSubmit function
  });

  // Inizializzazione del form con i valori convertiti correttamente
  const form = useForm<BlockFormData>({
    resolver: zodResolver(blockFormSchema),
    defaultValues: {
      Nome: decodeText(block.Nome) || "",
      Codice: decodeText(block.Codice) || "",
      Descrizione: decodeText(block.Descrizione) || "",
      Note: decodeText(block.Note) || "",
      Indirizzo: decodeText(block.Indirizzo) || "",
      Latitudine: block.Latitudine || null,
      Longitudine: block.Longitudine || null,
      NumeroLoculi: block.NumeroLoculi || null,
      NumeroFile: block.NumeroFile || null,
      DataCreazione: block.DataCreazione || "",
    }
  });

  async function onSubmit(data: BlockFormData) {
    console.log("Form data submitted:", data);
    const success = await submitBlockForm(data);
    if (success) {
      onSave(data);
    }
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
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Annulla
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvataggio..." : "Salva modifiche"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default BlockInfoEditForm;
