
import { useLoculiData } from "./useLoculiData";
import { useDefuntiForLoculi } from "./useDefuntiForLoculi";
import { useLoculiWithDefunti } from "./useLoculiWithDefunti";
import { Loculo } from "@/components/block/loculi/types";

interface UseLoculiProps {
  blockId: string;
  searchTerm?: string;
}

interface UseLoculiResult {
  loculi: Loculo[];
  loading: boolean;
  error: string | null;
}

/**
 * Main hook for managing loculi and their associated defunti
 */
export function useLoculi({ blockId, searchTerm = "" }: UseLoculiProps): UseLoculiResult {
  // Fetch basic loculi data
  const { loculi: baseLoculi, loading: loculiLoading, error: loculiError, loculiIds } = useLoculiData({ 
    blockId, 
    searchTerm 
  });
  
  // Fetch defunti data for the loculi
  const { defunti, loading: defuntiLoading, error: defuntiError } = useDefuntiForLoculi({
    loculiIds,
    skip: loculiLoading || !!loculiError || loculiIds.length === 0
  });
  
  // Combine loculi with their defunti
  const loculiWithDefunti = useLoculiWithDefunti({
    loculi: baseLoculi,
    defunti
  });
  
  // Derive overall loading and error states
  const loading = loculiLoading || defuntiLoading;
  const error = loculiError || defuntiError;
  
  return {
    loculi: loculiWithDefunti,
    loading,
    error
  };
}
