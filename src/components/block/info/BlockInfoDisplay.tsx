
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
    <div className="space-y-3">
      {/* Immagine di copertina */}
      {block.FotoCopertina && (
        <div className="w-full h-[200px] overflow-hidden rounded-md mb-3">
          <img
            src={block.FotoCopertina}
            alt={`${block.Nome || 'Blocco'} immagine di copertina`}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold">
          {decodeText(block.Nome) || "Blocco"}
          {block.Codice && <span className="text-muted-foreground ml-2 text-base">({decodeText(block.Codice)})</span>}
        </h2>
        
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
