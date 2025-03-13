
import React, { useState } from "react";
import { Map, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import BlockMapDisplay from "@/components/block/map/BlockMapDisplay";
import { Button } from "@/components/ui/button";

interface BlockMapSectionProps {
  block: any;
}

const BlockMapSection: React.FC<BlockMapSectionProps> = ({ block }) => {
  const [showMap, setShowMap] = useState(true);
  
  const hasCoordinates = block.Latitudine && block.Longitudine;
  
  if (!hasCoordinates) return null;
  
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${block.Latitudine},${block.Longitudine}&t=k`;
    window.open(url, '_blank');
  };
  
  return (
    <div className="w-full mt-6">
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
        <div className="mt-3 flex justify-start">
          <Button
            variant="outline"
            size="sm"
            onClick={openInGoogleMaps}
            className="flex items-center gap-1 text-xs"
          >
            <ExternalLink className="h-4 w-4" />
            Apri in Google Maps
          </Button>
        </div>
      )}
      
      <Separator className="mt-6" />
    </div>
  );
};

export default BlockMapSection;
