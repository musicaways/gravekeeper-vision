
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import BlockInfoCard from "@/components/block/info/BlockInfoCard";

interface BlockInfoTabContentProps {
  block: any;
}

const BlockInfoTabContent: React.FC<BlockInfoTabContentProps> = ({ block }) => {
  return (
    <div className="w-full px-1">
      <Card className="w-full shadow-sm relative mx-auto">
        <CardContent className="p-5 pt-5">
          <BlockInfoCard block={block} />
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockInfoTabContent;
