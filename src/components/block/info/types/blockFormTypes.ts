
import { z } from "zod";

// Schema di validazione
export const blockFormSchema = z.object({
  Nome: z.string().min(1, "Il nome è obbligatorio"),
  Codice: z.string().optional(),
  Descrizione: z.string().optional(),
  Note: z.string().optional(),
  Indirizzo: z.string().optional(),
  NumeroLoculi: z.string()
    .optional()
    .transform(val => {
      if (!val || val === "") return null;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? null : parsed;
    }),
  NumeroFile: z.string()
    .optional()
    .transform(val => {
      if (!val || val === "") return null;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? null : parsed;
    }),
  Latitudine: z.string()
    .optional()
    .transform(val => {
      if (!val || val === "") return null;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? null : parsed;
    }),
  Longitudine: z.string()
    .optional()
    .transform(val => {
      if (!val || val === "") return null;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? null : parsed;
    }),
  DataCreazione: z.string().optional(),
});

export type BlockFormData = z.infer<typeof blockFormSchema>;
