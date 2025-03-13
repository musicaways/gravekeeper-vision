
import React from "react";
import { CemeterySectionsTab } from "../../CemeterySectionsTab";

interface CemeterySectionsTabContentProps {
  cemeteryId: string;
  searchTerm?: string;
}

const CemeterySectionsTabContent: React.FC<CemeterySectionsTabContentProps> = ({ 
  cemeteryId, 
  searchTerm 
}) => {
  return (
    <div className="px-[1.2px] py-4 w-full">
      <CemeterySectionsTab cemeteryId={cemeteryId} searchTerm={searchTerm} />
    </div>
  );
};

export default CemeterySectionsTabContent;
