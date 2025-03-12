
import { DeceasedRecord } from '../../../types/deceased';
import { matchesCemeteryName } from './stringUtils';

/**
 * Apply cemetery filtering to processed data
 */
export const applyCemeteryFiltering = (
  processedData: DeceasedRecord[],
  selectedCemeteryId: number | null,
  selectedCemetery: string | null
): DeceasedRecord[] => {
  // No filtering if no cemetery is selected
  if (!selectedCemeteryId && !selectedCemetery) {
    return processedData;
  }
  
  // Apply cemetery filtering if specified
  if (selectedCemeteryId) {
    console.log(`Filtering by cemetery ID: ${selectedCemeteryId}`);
    return processedData.filter(defunto => defunto.cimitero_id === selectedCemeteryId);
  } 
  
  if (selectedCemetery) {
    console.log(`Filtering by cemetery name: "${selectedCemetery}"`);
    // Flexible cemetery name matching
    return processedData.filter(defunto => 
      matchesCemeteryName(defunto.cimitero_nome, selectedCemetery)
    );
  }
  
  return processedData;
};

/**
 * Apply sorting by cemetery
 */
export const applyCemeterySorting = (
  processedData: DeceasedRecord[],
  sortBy: string
): DeceasedRecord[] => {
  let sortedData = [...processedData];
  
  // Apply sorting by cemetery if requested
  if (sortBy === 'cemetery-asc') {
    sortedData.sort((a, b) => (a.cimitero_nome || '').localeCompare(b.cimitero_nome || ''));
  } else if (sortBy === 'cemetery-desc') {
    sortedData.sort((a, b) => (b.cimitero_nome || '').localeCompare(a.cimitero_nome || ''));
  }
  
  return sortedData;
};
