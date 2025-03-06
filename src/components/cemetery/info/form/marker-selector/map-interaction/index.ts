/**
 * Main entry point for map interaction script
 */

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
 * Generates the map interaction script by combining functions from our modules
 * This allows us to use TypeScript modules while still generating a script for injection
 */
export function generateMapInteractionScript(): string {
  return `
(function() {
  console.log('Map interaction script injected and running');
  
  // Declare shared variables
  let selectedMarkerId = null;
  let lastClickedElement = null;
  
  // Extract marker ID from various sources
  function extractMarkerIdFromUrl(url) {
    ${extractMarkerIdFromUrl.toString().split("{")[1].split("}")[0]}
  }
  
  function extractMarkerIdFromElement(element) {
    ${extractMarkerIdFromElement.toString().split("{")[1].split("}")[0]}
  }
  
  function extractMarkerIdFromPopup() {
    ${extractMarkerIdFromPopup.toString().split("{")[1].split("}")[0]}
  }
  
  function extractMarkerId(event) {
    // Extract the ID from URL
    let markerId = extractMarkerIdFromUrl(window.location.href);
    
    // If not found in URL, try from element attributes
    if (!markerId && event.target) {
      markerId = extractMarkerIdFromElement(event.target);
    }
    
    // Check popup elements if no ID found yet
    if (!markerId) {
      markerId = extractMarkerIdFromPopup();
    }
    
    return markerId;
  }
  
  // Visual feedback functions
  function highlightSelectedMarker() {
    ${highlightSelectedMarker.toString().split("{")[1].split("}")[0]}
  }
  
  // Communication functions
  function sendMarkerSelectedMessage(markerId) {
    ${sendMarkerSelectedMessage.toString().split("{")[1].split("}")[0]}
  }
  
  // Marker listener functions
  function setupMarkerListeners() {
    ${setupMarkerListeners.toString().split("{")[1].split("}")[0]}
  }
  
  function watchUrlChanges() {
    ${watchUrlChanges.toString().split("{")[1].split("}")[0]}
  }
  
  function checkUrlForMarkerId(url) {
    ${checkUrlForMarkerId.toString().split("{")[1].split("}")[0]}
  }
  
  function markerClickHandler(event) {
    ${markerClickHandler.toString().split("{")[1].split("}")[0]}
  }
  
  function documentClickHandler(event) {
    ${documentClickHandler.toString().split("{")[1].split("}")[0]}
  }
  
  function updateSelectedMarkerId(markerId) {
    ${updateSelectedMarkerId.toString().split("{")[1].split("}")[0]}
  }
  
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

/**
 * Main IIFE for the map interaction script
 * This is the script that will be injected into the iframe
 */
export const mapInteractionScript = generateMapInteractionScript();
