
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import BlockTextSection from "../../info/BlockTextSection";
import BlockDetailsCard from "../../info/BlockDetailsCard";
import BlockMapDisplay from "../../map/BlockMapDisplay";
import BlockEditButton from "../../info/BlockEditButton";

interface BlockInfoTabContentProps {
  block: any;
}

const BlockInfoTabContent: React.FC<BlockInfoTabContentProps> = ({ block }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const canEdit = !!user;

  const handleEdit = () => {
    setIsEditing(true);
    toast({
      title: "Modalità modifica",
      description: "Ora puoi modificare le informazioni del blocco.",
    });
  };

  return (
    <div className="px-4 py-4">
      {/* Description Section */}
      {block.Descrizione && (
        <BlockTextSection title="Descrizione" content={block.Descrizione} />
      )}
      
      {/* Notes Section */}
      {block.Annotazioni && (
        <BlockTextSection title="Note" content={block.Annotazioni} />
      )}
      
      {/* Details Section */}
      <BlockDetailsCard block={block} />
      
      {/* Map Section */}
      <BlockMapDisplay block={block} />
      
      {/* Edit Button */}
      {canEdit && <BlockEditButton onClick={handleEdit} />}
    </div>
  );
};

export default BlockInfoTabContent;
