
import { Tabs } from "@/components/ui/tabs";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CemeteryTabTriggers from "./tabs/CemeteryTabTriggers";
import CemeteryTabContent from "./tabs/CemeteryTabContent";

export interface CemeteryTabsProps {
  cemetery: any;
  cemeteryId: string;
  searchTerm?: string;
  activeTab?: string | null;
  onSearch?: (term: string) => void;
}

export const CemeteryTabs: React.FC<CemeteryTabsProps> = ({ 
  cemetery, 
  cemeteryId, 
  searchTerm = "",
  activeTab: externalActiveTab = null,
  onSearch
}) => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("sections");
  
  // Use external tab if provided, otherwise load from localStorage
  useEffect(() => {
    if (externalActiveTab) {
      setActiveTab(externalActiveTab);
    } else {
      const savedTab = localStorage.getItem(`cemetery-${id}-tab`);
      // Verify that the tab saved is one of those available
      const availableTabs = ["info", "sections", "photos", "documents"];
      if (savedTab && availableTabs.includes(savedTab)) {
        setActiveTab(savedTab);
      } else {
        // Default to sections tab if no valid saved tab
        setActiveTab("sections");
      }
    }
  }, [id, externalActiveTab]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem(`cemetery-${id}-tab`, value);
    // Scroll to top when changing tabs
    window.scrollTo(0, 0);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="sticky z-10 bg-background/95 backdrop-blur-sm pb-1 pt-2 w-full max-w-none">
        <CemeteryTabTriggers />
      </div>
      <div className="bg-background rounded-md mb-6 w-full max-w-none">
        <CemeteryTabContent 
          cemetery={cemetery} 
          cemeteryId={cemeteryId} 
          searchTerm={searchTerm} 
        />
      </div>
    </Tabs>
  );
};
