import { Tabs } from "@/components/ui/tabs";
import { DatabaseIcon, FileText, Info, ListView, Map } from "lucide-react";
import React from "react";

export interface BlockTabTriggersProps {
  defaultTab?: string;
}

export function BlockTabTriggers({ defaultTab = "loculi" }: BlockTabTriggersProps) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <div className="border-b overflow-x-auto scrollbar-none">
        <div className="flex">
          <Tabs.Trigger 
            value="info" 
            className="flex items-center px-4 py-2 data-[state=active]:text-primary"
          >
            <Info className="h-4 w-4 mr-2" />
            <span>Info</span>
          </Tabs.Trigger>
          
          <Tabs.Trigger 
            value="loculi" 
            className="flex items-center px-4 py-2 data-[state=active]:text-primary"
          >
            <ListView className="h-4 w-4 mr-2" />
            <span>Loculi</span>
          </Tabs.Trigger>
          
          <Tabs.Trigger 
            value="map" 
            className="flex items-center px-4 py-2 data-[state=active]:text-primary"
          >
            <Map className="h-4 w-4 mr-2" />
            <span>Mappa</span>
          </Tabs.Trigger>
          
          <Tabs.Trigger 
            value="documents" 
            className="flex items-center px-4 py-2 data-[state=active]:text-primary"
          >
            <FileText className="h-4 w-4 mr-2" />
            <span>Documenti</span>
          </Tabs.Trigger>
          
          <Tabs.Trigger 
            value="migration" 
            className="flex items-center px-4 py-2 data-[state=active]:text-primary"
          >
            <DatabaseIcon className="h-4 w-4 mr-2" />
            <span>Migrazione</span>
          </Tabs.Trigger>
        </div>
      </div>
    </Tabs>
  );
}
