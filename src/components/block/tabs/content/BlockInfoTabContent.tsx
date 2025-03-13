
import React from "react";
import BlockInfoCard from "@/components/block/info/BlockInfoCard";

interface BlockInfoTabContentProps {
  block: any;
}

const BlockInfoTabContent: React.FC<BlockInfoTabContentProps> = ({ block }) => {
  return (
    <div className="w-full px-1">
      <BlockInfoCard block={block} />
    </div>
  );
};

export default BlockInfoTabContent;
