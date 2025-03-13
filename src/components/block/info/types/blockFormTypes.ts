
import { z } from "zod";

// Schema di validazione
export const blockFormSchema = z.object({
  Nome: z.string().min(1, "Il nome è obbligatorio"),
  Codice: z.string().optional(),
  Descrizione: z.string().optional(),
  Note: z.string().optional(),
  Indirizzo: z.string().optional(),
  NumeroLoculi: z.union([
    z.string(),
    z.number().nullable()
  ]).optional().transform(val => {
    if (val === "" || val === undefined) return null;
    if (typeof val === "number") return val;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? null : parsed;
  }),
  NumeroFile: z.union([
    z.string(),
    z.number().nullable()
  ]).optional().transform(val => {
    if (val === "" || val === undefined) return null;
    if (typeof val === "number") return val;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? null : parsed;
  }),
  Latitudine: z.union([
    z.string(),
    z.number().nullable()
  ]).optional().transform(val => {
    if (val === "" || val === undefined) return null;
    if (typeof val === "number") return val;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? null : parsed;
  }),
  Longitudine: z.union([
    z.string(),
    z.number().nullable()
  ]).optional().transform(val => {
    if (val === "" || val === undefined) return null;
    if (typeof val === "number") return val;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? null : parsed;
  }),
  DataCreazione: z.string().optional(),
});

export type BlockFormData = z.infer<typeof blockFormSchema>;
