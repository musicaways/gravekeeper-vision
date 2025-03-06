
/**
 * Functions for detecting and extracting marker IDs from the map
 */

/**
 * Extracts marker ID from an event or element
 */
export function extractMarkerId(event: MouseEvent): string | null {
  // Extract the ID from URL
  let markerId = extractMarkerIdFromUrl(window.location.href);
  
  // If not found in URL, try from element attributes
  if (!markerId && event.target) {
    markerId = extractMarkerIdFromElement(event.target as HTMLElement);
  }
  
  // Check popup elements if no ID found yet
  if (!markerId) {
    markerId = extractMarkerIdFromPopup();
  }
  
  return markerId;
}

/**
 * Extracts marker ID from the URL query parameters
 */
export function extractMarkerIdFromUrl(url: string): string | null {
  const msidMatch = url.match(/[?&]msid=([^&#]*)/);
  if (msidMatch && msidMatch[1]) {
    console.log('ID marker found in URL:', msidMatch[1]);
    return msidMatch[1];
  }
  return null;
}

/**
 * Extracts marker ID from element attributes
 */
export function extractMarkerIdFromElement(element: HTMLElement): string | null {
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

/**
 * Extracts marker ID from popup content
 */
export function extractMarkerIdFromPopup(): string | null {
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
  const idMatches = popupContent.match(/ID:?\\s*(\\S+)/i);
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
