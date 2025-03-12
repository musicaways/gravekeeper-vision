
/**
 * Calculate Levenshtein distance for fuzzy string matching
 */
export const levenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[b.length][a.length];
};

/**
 * Compare cemetery names with fuzzy matching
 */
export const matchesCemeteryName = (
  recordCemeteryName: string | null, 
  selectedCemeteryName: string
): boolean => {
  if (!recordCemeteryName) return false;
  
  const selectedName = selectedCemeteryName.toLowerCase().trim();
  const cemeteryName = recordCemeteryName.toLowerCase().trim();
  
  return (
    cemeteryName.includes(selectedName) || 
    selectedName.includes(cemeteryName) ||
    levenshteinDistance(cemeteryName, selectedName) <= 3 // Allow for minor typos
  );
};
