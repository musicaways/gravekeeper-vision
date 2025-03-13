
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import BlockInfoDisplay from "./BlockInfoDisplay";
import BlockInfoEditForm from "./BlockInfoEditForm";
import { formatBlockData, updateBlockInfo } from "./utils/blockInfoUtils";
import { BlockFormData } from "./types/blockFormTypes";

interface BlockInfoCardProps {
  block: any;
}

const BlockInfoCard: React.FC<BlockInfoCardProps> = ({ block }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const canEdit = !!user;

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async (data: BlockFormData) => {
    try {
      console.log("Saving block data:", data);
      
      // Format the data for Supabase update
      const updateData = formatBlockData(data);

      // Update the block in Supabase
      await updateBlockInfo(block.Id, updateData);

      toast({
        title: "Modifiche salvate",
        description: "Le informazioni del blocco sono state aggiornate con successo.",
      });

      // Exit editing mode
      setIsEditing(false);
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error: any) {
      console.error("Error updating block:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: `Non è stato possibile salvare le modifiche: ${error.message || 'Riprova più tardi'}`,
      });
    }
  };

  // Render edit form when in editing mode
  if (isEditing) {
    return <BlockInfoEditForm 
      block={block} 
      onSave={handleSave} 
      onCancel={() => setIsEditing(false)} 
    />;
  }

  // Render display view
  return <BlockInfoDisplay 
    block={block} 
    onEditClick={handleEditToggle} 
    canEdit={canEdit}
  />;
};

export default BlockInfoCard;
