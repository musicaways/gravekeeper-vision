
import React from "react";
import CemeteryInfoCard from "../../CemeteryInfoCard";

interface CemeteryInfoTabContentProps {
  cemetery: any;
}

const CemeteryInfoTabContent: React.FC<CemeteryInfoTabContentProps> = ({ cemetery }) => {
  return (
    <div className="px-1 w-full">
      <CemeteryInfoCard cemetery={cemetery} />
    </div>
  );
};

export default CemeteryInfoTabContent;
