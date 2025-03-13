
import React from "react";
import BlockDocuments from "../../documents/BlockDocuments";

interface BlockDocumentiTabContentProps {
  blockId: string;
}

const BlockDocumentiTabContent: React.FC<BlockDocumentiTabContentProps> = ({ blockId }) => {
  return (
    <div className="px-1 w-full">
      <BlockDocuments blockId={blockId} />
    </div>
  );
};

export default BlockDocumentiTabContent;
