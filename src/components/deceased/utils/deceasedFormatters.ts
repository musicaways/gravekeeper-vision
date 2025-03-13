
import { format, parseISO, differenceInYears } from "date-fns";
import { it } from "date-fns/locale";

/**
 * Format a date string or Date object to a readable format
 */
export const formatDate = (date: string | Date | null): string => {
  if (!date) return "Data non disponibile";
  try {
    const dateToFormat = typeof date === 'string' ? parseISO(date) : date;
    return format(dateToFormat, "d MMM yyyy", { locale: it });
  } catch (error) {
    return "Data non valida";
  }
};

/**
 * Calculate age from birth date and death date
 */
export const calculateAge = (birthDate: Date | string | null, deathDate: Date | string | null): number | null => {
  if (!birthDate || !deathDate) return null;
  
  try {
    const birthDateObj = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
    const deathDateObj = typeof deathDate === 'string' ? parseISO(deathDate) : deathDate;
    
    // Verifica che le date siano valide
    if (isNaN(birthDateObj.getTime()) || isNaN(deathDateObj.getTime())) {
      return null;
    }
    
    // Calcola la differenza in anni
    return differenceInYears(deathDateObj, birthDateObj);
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
 * Handle both string and number id_loculo
 */
export const getLoculoLink = (deceased: {
  id_loculo?: string | number | null;
  loculi?: {
    id?: number;
    IdBlocco?: number;
    Blocco?: {
      Id?: number;
    } | null;
  } | null;
}): string => {
  // First check if we have the loculo object with block information
  if (deceased.loculi?.Blocco?.Id) {
    return `/block/${deceased.loculi.Blocco.Id}`;
  }
  
  // If we have IdBlocco directly on loculi
  if (deceased.loculi?.IdBlocco) {
    return `/block/${deceased.loculi.IdBlocco}`;
  }
  
  // If we don't have specific block information but do have loculo data
  // we should go to a generic page
  return "#";
};
