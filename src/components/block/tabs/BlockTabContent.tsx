
import { TabsContent } from "@/components/ui/tabs";
import BlockInfoTabContent from "./content/BlockInfoTabContent";
import BlockLoculiTabContent from "./content/BlockLoculiTabContent";
import BlockDocumentiTabContent from "./content/BlockDocumentiTabContent";
import React from "react";

export interface BlockTabContentProps {
  blockId: number;
  block?: any;
  searchTerm?: string;
}

export function BlockTabContent({ blockId, block, searchTerm = "" }: BlockTabContentProps) {
  return (
    <>
      <TabsContent value="info" className="w-full max-w-none">
        <BlockInfoTabContent block={block} />
      </TabsContent>
      
      <TabsContent value="loculi" className="w-full max-w-none">
        <BlockLoculiTabContent blockId={blockId.toString()} searchTerm={searchTerm} />
      </TabsContent>
      
      <TabsContent value="map" className="w-full max-w-none">
        {/* Map tab content */}
      </TabsContent>
      
      <TabsContent value="documents" className="w-full max-w-none">
        <BlockDocumentiTabContent blockId={blockId.toString()} />
      </TabsContent>
    </>
  );
}
