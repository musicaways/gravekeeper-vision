
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 sm:p-0">
        <CemeterySectionsTab cemeteryId={cemeteryId} searchTerm={searchTerm} />
      </CardContent>
    </Card>
  );
};

export default CemeterySectionsTabContent;
