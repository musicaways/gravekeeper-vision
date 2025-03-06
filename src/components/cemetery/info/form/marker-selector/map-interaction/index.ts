
/**
 * Main entry point for map interaction script
 */

import { setupMarkerListeners } from './marker-listeners';
import { sendScriptLoadedMessage } from './messaging';

/**
 * Main IIFE for the map interaction script
 * This will be stringified and injected into the iframe
 */
export const mapInteractionScript = `
(function() {
  console.log('Map interaction script injected and running');
  
  // Declare functions and variables
  let selectedMarkerId = null;
  let lastClickedElement = null;
  
  // Extract marker ID from various sources
  function extractMarkerIdFromUrl(url) {
    const msidMatch = url.match(/[?&]msid=([^&#]*)/);
    if (msidMatch && msidMatch[1]) {
      console.log('ID marker found in URL:', msidMatch[1]);
      return msidMatch[1];
    }
    return null;
  }
  
  function extractMarkerIdFromElement(element) {
    // Check for ID in element attributes
    let markerId = element.getAttribute('data-marker-id') || 
                  element.getAttribute('data-feature-id') ||
                  element.getAttribute('data-id') ||
                  element.id;
    
    if (markerId) {
      console.log('ID marker found in element attributes:', markerId);
      return markerId;
    }
    
    // If not found, check parent elements
    const parent = element.closest('[data-marker-id], [data-feature-id], [data-id]');
    if (parent) {
      markerId = parent.getAttribute('data-marker-id') || 
                parent.getAttribute('data-feature-id') ||
                parent.getAttribute('data-id') ||
                parent.id;
      
      if (markerId) {
        console.log('ID marker found in parent attributes:', markerId);
        return markerId;
      }
    }
    
    return null;
  }
  
  function extractMarkerIdFromPopup() {
    const popups = document.querySelectorAll('.gm-style-iw');
    if (popups.length === 0) return null;
    
    const popup = popups[0];
    
    // Try to find ID in popup links
    const links = popup.querySelectorAll('a[href*="msid"]');
    if (links.length > 0) {
      const href = links[0].getAttribute('href');
      if (href) {
        const popupMsidMatch = href.match(/[?&]msid=([^&#]*)/);
        if (popupMsidMatch && popupMsidMatch[1]) {
          console.log('ID marker found in popup link:', popupMsidMatch[1]);
          return popupMsidMatch[1];
        }
      }
    }
    
    // Try to find ID in popup content text
    const popupContent = popup.textContent || '';
    const idMatches = popupContent.match(/ID:\\s*(\\S+)/i);
    if (idMatches && idMatches[1]) {
      console.log('ID marker found in popup text:', idMatches[1]);
      return idMatches[1];
    }
    
    // Try to use title as fallback ID
    const titleElements = popup.querySelectorAll('h1, h2, h3, h4, h5, h6, .title, strong, b');
    if (titleElements.length > 0) {
      const title = titleElements[0].textContent?.trim();
      if (title) {
        console.log('Using popup title as fallback ID:', title);
        return title;
      }
    }
    
    return null;
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
  
  // Set up listeners and handlers
  function setupMarkerListeners() {
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
  
  function watchUrlChanges() {
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
  
  function checkUrlForMarkerId(url) {
    const markerId = extractMarkerIdFromUrl(url);
    if (markerId && markerId !== selectedMarkerId) {
      selectedMarkerId = markerId;
      console.log('Marker ID found in URL:', markerId);
      sendMarkerSelectedMessage(markerId);
    }
  }
  
  function markerClickHandler(event) {
    try {
      // Store the clicked element
      lastClickedElement = event.target;
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
  
  function documentClickHandler(event) {
    // Store clicked element
    lastClickedElement = event.target;
    
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
  
  function highlightSelectedMarker() {
    try {
      // Highlight popup if present
      const popups = document.querySelectorAll('.gm-style-iw');
      if (popups.length > 0) {
        popups[0].style.border = '3px solid #4CAF50';
        popups[0].style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.6)';
      }
      
      // Highlight clicked element if available
      if (lastClickedElement) {
        lastClickedElement.style.outline = '3px solid #4CAF50';
        lastClickedElement.style.outlineOffset = '2px';
      }
    } catch (e) {
      console.error('Error highlighting marker:', e);
    }
  }
  
  function sendMarkerSelectedMessage(markerId) {
    console.log('Sending selected marker ID to parent frame:', markerId);
    
    // Send the message to the parent frame
    window.parent.postMessage(JSON.stringify({
      type: 'markerSelected',
      markerId: markerId
    }), '*');
  }
  
  function updateSelectedMarkerId(markerId) {
    if (markerId !== selectedMarkerId) {
      selectedMarkerId = markerId;
      sendMarkerSelectedMessage(markerId);
      highlightSelectedMarker();
    }
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
