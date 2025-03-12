
export interface CemeteryOption {
  value: string;
  label: string;
}

export interface CemeteryOptionsProps {
  onSelectCemetery: (value: string | null) => void;
  selectedValue: string | null;
}
