
import { Tabs } from "@/components/ui/tabs";
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { BlockTabTriggers } from "./tabs/BlockTabTriggers";
import { BlockTabContent } from "./tabs/BlockTabContent";

export interface BlockTabsProps {
  block: any;
  blockId: string;
  searchTerm?: string;
  activeTab?: string | null;
  onSearch?: (term: string) => void;
}

export const BlockTabs: React.FC<BlockTabsProps> = ({ 
  block, 
  blockId, 
  searchTerm = "",
  activeTab: externalActiveTab = null,
  onSearch
}) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("info");
  
  // Use external tab if provided, otherwise load from localStorage
  useEffect(() => {
    if (externalActiveTab) {
      setActiveTab(externalActiveTab);
      // Scroll to top when tab is set externally
      window.scrollTo(0, 0);
    } else {
      const savedTab = localStorage.getItem(`block-${id}-tab`);
      // Verify that the tab saved is one of those available
      const availableTabs = ["info", "loculi", "documenti", "map", "migration"];
      if (savedTab && availableTabs.includes(savedTab)) {
        setActiveTab(savedTab);
      }
      // Scroll to top when component mounts with initial tab
      window.scrollTo(0, 0);
    }
  }, [id, externalActiveTab]);
  
  // Se c'è un termine di ricerca, attiva il tab loculi
  useEffect(() => {
    if (searchTerm) {
      setActiveTab("loculi");
    }
  }, [searchTerm]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem(`block-${id}-tab`, value);
    // Scroll to top when changing tabs
    window.scrollTo(0, 0);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="sticky z-10 bg-background/95 backdrop-blur-sm pb-1 pt-2 w-full max-w-none">
        <BlockTabTriggers />
      </div>
      <div className="bg-background rounded-md mb-6 w-full max-w-none">
        <BlockTabContent 
          block={block} 
          blockId={parseInt(blockId)} 
          searchTerm={searchTerm} 
        />
      </div>
    </Tabs>
  );
}
