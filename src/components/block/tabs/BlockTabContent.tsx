
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import BlockInfoTabContent from "./content/BlockInfoTabContent";
import BlockLoculiTabContent from "./content/BlockLoculiTabContent";
import BlockMapTabContent from "./content/BlockMapTabContent";
import BlockDocumentiTabContent from "./content/BlockDocumentiTabContent";
import BlockFotoTabContent from "./content/BlockFotoTabContent";

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
      <TabsContent value="info" className="space-y-6 w-full">
        <BlockInfoTabContent block={block} />
      </TabsContent>

      <TabsContent value="loculi" className="space-y-6 w-full">
        <BlockLoculiTabContent blockId={blockId} searchTerm={searchTerm} />
      </TabsContent>
      
      <TabsContent value="documenti" className="space-y-6 w-full">
        <BlockDocumentiTabContent blockId={blockId} />
      </TabsContent>
      
      <TabsContent value="foto" className="space-y-6 w-full">
        <BlockFotoTabContent blockId={blockId} />
      </TabsContent>

      <TabsContent value="map" className="space-y-6 w-full">
        <BlockMapTabContent block={block} />
      </TabsContent>
    </>
  );
};

export default BlockTabContent;
