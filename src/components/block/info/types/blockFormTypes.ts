
import { z } from "zod";

// Schema di validazione
export const blockFormSchema = z.object({
  Nome: z.string().min(1, "Il nome è obbligatorio"),
  Codice: z.string().optional(),
  Descrizione: z.string().optional(),
  Note: z.string().optional(),
  Indirizzo: z.string().optional(),
  // Use consistent string typing for numeric fields in the form
  NumeroLoculi: z.string().optional(),
  NumeroFile: z.string().optional(),
  Latitudine: z.string().optional(),
  Longitudine: z.string().optional(),
  DataCreazione: z.string().optional().nullable(),
  FotoCopertina: z.string().optional().nullable(),
  coverImage: z.any().optional().nullable() // Per gestire il file di upload dell'immagine
});

export type BlockFormData = z.infer<typeof blockFormSchema>;
