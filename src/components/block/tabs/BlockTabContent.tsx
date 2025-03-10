
import { Tabs } from "@/components/ui/tabs";
import { BlockInfoTabContent } from "./content/BlockInfoTabContent";
import { BlockLoculiTabContent } from "./content/BlockLoculiTabContent";
import { BlockDocumentiTabContent } from "./content/BlockDocumentiTabContent";
import { LoculiMigrationTab } from "../loculi/LoculiMigrationTab";
import React from "react";

export interface BlockTabContentProps {
  blockId: number;
}

export function BlockTabContent({ blockId }: BlockTabContentProps) {
  return (
    <div className="w-full">
      <Tabs.Content value="info" className="w-full">
        <BlockInfoTabContent blockId={blockId} />
      </Tabs.Content>
      
      <Tabs.Content value="loculi" className="w-full">
        <BlockLoculiTabContent blockId={blockId} />
      </Tabs.Content>
      
      <Tabs.Content value="map" className="w-full">
        {/* Map tab content */}
      </Tabs.Content>
      
      <Tabs.Content value="documents" className="w-full">
        <BlockDocumentiTabContent blockId={blockId} />
      </Tabs.Content>
      
      <Tabs.Content value="migration" className="w-full">
        <LoculiMigrationTab blockId={blockId} />
      </Tabs.Content>
    </div>
  );
}
