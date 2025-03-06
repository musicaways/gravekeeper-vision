
import React from "react";
import BlockDetailsCard from "@/components/block/info/BlockDetailsCard";
import BlockMapDisplay from "@/components/block/map/BlockMapDisplay";

interface BlockInfoTabContentProps {
  block: any;
}

const BlockInfoTabContent: React.FC<BlockInfoTabContentProps> = ({ block }) => {
  return (
    <div className="space-y-6">
      <BlockDetailsCard block={block} />
      <BlockMapDisplay block={block} />
    </div>
  );
};

export default BlockInfoTabContent;
