
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import BlockInfoTabContent from "./content/BlockInfoTabContent";
import BlockLoculiTabContent from "./content/BlockLoculiTabContent";
import BlockDocumentiTabContent from "./content/BlockDocumentiTabContent";

interface BlockTabContentProps {
  block: any;
  blockId: string;
  searchTerm?: string;
}

const BlockTabContent: React.FC<BlockTabContentProps> = ({ 
  block, 
  blockId, 
  searchTerm = "" 
}) => {
  return (
    <>
      <TabsContent value="info" className="space-y-6 w-full p-4">
        <BlockInfoTabContent block={block} />
      </TabsContent>

      <TabsContent value="loculi" className="space-y-6 w-full p-4">
        <BlockLoculiTabContent blockId={blockId} searchTerm={searchTerm} />
      </TabsContent>
      
      <TabsContent value="documenti" className="space-y-6 w-full p-4">
        <BlockDocumentiTabContent blockId={blockId} />
      </TabsContent>
    </>
  );
};

export default BlockTabContent;
