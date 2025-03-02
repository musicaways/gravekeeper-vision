
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

// Function to fetch deceased data for a cemetery
export const fetchDeceasedByCemeteryId = async (cemeteryId: string, searchTerm?: string) => {
  try {
    const numericCemeteryId = parseInt(cemeteryId, 10);
    
    if (isNaN(numericCemeteryId)) {
      throw new Error("ID cimitero non valido");
    }

    // First get all sectors for this cemetery
    const { data: sectors, error: sectorsError } = await supabase
      .from('Settore')
      .select('Id')
      .eq('IdCimitero', numericCemeteryId);
      
    if (sectorsError) throw sectorsError;
    
    if (!sectors || sectors.length === 0) return [];
    
    // Get all blocks in these sectors
    const sectorIds = sectors.map(sector => sector.Id);
    const { data: blocks, error: blocksError } = await supabase
      .from('Blocco')
      .select('Id')
      .in('IdSettore', sectorIds);
      
    if (blocksError) throw blocksError;
    
    if (!blocks || blocks.length === 0) return [];
    
    // Get all loculi (plots) in these blocks
    const blockIds = blocks.map(block => block.Id);
    const { data: loculi, error: loculiError } = await supabase
      .from('Loculo')
      .select('Id')
      .in('IdBlocco', blockIds);
      
    if (loculiError) throw loculiError;
    
    if (!loculi || loculi.length === 0) return [];
    
    // Get all deceased associated with these loculi
    const loculiIds = loculi.map(loculo => loculo.Id);
    let query = supabase
      .from('Defunto')
      .select('*')
      .in('IdLoculo', loculiIds);
      
    // Apply search filter if provided
    if (searchTerm) {
      query = query.ilike('Nominativo', `%${searchTerm}%`);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching deceased:", error);
    throw error;
  }
};

// Function to fetch available plots for a cemetery
export const fetchPlotsByCemeteryId = async (cemeteryId: string) => {
  try {
    // Convert cemeteryId to number
    const numericCemeteryId = parseInt(cemeteryId, 10);
    
    if (isNaN(numericCemeteryId)) {
      throw new Error("ID cimitero non valido");
    }

    // First get the sections in this cemetery
    const { data: sections, error: sectionsError } = await supabase
      .from('Settore')
      .select('Id')
      .eq('IdCimitero', numericCemeteryId);

    if (sectionsError) throw sectionsError;
    
    if (!sections || sections.length === 0) return [];
    
    // Get all blocks in these sections
    const sectionIds = sections.map(section => section.Id);
    const { data: blocks, error: blocksError } = await supabase
      .from('Blocco')
      .select('Id')
      .in('IdSettore', sectionIds);
      
    if (blocksError) throw blocksError;
    
    if (!blocks || blocks.length === 0) return [];
    
    // Get all plots (loculi) in these blocks
    const blockIds = blocks.map(block => block.Id);
    const { data: plots, error: plotsError } = await supabase
      .from('Loculo')
      .select('*')
      .in('IdBlocco', blockIds);
      
    if (plotsError) throw plotsError;
    
    return plots || [];
  } catch (error) {
    console.error("Error fetching plots:", error);
    throw error;
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

// Function to format the date from database format to readable format
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "N/A";
  
  try {
    // Try to parse the date - can handle both ISO strings and DD/MM/YYYY formats
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If date is invalid, return original string
      return dateString;
    }
    
    // Format date as DD/MM/YYYY
    return date.toLocaleDateString('it-IT');
  } catch (error) {
    return dateString;
  }
};
