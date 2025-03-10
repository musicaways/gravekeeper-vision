
import { format, parseISO, differenceInYears } from "date-fns";
import { it } from "date-fns/locale";

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Data non disponibile";
  try {
    return format(parseISO(dateString), "d MMM yyyy", { locale: it });
  } catch (error) {
    return "Data non valida";
  }
};

/**
 * Calculate age from birth date and death date
 */
export const calculateAge = (birthDateString: string | null, deathDateString: string | null): number | null => {
  if (!birthDateString || !deathDateString) return null;
  
  try {
    const birthDate = parseISO(birthDateString);
    const deathDate = parseISO(deathDateString);
    
    // Verifica che le date siano valide
    if (isNaN(birthDate.getTime()) || isNaN(deathDate.getTime())) {
      return null;
    }
    
    // Calcola la differenza in anni
    return differenceInYears(deathDate, birthDate);
  } catch (error) {
    console.error("Errore nel calcolo dell'età:", error);
    return null;
  }
};

/**
 * Determine if a name is likely female based on common Italian name endings
 */
export const isFemale = (name: string): boolean => {
  const lowercaseName = name.toLowerCase();
  // Common Italian female name endings
  const femaleEndings = ['a', 'na', 'lla', 'etta', 'ina'];
  
  // Check for common Italian female name endings
  return femaleEndings.some(ending => {
    const nameOnly = lowercaseName.split(' ')[0]; // Get first name
    return nameOnly.endsWith(ending);
  });
};

/**
 * Generate loculo link from the deceased record
 */
export const getLoculoLink = (deceased: {
  loculi?: {
    Blocco?: {
      Id?: number;
    } | null;
  } | null;
}): string => {
  if (deceased.loculi?.Blocco?.Id) {
    return `/block/${deceased.loculi.Blocco.Id}`;
  }
  return "#";
};
