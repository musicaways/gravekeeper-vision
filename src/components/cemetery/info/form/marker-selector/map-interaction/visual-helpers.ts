
/**
 * Functions for visual feedback in the map
 */

/**
 * Highlights the selected marker or popup visually
 */
export function highlightSelectedMarker(lastClickedElement: HTMLElement | null): void {
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
