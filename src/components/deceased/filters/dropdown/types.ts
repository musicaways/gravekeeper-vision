
export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterDropdownProps {
  filterBy: string;
  selectedCemetery: string | null;
  onFilterChange: (filterType: string) => void;
  onCemeterySelect: (value: string | null) => void;
}
