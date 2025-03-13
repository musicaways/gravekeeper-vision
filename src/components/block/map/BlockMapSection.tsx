
import React, { useState } from "react";
import { Map } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import BlockMapDisplay from "./BlockMapDisplay";
import { Button } from "@/components/ui/button";

interface BlockMapSectionProps {
  block: any;
}

const BlockMapSection: React.FC<BlockMapSectionProps> = ({ block }) => {
  const [showMap, setShowMap] = useState(true);
  
  const hasCoordinates = block.Latitudine && block.Longitudine;
  
  if (!hasCoordinates) return null;
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Map className="h-5 w-5 text-primary mr-2.5" />
          <h3 className="text-base font-medium text-foreground">Mappa del blocco</h3>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowMap(!showMap)}
          className="h-8 text-xs"
        >
          {showMap ? 'Nascondi mappa' : 'Mostra mappa'}
        </Button>
      </div>
      
      {showMap && <BlockMapDisplay block={block} />}
      
      {showMap && (
        <div className="mt-3 flex justify-center">
          <a 
            href={`https://www.google.com/maps?q=${block.Latitudine},${block.Longitudine}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:text-primary-dark transition-colors text-sm"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-1.5 h-4 w-4"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
            Apri in Google Maps
          </a>
        </div>
      )}
      
      <Separator className="mt-4 mb-4" />
    </div>
  );
};

export default BlockMapSection;
