
import React from "react";
import { Card } from "@/components/ui/card";
import { LoculiList } from "../../loculi/LoculiList";
import { useLoculi } from "@/hooks/useLoculi";
import { LoculiLoading } from "../../loculi/LoculiLoading";
import { LoculiError } from "../../loculi/LoculiError";
import { LoculiEmptyState } from "../../loculi/LoculiEmptyState";

interface BlockLoculiTabContentProps {
  blockId: string;
  searchTerm?: string;
}

const BlockLoculiTabContent: React.FC<BlockLoculiTabContentProps> = ({ blockId, searchTerm = "" }) => {
  const { loculi, loading, error } = useLoculi({ blockId, searchTerm });

  return (
    <Card className="shadow-sm overflow-hidden">
      {loading && <LoculiLoading />}
      
      {!loading && error && <LoculiError error={error} />}
      
      {!loading && !error && loculi.length === 0 && <LoculiEmptyState />}
      
      {!loading && !error && loculi.length > 0 && <LoculiList loculi={loculi} />}
    </Card>
  );
};

export default BlockLoculiTabContent;
