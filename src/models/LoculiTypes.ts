
import { Loculo } from "@/components/block/loculi/types";

export interface UseLoculiProps {
  blockId: string;
  searchTerm?: string;
}

export interface UseLoculiResult {
  loculi: Loculo[];
  loading: boolean;
  error: string | null;
}

export interface LoculiDataFetchResult {
  data: Loculo[];
  error: string | null;
}
