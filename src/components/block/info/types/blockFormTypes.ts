
import { z } from "zod";

// Schema di validazione
export const blockFormSchema = z.object({
  Nome: z.string().min(1, "Il nome è obbligatorio"),
  Codice: z.string().optional(),
  Descrizione: z.string().optional(),
  Note: z.string().optional(),
  Indirizzo: z.string().optional(),
  // Use consistent string typing for numeric fields in the form
  NumeroLoculi: z.string().optional().nullable().transform(val => 
    val === "" || val === null || val === undefined ? null : Number(val)
  ),
  NumeroFile: z.string().optional().nullable().transform(val => 
    val === "" || val === null || val === undefined ? null : Number(val)
  ),
  Latitudine: z.string().optional().nullable().transform(val => 
    val === "" || val === null || val === undefined ? null : Number(val)
  ),
  Longitudine: z.string().optional().nullable().transform(val => 
    val === "" || val === null || val === undefined ? null : Number(val)
  ),
  DataCreazione: z.string().optional(),
  FotoCopertina: z.string().optional().nullable(),
  coverImage: z.any().optional().nullable() // Per gestire il file di upload dell'immagine
});

export type BlockFormData = z.infer<typeof blockFormSchema>;
