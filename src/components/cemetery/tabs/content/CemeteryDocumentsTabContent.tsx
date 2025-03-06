
import React from "react";
import CemeteryDocuments from "../../CemeteryDocuments";

interface CemeteryDocumentsTabContentProps {
  cemeteryId: string;
}

const CemeteryDocumentsTabContent: React.FC<CemeteryDocumentsTabContentProps> = ({ cemeteryId }) => {
  return (
    <div className="px-1 w-full">
      <CemeteryDocuments cemeteryId={cemeteryId} />
    </div>
  );
};

export default CemeteryDocumentsTabContent;
