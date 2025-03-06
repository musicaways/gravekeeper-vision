
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
      // Utilizziamo selettori più specifici per Google My Maps
      const markers = document.querySelectorAll('.gmimap, .placemark, .waypoint, .marker, .gm-style-iw, [role="button"]');
      
      if (markers.length > 0) {
        console.log('Marker trovati nella mappa:', markers.length);
        
        markers.forEach(marker => {
          // Rimuove eventuali listener esistenti per evitare duplicati
          marker.removeEventListener('click', markerClickHandler);
          // Aggiungi il nuovo listener
          marker.addEventListener('click', markerClickHandler);
        });
      } else {
        console.log('Nessun marker trovato nella mappa. Riproverò tra poco...');
      }
      
      // Aggiungi anche un listener generale ai clic sulla mappa
      document.addEventListener('click', documentClickHandler);
    } catch (error) {
      console.error('Errore durante il setup dei listener dei marker:', error);
    }
  }
  
  // Handler per i clic sui marker
  function markerClickHandler(event) {
    try {
      // Prova a ottenere l'ID del marker
      extractAndSendMarkerId(event);
    } catch (err) {
      console.error('Errore nel gestore clic del marker:', err);
    }
  }
  
  // Handler per i clic generici sul documento
  function documentClickHandler(event) {
    // Verifica se il clic potrebbe essere su un marker o su un elemento correlato
    setTimeout(() => {
      // Attendi che eventuali popup si aprano
      const popups = document.querySelectorAll('.gm-style-iw, .feature-popup');
      if (popups.length > 0) {
        // È stato cliccato probabilmente un marker, prova a estrarre l'ID
        extractAndSendMarkerId(event);
      }
    }, 300);
  }
  
  // Funzione per estrarre e inviare l'ID del marker
  function extractAndSendMarkerId(event) {
    // Estrai l'ID del marker dall'URL corrente o dall'elemento
    let markerId = '';
    
    // Cerca nell'URL
    const url = window.location.href;
    const msidMatch = url.match(/[?&]msid=([^&#]*)/);
    if (msidMatch) {
      markerId = msidMatch[1];
    }
    
    // Se non trovato nell'URL, cerca negli attributi dell'elemento
    if (!markerId && event.target) {
      // Cerca gli attributi data-* o altre proprietà che potrebbero contenere l'ID
      markerId = event.target.getAttribute('data-marker-id') || 
                 event.target.getAttribute('data-feature-id') ||
                 event.target.getAttribute('data-id');
      
      // Se ancora non trovato, cerca nel parent element
      if (!markerId) {
        const parent = event.target.closest('[data-marker-id], [data-feature-id], [data-id]');
        if (parent) {
          markerId = parent.getAttribute('data-marker-id') || 
                     parent.getAttribute('data-feature-id') ||
                     parent.getAttribute('data-id');
        }
      }
    }
    
    // Cerca anche nei popup aperti
    if (!markerId) {
      const popups = document.querySelectorAll('.gm-style-iw');
      if (popups.length > 0) {
        // Prova a estrarre l'ID dal contenuto o dall'URL
        const popup = popups[0];
        const links = popup.querySelectorAll('a[href*="msid"]');
        if (links.length > 0) {
          const href = links[0].getAttribute('href');
          const popupMsidMatch = href?.match(/[?&]msid=([^&#]*)/);
          if (popupMsidMatch) {
            markerId = popupMsidMatch[1];
          }
        }
      }
    }
    
    // Se abbiamo un ID, invia un messaggio al frame principale
    if (markerId) {
      console.log('Marker selezionato con ID:', markerId);
      window.parent.postMessage(JSON.stringify({
        type: 'markerSelected',
        markerId: markerId
      }), '*');
    } else {
      console.log('Nessun ID marker trovato nel clic');
    }
  }
  
  // Funzione per rilevare quando la mappa è completamente caricata
  function waitForMapLoaded() {
    if (document.readyState === 'complete') {
      // La pagina è completamente caricata, attendi un po' per i marker
      setTimeout(setupMarkerListeners, 1500);
      
      // Continua a monitorare eventuali cambiamenti nella mappa
      setInterval(setupMarkerListeners, 3000);
    } else {
      // Ancora in caricamento, riprova più tardi
      setTimeout(waitForMapLoaded, 500);
    }
  }
  
  // Notifica il parent che lo script è stato caricato
  window.parent.postMessage(JSON.stringify({
    type: 'scriptLoaded'
  }), '*');
  
  // Inizia a monitorare il caricamento della mappa
  waitForMapLoaded();
})();
`;
