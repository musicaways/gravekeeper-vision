
import React from "react";
import { useLoculi } from "@/hooks/loculi";
import { LoculiLoading } from "../../loculi/LoculiLoading";
import { LoculiError } from "../../loculi/LoculiError";
import { LoculiEmptyState } from "../../loculi/LoculiEmptyState";
import { LoculiList } from "../../loculi/LoculiList";

interface BlockLoculiTabContentProps {
  blockId: string;
  searchTerm?: string;
}

const BlockLoculiTabContent: React.FC<BlockLoculiTabContentProps> = ({ blockId, searchTerm = "" }) => {
  const { loculi, loading, error } = useLoculi({ blockId, searchTerm });

  return (
    <div className="w-full px-1 py-4">
      {loading && <LoculiLoading />}
      
      {!loading && error && <LoculiError error={error} />}
      
      {!loading && !error && loculi.length === 0 && <LoculiEmptyState />}
      
      {!loading && !error && loculi.length > 0 && <LoculiList loculi={loculi} />}
    </div>
  );
};

export default BlockLoculiTabContent;
