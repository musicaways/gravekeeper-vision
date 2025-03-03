
import React from "react";
import CemeteryDocuments from "../../CemeteryDocuments";

interface CemeteryDocumentsTabContentProps {
  cemeteryId: string;
}

const CemeteryDocumentsTabContent: React.FC<CemeteryDocumentsTabContentProps> = ({ cemeteryId }) => {
  return <CemeteryDocuments cemeteryId={cemeteryId} />;
};

export default CemeteryDocumentsTabContent;
