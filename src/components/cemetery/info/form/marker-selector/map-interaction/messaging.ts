
/**
 * Functions for communication between iframe and parent window
 */

/**
 * Sends a message to the parent window when a marker is selected
 */
export function sendMarkerSelectedMessage(markerId: string): void {
  console.log('Sending selected marker ID to parent frame:', markerId);
  
  // Send the message to the parent frame
  window.parent.postMessage(JSON.stringify({
    type: 'markerSelected',
    markerId: markerId
  }), '*');
}

/**
 * Notifies the parent that the script has loaded successfully
 */
export function sendScriptLoadedMessage(): void {
  console.log('Map interaction script initialized');
  window.parent.postMessage(JSON.stringify({
    type: 'scriptLoaded',
    status: 'success'
  }), '*');
}
