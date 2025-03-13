
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface BlockFormActionsProps {
  isSubmitting: boolean;
  isUploading: boolean;
  onCancel: () => void;
}

const BlockFormActions: React.FC<BlockFormActionsProps> = ({ 
  isSubmitting, 
  isUploading, 
  onCancel 
}) => {
  const isDisabled = isSubmitting || isUploading;
  
  return (
    <div className="flex justify-end space-x-2 py-4">
      <Button 
        variant="outline" 
        type="button" 
        onClick={onCancel}
        disabled={isDisabled}
      >
        Annulla
      </Button>
      <Button 
        type="submit"
        disabled={isDisabled}
      >
        <Save className="h-4 w-4 mr-1" />
        {isDisabled ? "Salvataggio in corso..." : "Salva"}
      </Button>
    </div>
  );
};

export default BlockFormActions;
