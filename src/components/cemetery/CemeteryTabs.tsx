
import { Tabs } from "@/components/ui/tabs";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CemeteryTabTriggers from "./tabs/CemeteryTabTriggers";
import CemeteryTabContent from "./tabs/CemeteryTabContent";

export interface CemeteryTabsProps {
  cemetery: any;
  cemeteryId: string;
}

export const CemeteryTabs: React.FC<CemeteryTabsProps> = ({ cemetery, cemeteryId }) => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("info");
  
  // Salva la tab attiva nel localStorage per mantenerla tra le navigazioni
  useEffect(() => {
    const savedTab = localStorage.getItem(`cemetery-${id}-tab`);
    // Verifica che la tab salvata sia una di quelle disponibili
    const availableTabs = ["info", "sections", "map", "documents", "gallery"];
    if (savedTab && availableTabs.includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, [id]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem(`cemetery-${id}-tab`, value);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <CemeteryTabTriggers />
      <div className="bg-card rounded-md border shadow-sm mt-1">
        <CemeteryTabContent cemetery={cemetery} cemeteryId={cemeteryId} />
      </div>
    </Tabs>
  );
};
