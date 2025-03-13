
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import BlockTextSection from "./BlockTextSection";
import BlockLocationInfo from "./BlockLocationInfo";
import BlockServicesInfo from "./BlockServicesInfo";
import BlockMapSection from "./BlockMapSection";
import BlockEditButton from "./BlockEditButton";

interface BlockInfoDisplayProps {
  block: any;
  onEditClick: () => void;
}

const BlockInfoDisplay: React.FC<BlockInfoDisplayProps> = ({ block, onEditClick }) => {
  const { user } = useAuth();
  const canEdit = !!user;

  return (
    <div className="w-full relative mx-auto">
      <div className="space-y-4">
        <BlockTextSection title="Descrizione" content={block.Descrizione} />
        <BlockTextSection title="Note" content={block.Note} />
        
        <BlockLocationInfo block={block} />
        
        <BlockServicesInfo block={block} />
        
        <BlockMapSection block={block} />
      </div>
      
      {canEdit && <BlockEditButton onClick={onEditClick} />}
    </div>
  );
};

export default BlockInfoDisplay;
