
import { z } from "zod";

// Schema di validazione
export const blockFormSchema = z.object({
  Nome: z.string().min(1, "Il nome è obbligatorio"),
  Codice: z.string().optional(),
  Descrizione: z.string().optional(),
  Note: z.string().optional(),
  Indirizzo: z.string().optional(),
  NumeroLoculi: z.coerce.number().nullable().optional(),
  NumeroFile: z.coerce.number().nullable().optional(),
  Latitudine: z.coerce.number().nullable().optional(),
  Longitudine: z.coerce.number().nullable().optional(),
  DataCreazione: z.string().optional(),
});

export type BlockFormData = z.infer<typeof blockFormSchema>;
