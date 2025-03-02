
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Function to get the next available ID for the Defunto table
export const getNextDefuntoId = async (): Promise<number> => {
  try {
    // First, try to get the maximum ID currently in the table
    const { data, error } = await supabase
      .from('Defunto')
      .select('Id')
      .order('Id', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    // If there are records, return the next available ID (max + 1)
    if (data && data.length > 0) {
      return data[0].Id + 1;
    }
    
    // If there are no records, start with ID 1
    return 1;
  } catch (error) {
    console.error("Error getting next ID:", error);
    // Default to a high number to reduce the chance of conflicts
    return Math.floor(Math.random() * 10000) + 1000;
  }
};

// Function to add a new deceased record
export const addDeceased = async (newDeceased: {
  first_name: string;
  last_name: string;
  gender: string;
  birth_date: string;
  death_date: string;
  plot_id: string;
}) => {
  try {
    // Basic validation
    if (!newDeceased.first_name || !newDeceased.last_name) {
      toast.error("Nome e cognome sono obbligatori");
      return null;
    }

    // Combine first and last name into full name for the database
    const fullName = `${newDeceased.first_name} ${newDeceased.last_name}`;

    // Get the next available ID
    const nextId = await getNextDefuntoId();

    // Create the record with the required Id field
    const { data, error } = await supabase
      .from('Defunto')
      .insert([{
        Id: nextId,
        Nominativo: fullName,
        Sesso: newDeceased.gender,
        DataNascita: newDeceased.birth_date,
        DataDecesso: newDeceased.death_date,
        IdLoculo: newDeceased.plot_id ? parseInt(newDeceased.plot_id) : null,
      }])
      .select();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error adding deceased:", error);
    toast.error("Errore durante l'aggiunta del defunto");
    return null;
  }
};
