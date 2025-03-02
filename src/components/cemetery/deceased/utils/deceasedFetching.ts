
import { supabase } from "@/integrations/supabase/client";

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
