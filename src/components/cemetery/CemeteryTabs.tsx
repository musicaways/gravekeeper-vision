
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
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  
  // Salva la tab attiva nel localStorage per mantenerla tra le navigazioni
  useEffect(() => {
    const savedTab = localStorage.getItem(`cemetery-${id}-tab`);
    // Verifica che la tab salvata sia una di quelle disponibili
    const availableTabs = ["info", "sections", "map", "documents", "gallery"];
    if (savedTab && availableTabs.includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, [id]);
  
  // Gestisce lo scroll per mostrare/nascondere la barra delle tab
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY;
      
      // Se stiamo scorrendo verso il basso e abbiamo superato una certa soglia, nascondi la barra
      if (currentScrollTop > lastScrollTop && currentScrollTop > 150) {
        setIsVisible(false);
      } 
      // Se stiamo scorrendo verso l'alto, mostra la barra
      else if (currentScrollTop < lastScrollTop) {
        setIsVisible(true);
      }
      
      setLastScrollTop(currentScrollTop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem(`cemetery-${id}-tab`, value);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div 
        className={`sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b pb-1 pt-2 w-full max-w-none transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <CemeteryTabTriggers />
      </div>
      <div className="bg-card rounded-md border shadow-sm mt-4 mb-6 w-full max-w-none">
        <CemeteryTabContent cemetery={cemetery} cemeteryId={cemeteryId} />
      </div>
    </Tabs>
  );
};
