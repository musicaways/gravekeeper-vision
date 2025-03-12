import { formatDistanceToNow, format, differenceInYears } from "date-fns";
import { it } from "date-fns/locale";
import { DeceasedRecord } from "../types/deceased";

// Format date for display
export const formatDate = (dateString: string | Date | null): string => {
  if (!dateString) return "N/A";
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, "dd/MM/yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Data non valida";
  }
};

// Determine if recently deceased (last 30 days)
export const isRecentlyDeceased = (dateString: string | Date | null): boolean => {
  if (!dateString) return false;
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return date >= thirtyDaysAgo;
  } catch (error) {
    console.error("Error checking recent date:", error);
    return false;
  }
};

// Get time passed since date
export const getTimeSince = (dateString: string | Date | null): string => {
  if (!dateString) return "";
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return formatDistanceToNow(date, { locale: it, addSuffix: true });
  } catch (error) {
    console.error("Error getting time since:", error);
    return "";
  }
};

// Determine gender based on the name
export const isFemale = (name: string): boolean => {
  if (!name || typeof name !== 'string') {
    console.log("Invalid name provided to isFemale:", name);
    return false;
  }
  
  // Italian female names often end with 'a'
  const cleanName = name.trim().split(' ')[0].toLowerCase();
  
  // Common female name indicators in Italian
  const femaleIndicators = ['a', 'ia', 'na', 'lla', 'etta', 'ina'];
  
  // Special cases for names that end with 'a' but are male
  const maleExceptions = ['andrea', 'luca', 'nicola', 'mattia', 'elia'];
  
  if (maleExceptions.includes(cleanName)) {
    return false;
  }
  
  // Check if the name ends with any of the female indicators
  return femaleIndicators.some(indicator => cleanName.endsWith(indicator));
};

// Calculate age between birth and death dates
export const calculateAge = (birthDate: Date | string | null, deathDate: Date | string | null): number | null => {
  if (!birthDate || !deathDate) {
    console.log("Missing birth or death date for age calculation:", { birthDate, deathDate });
    return null;
  }
  
  try {
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    const death = typeof deathDate === 'string' ? new Date(deathDate) : deathDate;
    
    return differenceInYears(death, birth);
  } catch (error) {
    console.error("Error calculating age:", error);
    return null;
  }
};

// Generate a link to the loculo page
export const getLoculoLink = (deceased: DeceasedRecord): string => {
  console.log("getLoculoLink called with:", {
    id_loculo: deceased.id_loculo,
    loculi: deceased.loculi
  });
  
  // Se non abbiamo l'ID del loculo, non possiamo generare un link
  if (!deceased.id_loculo) {
    console.log("No loculo ID available");
    return "#";
  }
  
  // Se abbiamo i dati del loculo, creiamo un link più specifico
  if (deceased.loculi && deceased.loculi.Blocco) {
    const bloccoId = deceased.loculi.Blocco.Id;
    if (bloccoId) {
      console.log(`Creating link to /block/${bloccoId}/loculi/${deceased.id_loculo}`);
      return `/block/${bloccoId}/loculi/${deceased.id_loculo}`;
    }
  }
  
  // Se abbiamo solo l'ID del loculo, creiamo un link generico
  console.log(`Creating generic link to /loculi/${deceased.id_loculo}`);
  return `/loculi/${deceased.id_loculo}`;
};
