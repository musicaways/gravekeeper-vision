
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import BlockDetailsCard from "./BlockDetailsCard";
import BlockInfoForm from "./BlockInfoForm";
import BlockEditButton from "./BlockEditButton";
import BlockMapDisplay from "../map/BlockMapDisplay";

interface BlockInfoCardProps {
  block: any;
}

const BlockInfoCard: React.FC<BlockInfoCardProps> = ({ block }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const canEdit = !!user;

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Refresh per ottenere i dati aggiornati
    window.location.reload();
  };

  if (isEditing) {
    return (
      <BlockInfoForm
        block={block}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <BlockDetailsCard block={block} />
      <BlockMapDisplay block={block} />
      {canEdit && <BlockEditButton onClick={handleEditToggle} />}
    </div>
  );
};

export default BlockInfoCard;
