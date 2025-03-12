
import { debounce } from "@/lib/utils";

/**
 * Create a debounced search function to limit API calls
 */
export const createDebouncedSearch = (
  callback: (term: string) => void,
  delay: number = 500
) => {
  return debounce((term: string) => {
    callback(term);
  }, delay);
};
