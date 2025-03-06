
/**
 * Main structure for the map interaction script
 */

import { formatScriptFunction } from './script-generator';
import { 
  extractMarkerId, 
  extractMarkerIdFromUrl, 
  extractMarkerIdFromElement, 
  extractMarkerIdFromPopup 
} from './marker-detector';
import { 
  setupMarkerListeners, 
  watchUrlChanges, 
  checkUrlForMarkerId, 
  markerClickHandler, 
  documentClickHandler, 
  updateSelectedMarkerId
} from './marker-listeners';
import { highlightSelectedMarker } from './visual-helpers';
import { sendMarkerSelectedMessage, sendScriptLoadedMessage } from './messaging';

/**
 * Generates the map interaction script content
 */
export function generateScriptContent(): string {
  return `
(function() {
  console.log('Map interaction script injected and running');
  
  // Declare shared variables
  let selectedMarkerId = null;
  let lastClickedElement = null;
  
  // Extract marker ID from various sources
  ${formatScriptFunction('extractMarkerIdFromUrl', extractMarkerIdFromUrl)}
  
  ${formatScriptFunction('extractMarkerIdFromElement', extractMarkerIdFromElement)}
  
  ${formatScriptFunction('extractMarkerIdFromPopup', extractMarkerIdFromPopup)}
  
  ${formatScriptFunction('extractMarkerId', extractMarkerId)}
  
  // Visual feedback functions
  ${formatScriptFunction('highlightSelectedMarker', highlightSelectedMarker)}
  
  // Communication functions
  ${formatScriptFunction('sendMarkerSelectedMessage', sendMarkerSelectedMessage)}
  
  // Marker listener functions
  ${formatScriptFunction('setupMarkerListeners', setupMarkerListeners)}
  
  ${formatScriptFunction('watchUrlChanges', watchUrlChanges)}
  
  ${formatScriptFunction('checkUrlForMarkerId', checkUrlForMarkerId)}
  
  ${formatScriptFunction('markerClickHandler', markerClickHandler)}
  
  ${formatScriptFunction('documentClickHandler', documentClickHandler)}
  
  ${formatScriptFunction('updateSelectedMarkerId', updateSelectedMarkerId)}
  
  // Wait for map to load and initialize script
  function waitForMapLoaded() {
    if (document.readyState === 'complete') {
      console.log('Document loaded, setting up listeners...');
      // Page fully loaded, wait a bit for markers
      setTimeout(setupMarkerListeners, 1000);
      
      // Continue monitoring for map changes
      setInterval(setupMarkerListeners, 3000);
      
      // Check URL immediately for marker ID
      checkUrlForMarkerId(location.href);
    } else {
      // Still loading, try again later
      setTimeout(waitForMapLoaded, 500);
    }
  }
  
  // Notify parent that script is loaded
  console.log('Map interaction script initialized');
  window.parent.postMessage(JSON.stringify({
    type: 'scriptLoaded',
    status: 'success'
  }), '*');
  
  // Start monitoring map loading
  waitForMapLoaded();
})();
  `;
}
