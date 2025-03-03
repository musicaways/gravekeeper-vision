
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
  return <CemeterySectionsTab cemeteryId={cemeteryId} searchTerm={searchTerm} />;
};

export default CemeterySectionsTabContent;
