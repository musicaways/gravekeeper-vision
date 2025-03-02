
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  fetchDeceasedByCemeteryId, 
  fetchPlotsByCemeteryId, 
  addDeceased 
} from "./deceased/utils";
import { DeceasedList } from "./deceased/DeceasedList";
import { DeceasedSearch } from "./deceased/DeceasedSearch";
import { AddDeceasedDialog } from "./deceased/AddDeceasedDialog";

export interface CemeteryDeceasedTabProps {
  cemeteryId: string;
}

export const CemeteryDeceasedTab: React.FC<CemeteryDeceasedTabProps> = ({ cemeteryId }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newDeceased, setNewDeceased] = useState({
    first_name: "",
    last_name: "",
    gender: "unspecified",
    birth_date: "",
    death_date: "",
    burial_date: "",
    burial_type: "full_body",
    plot_id: "",
  });

  // Fetch available plots for the cemetery
  const { data: plots, isLoading: plotsLoading } = useQuery({
    queryKey: ['cemetery-plots', cemeteryId],
    queryFn: () => fetchPlotsByCemeteryId(cemeteryId),
    retry: 1,
  });

  // Fetch deceased persons from the database
  const { data: deceased, isLoading, isError, refetch } = useQuery({
    queryKey: ['cemetery-deceased', cemeteryId, searchTerm],
    queryFn: () => fetchDeceasedByCemeteryId(cemeteryId, searchTerm),
    retry: 1,
  });

  const handleAddDeceased = async () => {
    try {
      if (!newDeceased.first_name || !newDeceased.last_name) {
        toast.error("Nome e cognome sono campi obbligatori");
        return;
      }
      
      const result = await addDeceased(newDeceased);
      
      if (result) {
        // Close dialog and reset form
        setIsAddDialogOpen(false);
        setNewDeceased({
          first_name: "",
          last_name: "",
          gender: "unspecified",
          birth_date: "",
          death_date: "",
          burial_date: "",
          burial_type: "full_body",
          plot_id: "",
        });

        // Refetch data
        refetch();
        
        toast.success("Defunto aggiunto con successo");
      }
    } catch (error) {
      console.error("Error adding deceased:", error);
      toast.error("Errore durante l'aggiunta del defunto");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Defunti nel cimitero
        </CardTitle>
        <CardDescription>
          Visualizza e gestisci l'elenco dei defunti sepolti in questo cimitero
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DeceasedSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddClick={() => setIsAddDialogOpen(true)}
        />

        <DeceasedList 
          deceased={deceased}
          isLoading={isLoading}
          isError={isError}
          onAddClick={() => setIsAddDialogOpen(true)}
          onRetry={() => refetch()}
        />
        
        <AddDeceasedDialog 
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          newDeceased={newDeceased}
          setNewDeceased={setNewDeceased}
          plots={plots}
          plotsLoading={plotsLoading}
          onSave={handleAddDeceased}
        />
      </CardContent>
    </Card>
  );
};
