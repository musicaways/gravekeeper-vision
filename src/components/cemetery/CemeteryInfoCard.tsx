
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import CemeteryInfoDisplay from "./info/CemeteryInfoDisplay";
import { CemeteryInfoEditForm } from "./info/form";
import { formatCemeteryData, updateCemeteryInfo } from "./info/cemeteryInfoUtils";

interface CemeteryInfoCardProps {
  cemetery: any;
}

const CemeteryInfoCard = ({ cemetery }: CemeteryInfoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async (data: any) => {
    try {
      console.log("Saving data:", data);
      
      // Format the data for Supabase update
      const updateData = formatCemeteryData(data);

      // Update the cemetery in Supabase
      await updateCemeteryInfo(cemetery.Id, updateData);

      toast({
        title: "Modifiche salvate",
        description: "Le informazioni del cimitero sono state aggiornate con successo.",
      });

      // Exit editing mode
      setIsEditing(false);
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error: any) {
      console.error("Error updating cemetery:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: `Non è stato possibile salvare le modifiche: ${error.message || 'Riprova più tardi'}`,
      });
    }
  };

  // Render edit form when in editing mode
  if (isEditing) {
    return <CemeteryInfoEditForm 
      cemetery={cemetery} 
      onSave={handleSave} 
      onCancel={() => setIsEditing(false)} 
    />;
  }

  // Render display view
  return <CemeteryInfoDisplay 
    cemetery={cemetery} 
    onEditClick={handleEditToggle} 
  />;
};

export default CemeteryInfoCard;
