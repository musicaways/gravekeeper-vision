
import React from "react";
import CemeteryGallery from "../../CemeteryGallery";

interface CemeteryGalleryTabContentProps {
  cemeteryId: string;
}

const CemeteryGalleryTabContent: React.FC<CemeteryGalleryTabContentProps> = ({ cemeteryId }) => {
  return <CemeteryGallery cemeteryId={cemeteryId} />;
};

export default CemeteryGalleryTabContent;
