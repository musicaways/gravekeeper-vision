
import React, { useState } from "react";
import { NicheInfo } from "@/types";
import { NicheMapCanvas } from "./NicheMapCanvas";
import { NicheDetailPanel } from "./NicheDetailPanel";

export interface NicheMapProps {
  blockId: string;
  rows: number; // Vertical rows (top to bottom)
  columns: number; // Horizontal columns (right to left)
  niches: NicheInfo[];
  onNicheClick?: (nicheId: string) => void;
}

export const NicheMap: React.FC<NicheMapProps> = ({
  blockId,
  rows,
  columns,
  niches,
  onNicheClick,
}) => {
  const [selectedNiche, setSelectedNiche] = useState<NicheInfo | null>(null);

  const handleNicheClick = (nicheId: string) => {
    const niche = niches.find(n => n.id === nicheId);
    if (niche) {
      setSelectedNiche(niche);
    }
    
    if (onNicheClick) {
      onNicheClick(nicheId);
    }
  };

  const handleCloseDetail = () => {
    setSelectedNiche(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className={`${selectedNiche ? 'w-full md:w-2/3' : 'w-full'}`}>
        <NicheMapCanvas
          rows={rows}
          columns={columns}
          niches={niches}
          onNicheClick={handleNicheClick}
        />
      </div>
      
      {selectedNiche && (
        <div className="w-full md:w-1/3">
          <NicheDetailPanel 
            niche={selectedNiche} 
            onClose={handleCloseDetail}
            onEdit={() => console.log("Edit niche", selectedNiche.id)}
            onReserve={() => console.log("Reserve niche", selectedNiche.id)}
            onAssign={() => console.log("Assign niche", selectedNiche.id)}
            onRelease={() => console.log("Release niche", selectedNiche.id)}
          />
        </div>
      )}
    </div>
  );
};
