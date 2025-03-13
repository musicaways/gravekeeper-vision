
import { TabsContent } from "@/components/ui/tabs";
import BlockInfoTabContent from "./content/BlockInfoTabContent";
import BlockLoculiTabContent from "./content/BlockLoculiTabContent";
import BlockDocumentiTabContent from "./content/BlockDocumentiTabContent";
import BlockPhotosTabContent from "./content/BlockPhotosTabContent";
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
      
      <TabsContent value="photos" className="w-full max-w-none">
        <BlockPhotosTabContent blockId={blockId.toString()} />
      </TabsContent>
      
      <TabsContent value="files" className="w-full max-w-none">
        <BlockDocumentiTabContent blockId={blockId.toString()} />
      </TabsContent>
    </>
  );
}
