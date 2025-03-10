
import React from "react";

interface BlockDocumentiTabContentProps {
  blockId: string;
}

const BlockDocumentiTabContent: React.FC<BlockDocumentiTabContentProps> = ({ blockId }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-medium mb-4">Documenti del blocco</h2>
      <p className="text-muted-foreground">Nessun documento disponibile per questo blocco.</p>
    </div>
  );
};

export default BlockDocumentiTabContent;
