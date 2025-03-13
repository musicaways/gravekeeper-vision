
import React from "react";
import { Separator } from "@/components/ui/separator";
import { decodeText } from "@/utils/textFormatters";
import BlockTextSection from "./BlockTextSection";
import BlockLocationInfo from "./BlockLocationInfo";
import BlockServicesInfo from "./BlockServicesInfo";
import BlockEditButton from "./BlockEditButton";
import BlockMapSection from "./BlockMapSection";

interface BlockInfoDisplayProps {
  block: any;
  onEditClick: () => void;
  canEdit?: boolean;
}

const BlockInfoDisplay: React.FC<BlockInfoDisplayProps> = ({ block, onEditClick, canEdit = true }) => {
  const hasDescription = !!block.Descrizione;
  const hasNotes = !!block.Note;

  return (
    <div className="space-y-3 relative">
      <div className="flex justify-end items-start">
        {canEdit && <BlockEditButton onClick={onEditClick} />}
      </div>
      
      <Separator className="my-3" />
      
      {/* Descrizione */}
      {hasDescription && (
        <BlockTextSection title="Descrizione" content={decodeText(block.Descrizione)} />
      )}
      
      {/* Note */}
      {hasNotes && (
        <BlockTextSection title="Note" content={decodeText(block.Note)} />
      )}
      
      {/* Info di localizzazione */}
      <BlockLocationInfo block={block} />
      
      {/* Info sui servizi */}
      <BlockServicesInfo block={block} />
      
      {/* Sezione mappa - spostata in fondo */}
      {block.Latitudine && block.Longitudine && (
        <BlockMapSection block={block} />
      )}
    </div>
  );
};

export default BlockInfoDisplay;
