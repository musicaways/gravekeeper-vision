
import React from "react";
import CemeteryInfoCard from "../../CemeteryInfoCard";

interface CemeteryInfoTabContentProps {
  cemetery: any;
}

const CemeteryInfoTabContent: React.FC<CemeteryInfoTabContentProps> = ({ cemetery }) => {
  return <CemeteryInfoCard cemetery={cemetery} />;
};

export default CemeteryInfoTabContent;
