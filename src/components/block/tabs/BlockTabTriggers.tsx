
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Info, List, Map } from "lucide-react";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface BlockTabTriggersProps {
  defaultTab?: string;
}

export function BlockTabTriggers({ defaultTab = "loculi" }: BlockTabTriggersProps) {
  return (
    <div className="relative w-full overflow-hidden px-1">
      <ScrollArea className="w-full scrollbar-hide" orientation="horizontal">
        <TabsList className="w-full flex justify-start p-1">
          <TabsTrigger 
            value="info" 
            className="flex items-center gap-1.5 px-4 py-2"
          >
            <Info className="h-4 w-4" />
            <span>Info</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="loculi" 
            className="flex items-center gap-1.5 px-4 py-2"
          >
            <List className="h-4 w-4" />
            <span>Loculi</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="map" 
            className="flex items-center gap-1.5 px-4 py-2"
          >
            <Map className="h-4 w-4" />
            <span>Mappa</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="documents" 
            className="flex items-center gap-1.5 px-4 py-2"
          >
            <FileText className="h-4 w-4" />
            <span>Documenti</span>
          </TabsTrigger>
        </TabsList>
      </ScrollArea>
    </div>
  );
}
