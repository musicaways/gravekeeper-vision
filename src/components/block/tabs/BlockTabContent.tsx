
import { Tabs, TabsContent } from "@/components/ui/tabs";
import BlockInfoTabContent from "./content/BlockInfoTabContent";
import BlockLoculiTabContent from "./content/BlockLoculiTabContent";
import BlockDocumentiTabContent from "./content/BlockDocumentiTabContent";
import { LoculiMigrationTab } from "../loculi/LoculiMigrationTab";
import React from "react";

export interface BlockTabContentProps {
  blockId: number;
}

export function BlockTabContent({ blockId }: BlockTabContentProps) {
  return (
    <div className="w-full">
      <TabsContent value="info" className="w-full">
        <BlockInfoTabContent blockId={blockId} />
      </TabsContent>
      
      <TabsContent value="loculi" className="w-full">
        <BlockLoculiTabContent blockId={blockId} />
      </TabsContent>
      
      <TabsContent value="map" className="w-full">
        {/* Map tab content */}
      </TabsContent>
      
      <TabsContent value="documents" className="w-full">
        <BlockDocumentiTabContent blockId={blockId} />
      </TabsContent>
      
      <TabsContent value="migration" className="w-full">
        <LoculiMigrationTab blockId={blockId} />
      </TabsContent>
    </div>
  );
}
