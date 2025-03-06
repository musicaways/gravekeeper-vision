
/**
 * Script da iniettare nell'iframe della mappa per catturare gli eventi dei marker
 * Questo script verrà eseguito all'interno dell'iframe di Google My Maps
 */

export const mapInteractionScript = `
(function() {
  console.log('Map interaction script injected and running');
  
  // Variabili di stato
  let selectedMarkerId = null;
  let lastClickedElement = null;
  
  // Funzione per intercettare i clic sui marker
  function setupMarkerListeners() {
    try {
      // Seleziona tutti gli elementi dei marker nella mappa
      // Utilizziamo selettori più specifici per Google My Maps
      const markers = document.querySelectorAll('.gmimap, .placemark, .waypoint, .marker, [role="button"], .gm-style-iw, .gm-style [tabindex="0"], img[src*="marker"], div[style*="marker"]');
      
      if (markers.length > 0) {
        console.log('Marker trovati nella mappa:', markers.length);
        
        markers.forEach(marker => {
          // Rimuove eventuali listener esistenti per evitare duplicati
          marker.removeEventListener('click', markerClickHandler);
          // Aggiungi il nuovo listener
          marker.addEventListener('click', markerClickHandler);
        });
      } else {
        console.log('Nessun marker trovato con i selettori specifici. Utilizzo selettori più generici...');
        
        // Se non abbiamo trovato marker con i selettori specifici, utilizziamo un approccio più generico
        document.querySelectorAll('a, div, img').forEach(el => {
          el.addEventListener('click', documentClickHandler);
        });
      }
      
      // Aggiungi un listener generale ai clic sulla mappa
      document.addEventListener('click', documentClickHandler);
      
      // Aggiungiamo listener anche al cambiamento dell'URL
      watchUrlChanges();
    } catch (error) {
      console.error('Errore durante il setup dei listener dei marker:', error);
    }
  }
  
  // Monitora i cambiamenti dell'URL per rilevare la selezione di marker
  function watchUrlChanges() {
    let lastUrl = location.href;
    
    // Controlla subito l'URL iniziale
    checkUrlForMarkerId(lastUrl);
    
    const observer = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        checkUrlForMarkerId(lastUrl);
      }
    });
    
    observer.observe(document, { subtree: true, childList: true });
  }
  
  // Controlla l'URL per l'ID del marker
  function checkUrlForMarkerId(url) {
    const msidMatch = url.match(/[?&]msid=([^&#]*)/);
    if (msidMatch) {
      const markerId = msidMatch[1];
      if (markerId && markerId !== selectedMarkerId) {
        selectedMarkerId = markerId;
        console.log('ID marker trovato nell\\'URL:', markerId);
        sendMarkerSelectedMessage(markerId);
      }
    }
  }
  
  // Handler per i clic sui marker
  function markerClickHandler(event) {
    try {
      // Memorizza l'elemento cliccato
      lastClickedElement = event.target;
      console.log('Elemento marker cliccato:', event.target);
      
      // Prova a ottenere l'ID del marker
      extractAndSendMarkerId(event);
      
      // Aggiungi un controllo dell'URL dopo un breve ritardo per rilevare cambiamenti nell'URL
      setTimeout(() => {
        checkUrlForMarkerId(location.href);
      }, 300);
    } catch (err) {
      console.error('Errore nel gestore clic del marker:', err);
    }
  }
  
  // Handler per i clic generici sul documento
  function documentClickHandler(event) {
    // Memorizza l'elemento cliccato
    lastClickedElement = event.target;
    
    // Verifica se il clic potrebbe essere su un marker o su un elemento correlato
    setTimeout(() => {
      // Attendi che eventuali popup si aprano
      const popups = document.querySelectorAll('.gm-style-iw, .feature-popup');
      if (popups.length > 0) {
        console.log('Popup aperto dopo il clic - possibile marker');
        // È stato cliccato probabilmente un marker, prova a estrarre l'ID
        extractAndSendMarkerId(event);
        
        // Controlla anche l'URL per eventuali ID marker
        checkUrlForMarkerId(location.href);
      }
      
      // Controlla comunque l'URL in ogni caso
      checkUrlForMarkerId(location.href);
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
      console.log('ID marker trovato nell\\'URL:', markerId);
    }
    
    // Se non trovato nell'URL, cerca negli attributi dell'elemento
    if (!markerId && event.target) {
      // Cerca gli attributi data-* o altre proprietà che potrebbero contenere l'ID
      markerId = event.target.getAttribute('data-marker-id') || 
                 event.target.getAttribute('data-feature-id') ||
                 event.target.getAttribute('data-id') ||
                 event.target.id;
      
      if (markerId) {
        console.log('ID marker trovato negli attributi dell\\'elemento:', markerId);
      }
      
      // Se ancora non trovato, cerca nel parent element
      if (!markerId) {
        const parent = event.target.closest('[data-marker-id], [data-feature-id], [data-id]');
        if (parent) {
          markerId = parent.getAttribute('data-marker-id') || 
                     parent.getAttribute('data-feature-id') ||
                     parent.getAttribute('data-id') ||
                     parent.id;
          
          if (markerId) {
            console.log('ID marker trovato negli attributi del parent:', markerId);
          }
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
            console.log('ID marker trovato nel link del popup:', markerId);
          }
        }
        
        // Se ancora non abbiamo trovato l'ID, prova a cercarlo nel testo del popup
        if (!markerId) {
          const popupContent = popup.textContent || '';
          const idMatches = popupContent.match(/ID:?\\s*(\\S+)/i);
          if (idMatches && idMatches[1]) {
            markerId = idMatches[1];
            console.log('ID marker trovato nel testo del popup:', markerId);
          }
        }
      }
    }
    
    // Se abbiamo un ID, invia un messaggio al frame principale
    if (markerId) {
      sendMarkerSelectedMessage(markerId);
    } else {
      console.log('Nessun ID marker trovato nel clic');
      
      // Come ultima risorsa, prova a usare il testo visualizzato nel popup come ID
      const popups = document.querySelectorAll('.gm-style-iw');
      if (popups.length > 0) {
        const popup = popups[0];
        const titleElements = popup.querySelectorAll('h1, h2, h3, h4, h5, h6, .title, strong, b');
        
        if (titleElements.length > 0) {
          const title = titleElements[0].textContent?.trim();
          if (title) {
            console.log('Usando il titolo del marker come ID fallback:', title);
            sendMarkerSelectedMessage(title);
          }
        }
      }
    }
  }
  
  // Funzione per inviare il messaggio di selezione marker
  function sendMarkerSelectedMessage(markerId) {
    // Verifica che l'ID non sia già stato selezionato
    if (markerId !== selectedMarkerId) {
      selectedMarkerId = markerId;
      console.log('Inviando ID marker selezionato al parent frame:', markerId);
      
      // Invia il messaggio al frame principale
      window.parent.postMessage(JSON.stringify({
        type: 'markerSelected',
        markerId: markerId
      }), '*');
      
      // Evidenzia visivamente il popup se possibile
      highlightSelectedMarker();
    }
  }
  
  // Funzione per evidenziare visivamente il marker selezionato
  function highlightSelectedMarker() {
    try {
      const popups = document.querySelectorAll('.gm-style-iw');
      if (popups.length > 0) {
        popups[0].style.border = '3px solid #4CAF50';
        popups[0].style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.6)';
      }
      
      if (lastClickedElement) {
        lastClickedElement.style.outline = '3px solid #4CAF50';
        lastClickedElement.style.outlineOffset = '2px';
      }
    } catch (e) {
      console.error('Errore nell\\'evidenziare il marker:', e);
    }
  }
  
  // Funzione per rilevare quando la mappa è completamente caricata
  function waitForMapLoaded() {
    if (document.readyState === 'complete') {
      console.log('Documento caricato, configurazione listener...');
      // La pagina è completamente caricata, attendi un po' per i marker
      setTimeout(setupMarkerListeners, 1000);
      
      // Continua a monitorare eventuali cambiamenti nella mappa
      setInterval(setupMarkerListeners, 3000);
      
      // Controlla immediatamente l'URL per un eventuale ID marker
      checkUrlForMarkerId(location.href);
    } else {
      // Ancora in caricamento, riprova più tardi
      setTimeout(waitForMapLoaded, 500);
    }
  }
  
  // Notifica il parent che lo script è stato caricato
  console.log('Script per la mappa interattiva inizializzato');
  window.parent.postMessage(JSON.stringify({
    type: 'scriptLoaded',
    status: 'success'
  }), '*');
  
  // Inizia a monitorare il caricamento della mappa
  waitForMapLoaded();
})();
`;
