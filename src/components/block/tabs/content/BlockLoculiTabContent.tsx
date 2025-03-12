
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="px-4 py-4 w-full">
      <Card className="w-full shadow-sm">
        <CardContent className="px-4 md:px-6 py-4 md:py-6">
          {loading && <LoculiLoading />}
          
          {!loading && error && <LoculiError error={error} />}
          
          {!loading && !error && loculi.length === 0 && <LoculiEmptyState />}
          
          {!loading && !error && loculi.length > 0 && <LoculiList loculi={loculi} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockLoculiTabContent;
