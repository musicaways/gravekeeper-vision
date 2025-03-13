
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { decodeText } from "@/utils/textFormatters";
import { blockFormSchema, BlockFormData } from "../../types/blockFormTypes";

export const useBlockFormInitialization = (block: any) => {
  // Initialize form with properly converted values
  return useForm<BlockFormData>({
    resolver: zodResolver(blockFormSchema),
    defaultValues: {
      Nome: decodeText(block.Nome) || "",
      Codice: decodeText(block.Codice) || "",
      Descrizione: decodeText(block.Descrizione) || "",
      Note: decodeText(block.Note) || "",
      Indirizzo: decodeText(block.Indirizzo) || "",
      NumeroLoculi: block.NumeroLoculi !== null ? String(block.NumeroLoculi) : "",
      NumeroFile: block.NumeroFile !== null ? String(block.NumeroFile) : "",
      Latitudine: block.Latitudine !== null ? String(block.Latitudine) : "",
      Longitudine: block.Longitudine !== null ? String(block.Longitudine) : "",
      DataCreazione: block.DataCreazione || "",
      coverImage: null
    }
  });
};
