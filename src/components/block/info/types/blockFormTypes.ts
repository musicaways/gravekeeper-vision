
import { z } from "zod";

// Schema di validazione
export const blockFormSchema = z.object({
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

export type BlockFormData = z.infer<typeof blockFormSchema>;
