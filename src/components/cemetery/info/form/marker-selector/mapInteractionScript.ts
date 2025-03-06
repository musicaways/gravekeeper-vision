
/**
 * Script da iniettare nell'iframe della mappa per catturare gli eventi dei marker
 * Questo script verrà eseguito all'interno dell'iframe di Google My Maps
 */

export const mapInteractionScript = `
(function() {
  // Funzione per intercettare i clic sui marker
  function setupMarkerListeners() {
    try {
      // Seleziona tutti gli elementi dei marker nella mappa
      const markers = document.querySelectorAll('.marker-selector, .gm-style-iw');
      
      if (markers.length > 0) {
        console.log('Marker trovati nella mappa:', markers.length);
        
        markers.forEach(marker => {
          marker.addEventListener('click', function(event) {
            // Estrai l'ID del marker dall'URL corrente o dall'elemento
            let markerId = '';
            
            // Cerca nell'URL
            const url = window.location.href;
            const msidMatch = url.match(/[?&]msid=([^&#]*)/);
            if (msidMatch) {
              markerId = msidMatch[1];
            }
            
            // Se non trovato nell'URL, cerca negli attributi dell'elemento
            if (!markerId) {
              // Cerca gli attributi data-* o altre proprietà che potrebbero contenere l'ID
              markerId = marker.getAttribute('data-marker-id') || 
                         marker.getAttribute('data-feature-id');
            }
            
            // Se abbiamo un ID, invia un messaggio al frame principale
            if (markerId) {
              console.log('Marker selezionato con ID:', markerId);
              window.parent.postMessage(JSON.stringify({
                type: 'markerSelected',
                markerId: markerId
              }), '*');
            }
          });
        });
      } else {
        console.log('Nessun marker trovato nella mappa');
      }
    } catch (error) {
      console.error('Errore durante il setup dei listener dei marker:', error);
    }
  }
  
  // Funzione per rilevare quando la mappa è completamente caricata
  function waitForMapLoaded() {
    if (document.readyState === 'complete') {
      // La pagina è completamente caricata, attendi un po' per i marker
      setTimeout(setupMarkerListeners, 1500);
      
      // Continua a monitorare eventuali cambiamenti nella mappa
      setInterval(setupMarkerListeners, 5000);
    } else {
      // Ancora in caricamento, riprova più tardi
      setTimeout(waitForMapLoaded, 500);
    }
  }
  
  // Inizia a monitorare il caricamento della mappa
  waitForMapLoaded();
})();
`;
