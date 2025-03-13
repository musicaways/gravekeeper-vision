
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  BasicInfoSection,
  NumericInfoSection,
  TextAreaSection,
  LocationSection
} from "./form/sections";
import { blockFormSchema, BlockFormData } from "./types/blockFormTypes";
import { useBlockFormSubmit } from "./hooks/useBlockFormSubmit";

interface BlockInfoFormProps {
  block: any;
  onSave: () => void;
  onCancel: () => void;
}

const BlockInfoForm: React.FC<BlockInfoFormProps> = ({ block, onSave, onCancel }) => {
  const { toast } = useToast();
  const { submitBlockForm, isSubmitting } = useBlockFormSubmit({ 
    blockId: block.Id,
    onSuccess: onSave
  });
  
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
    const success = await submitBlockForm(data);
    if (success) {
      onSave();
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
            <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
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

export default BlockInfoForm;
