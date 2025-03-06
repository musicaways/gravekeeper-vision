
import { mapInteractionScript } from "../mapInteractionScript";

// Make the map interaction script available globally for iframe injection
declare global {
  interface Window {
    mapInteractionScript: string;
  }
}

export function setupMapScript() {
  // Set the map interaction script as a global variable
  window.mapInteractionScript = mapInteractionScript;
}
