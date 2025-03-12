
import { DeceasedRecord } from "../types/deceased";

/**
 * Formatta una data in formato leggibile italiano
 */
export const formatDate = (date: string | Date | null): string => {
  if (!date) return 'N/A';
  
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    
    // Controlla se la data è valida
    if (isNaN(d.getTime())) {
      return 'Data non valida';
    }
    
    return d.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error("Errore nella formattazione della data:", error);
    return 'Errore data';
  }
};

/**
 * Controlla se il nome è femminile (euristico)
 */
export const isFemale = (name: string): boolean => {
  if (!name || typeof name !== 'string') {
    console.log("Invalid name provided to isFemale:", name);
    return false;
  }
  
  // Nomi che terminano in 'a' sono generalmente femminili in italiano
  // (con alcune eccezioni)
  const exceptions = ['andrea', 'luca', 'mattia', 'nicola', 'elia'];
  
  const nameParts = name.toLowerCase().trim().split(' ');
  const firstName = nameParts[0];
  
  if (exceptions.includes(firstName)) {
    return false;
  }
  
  return firstName.endsWith('a');
};

/**
 * Calcola l'età in base alla data di nascita e decesso
 */
export const calculateAge = (
  birthDate: string | Date | null, 
  deathDate: string | Date | null
): number | null => {
  if (!birthDate || !deathDate) return null;
  
  try {
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    const death = typeof deathDate === 'string' ? new Date(deathDate) : deathDate;
    
    // Controlla se le date sono valide
    if (isNaN(birth.getTime()) || isNaN(death.getTime())) {
      return null;
    }
    
    // Calcola l'età
    let age = death.getFullYear() - birth.getFullYear();
    const m = death.getMonth() - birth.getMonth();
    
    if (m < 0 || (m === 0 && death.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error("Errore nel calcolo dell'età:", error);
    return null;
  }
};

/**
 * Genera il link al loculo
 */
export const getLoculoLink = (deceased: DeceasedRecord): string => {
  console.log("getLoculoLink called with:", {
    id_loculo: deceased.id_loculo,
    loculi: deceased.loculi
  });
  
  // Se non abbiamo un ID del loculo, non possiamo creare un link
  if (!deceased.id_loculo) {
    return '#';
  }
  
  // Se abbiamo l'oggetto loculo completo con relazioni
  if (deceased.loculi && 
      deceased.loculi.Blocco && 
      deceased.loculi.Blocco.Id && 
      deceased.loculi.Blocco.Settore && 
      deceased.loculi.Blocco.Settore.Cimitero && 
      deceased.loculi.Blocco.Settore.Cimitero.Id) {
    
    const cimiteroId = deceased.loculi.Blocco.Settore.Cimitero.Id;
    const bloccoId = deceased.loculi.Blocco.Id;
    
    console.log(`Creating detailed link with cimiteroId=${cimiteroId}, bloccoId=${bloccoId}, loculoId=${deceased.id_loculo}`);
    
    return `/cemetery/${cimiteroId}/block/${bloccoId}/loculi/${deceased.id_loculo}`;
  }
  
  // Fallback: link generico al loculo
  console.log(`Creating generic link to /loculi/${deceased.id_loculo}`);
  return `/loculi/${deceased.id_loculo}`;
};
