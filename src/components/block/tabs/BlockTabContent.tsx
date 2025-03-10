
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
    <div className="w-full">
      <TabsContent value="info" className="w-full">
        <BlockInfoTabContent block={block} />
      </TabsContent>
      
      <TabsContent value="loculi" className="w-full">
        <BlockLoculiTabContent blockId={blockId.toString()} searchTerm={searchTerm} />
      </TabsContent>
      
      <TabsContent value="map" className="w-full">
        {/* Map tab content */}
      </TabsContent>
      
      <TabsContent value="documents" className="w-full">
        <BlockDocumentiTabContent blockId={blockId.toString()} />
      </TabsContent>
    </div>
  );
}
