
import { DeceasedRecord } from "../../types/deceased";

export interface UseDeceasedDataProps {
  searchTerm: string;
  sortBy: string;
  filterBy: string;
  selectedCemetery: string | null;
  page?: number;
  pageSize?: number;
}

export interface UseDeceasedDataResult {
  loading: boolean;
  filteredDeceased: DeceasedRecord[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
