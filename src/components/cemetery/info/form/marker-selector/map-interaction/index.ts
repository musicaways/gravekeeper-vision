
/**
 * Main entry point for map interaction script
 */

import { generateScriptContent } from './script-structure';

// Re-export the modules for use elsewhere
export { 
  extractMarkerId, 
  extractMarkerIdFromUrl, 
  extractMarkerIdFromElement, 
  extractMarkerIdFromPopup 
} from './marker-detector';

export { 
  setupMarkerListeners, 
  watchUrlChanges, 
  checkUrlForMarkerId, 
  markerClickHandler, 
  documentClickHandler, 
  updateSelectedMarkerId
} from './marker-listeners';

export { highlightSelectedMarker } from './visual-helpers';
export { sendMarkerSelectedMessage, sendScriptLoadedMessage } from './messaging';

/**
 * Generates the map interaction script by combining functions from our modules
 * This allows us to use TypeScript modules while still generating a script for injection
 */
export function generateMapInteractionScript(): string {
  return generateScriptContent();
}

/**
 * Main IIFE for the map interaction script
 * This is the script that will be injected into the iframe
 */
export const mapInteractionScript = generateMapInteractionScript();
