
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCemeteryOptions } from "./useCemeteryOptions";
import MobileCemeteryOptions from "./MobileCemeteryOptions";
import DesktopCemeteryOptions from "./DesktopCemeteryOptions";
import { CemeteryOptionsProps } from "./types";

const CemeteryOptions: React.FC<CemeteryOptionsProps> = ({
  onSelectCemetery,
  selectedValue,
}) => {
  const { cemeteries, loading } = useCemeteryOptions();
  const isMobile = useIsMobile();

  const selectedLabel = selectedValue 
    ? cemeteries.find(cemetery => cemetery.value === selectedValue)?.label || selectedValue
    : "Seleziona cimitero";

  if (isMobile) {
    return (
      <MobileCemeteryOptions
        loading={loading}
        cemeteries={cemeteries}
        selectedValue={selectedValue}
        selectedLabel={selectedLabel}
        onSelectCemetery={onSelectCemetery}
      />
    );
  }

  return (
    <DesktopCemeteryOptions
      loading={loading}
      cemeteries={cemeteries}
      selectedValue={selectedValue}
      onSelectCemetery={onSelectCemetery}
    />
  );
};

export default CemeteryOptions;
