
/**
 * Functions to set up event listeners for marker detection
 */

import { extractMarkerId, extractMarkerIdFromUrl } from './marker-detector';
import { highlightSelectedMarker } from './visual-helpers';
import { sendMarkerSelectedMessage } from './messaging';

// Store references to state and elements
let selectedMarkerId: string | null = null;
let lastClickedElement: HTMLElement | null = null;

/**
 * Sets up listeners for detecting marker clicks in the map
 */
export function setupMarkerListeners(): void {
  try {
    // Try to find map markers with specific selectors
    const markers = document.querySelectorAll(
      '.gmimap, .placemark, .waypoint, .marker, [role="button"], .gm-style-iw, .gm-style [tabindex="0"], img[src*="marker"], div[style*="marker"]'
    );
    
    if (markers.length > 0) {
      console.log('Markers found in map:', markers.length);
      
      markers.forEach(marker => {
        // Remove existing listeners to avoid duplicates
        marker.removeEventListener('click', markerClickHandler);
        // Add new listener
        marker.addEventListener('click', markerClickHandler);
      });
    } else {
      console.log('No markers found with specific selectors. Using generic selectors...');
      
      // If no markers found with specific selectors, use generic elements
      document.querySelectorAll('a, div, img').forEach(el => {
        el.addEventListener('click', documentClickHandler);
      });
    }
    
    // Add general click listener to the document
    document.addEventListener('click', documentClickHandler);
    
    // Watch for URL changes that might indicate marker selection
    watchUrlChanges();
    
  } catch (error) {
    console.error('Error setting up marker listeners:', error);
  }
}

/**
 * Monitors URL changes to detect marker selection
 */
export function watchUrlChanges(): void {
  let lastUrl = location.href;
  
  // Check initial URL
  checkUrlForMarkerId(lastUrl);
  
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      checkUrlForMarkerId(lastUrl);
    }
  });
  
  observer.observe(document, { subtree: true, childList: true });
}

/**
 * Checks the URL for a marker ID
 */
export function checkUrlForMarkerId(url: string): void {
  const markerId = extractMarkerIdFromUrl(url);
  if (markerId && markerId !== selectedMarkerId) {
    selectedMarkerId = markerId;
    console.log('Marker ID found in URL:', markerId);
    sendMarkerSelectedMessage(markerId);
  }
}

/**
 * Handler for marker click events
 */
export function markerClickHandler(event: MouseEvent): void {
  try {
    // Store the clicked element
    lastClickedElement = event.target as HTMLElement;
    console.log('Marker element clicked:', event.target);
    
    // Try to get marker ID
    const markerId = extractMarkerId(event);
    if (markerId) {
      updateSelectedMarkerId(markerId);
    }
    
    // Check URL after a short delay to detect URL changes
    setTimeout(() => {
      checkUrlForMarkerId(location.href);
    }, 300);
  } catch (err) {
    console.error('Error in marker click handler:', err);
  }
}

/**
 * Handler for general document click events
 */
export function documentClickHandler(event: MouseEvent): void {
  // Store clicked element
  lastClickedElement = event.target as HTMLElement;
  
  // Wait for possible popup to open
  setTimeout(() => {
    // Check if a popup opened after the click
    const popups = document.querySelectorAll('.gm-style-iw, .feature-popup');
    if (popups.length > 0) {
      console.log('Popup opened after click - likely a marker');
      // Try to extract marker ID
      const markerId = extractMarkerId(event);
      if (markerId) {
        updateSelectedMarkerId(markerId);
      }
    }
    
    // Always check URL for marker ID
    checkUrlForMarkerId(location.href);
  }, 300);
}

/**
 * Updates the selected marker ID and highlights it
 */
export function updateSelectedMarkerId(markerId: string): void {
  if (markerId !== selectedMarkerId) {
    selectedMarkerId = markerId;
    sendMarkerSelectedMessage(markerId);
    highlightSelectedMarker(lastClickedElement);
  }
}

/**
 * Gets the currently selected marker ID
 */
export function getSelectedMarkerId(): string | null {
  return selectedMarkerId;
}

/**
 * Gets the last clicked element
 */
export function getLastClickedElement(): HTMLElement | null {
  return lastClickedElement;
}
