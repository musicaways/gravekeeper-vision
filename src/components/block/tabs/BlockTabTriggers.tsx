
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatabaseIcon, FileText, Info, List, Map } from "lucide-react";
import React from "react";

export interface BlockTabTriggersProps {
  defaultTab?: string;
}

export function BlockTabTriggers({ defaultTab = "loculi" }: BlockTabTriggersProps) {
  return (
    <TabsList className="border-b overflow-x-auto scrollbar-none w-full flex">
      <TabsTrigger 
        value="info" 
        className="flex items-center px-4 py-2 data-[state=active]:text-primary"
      >
        <Info className="h-4 w-4 mr-2" />
        <span>Info</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="loculi" 
        className="flex items-center px-4 py-2 data-[state=active]:text-primary"
      >
        <List className="h-4 w-4 mr-2" />
        <span>Loculi</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="map" 
        className="flex items-center px-4 py-2 data-[state=active]:text-primary"
      >
        <Map className="h-4 w-4 mr-2" />
        <span>Mappa</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="documents" 
        className="flex items-center px-4 py-2 data-[state=active]:text-primary"
      >
        <FileText className="h-4 w-4 mr-2" />
        <span>Documenti</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="migration" 
        className="flex items-center px-4 py-2 data-[state=active]:text-primary"
      >
        <DatabaseIcon className="h-4 w-4 mr-2" />
        <span>Migrazione</span>
      </TabsTrigger>
    </TabsList>
  );
}
