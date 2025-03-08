
import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, RefreshCw, Smartphone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const ExternalSearchFrame: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMode, setMobileMode] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleIframeLoad = () => {
    setIsLoading(false);
    console.log("Iframe caricato con successo");
    
    // Apply a delay to allow iframe to fully initialize
    setTimeout(() => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        console.log("Tentativo di abilitare funzionalità dell'iframe");
        
        try {
          // Try to interact with the iframe using a different approach
          // We'll use direct postMessage with some more detailed data
          iframeRef.current.contentWindow.postMessage({
            type: 'BYPASS_RESTRICTIONS',
            action: 'ENABLE_FORM_SUBMISSION',
            userAgent: navigator.userAgent,
            isMobileEmulation: mobileMode,
            origin: window.location.origin,
            timestamp: Date.now()
          }, '*'); // Use wildcard to bypass domain restrictions
          
          console.log("Messaggio inviato all'iframe con nuova strategia");
          
          // Try to directly interact with iframe document if possible
          if (iframeRef.current.contentDocument) {
            const forms = iframeRef.current.contentDocument.querySelectorAll('form');
            console.log(`Trovati ${forms.length} form nell'iframe`);
            
            // Try to modify forms to bypass restrictions
            forms.forEach((form, index) => {
              form.setAttribute('target', '_blank');
              console.log(`Form ${index} modificato per aprirsi in una nuova finestra`);
            });
          }
        } catch (err) {
          console.error("Errore durante l'interazione con l'iframe:", err);
        }
      }
    }, 1000);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Impossibile caricare il sistema di ricerca esterno. Riprova più tardi.');
    console.error("Errore nel caricamento dell'iframe");
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    toast({
      title: "Ricaricamento in corso",
      description: "La pagina di ricerca sta venendo ricaricata"
    });
    
    // Force iframe to reload
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 100);
    }
  };

  const handleOpenInNewTab = () => {
    window.open("https://servizicimiteriali.pesaro.aspes.it/public/defunto/cerca", "_blank");
    toast({
      title: "Pagina aperta",
      description: "Il sistema di ricerca è stato aperto in una nuova scheda"
    });
  };
  
  const toggleMobileMode = () => {
    setMobileMode(!mobileMode);
    setIsLoading(true);
    
    toast({
      title: mobileMode ? "Modalità desktop attivata" : "Modalità mobile attivata",
      description: "La pagina verrà ricaricata con la nuova modalità"
    });
    
    // Force iframe to reload with the new mode
    setTimeout(handleRefresh, 500);
  };
  
  // Create a srcDoc with custom HTML that might bypass restrictions
  const generateSrcDoc = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${mobileMode ? '<meta name="theme-color" content="#ffffff">' : ''}
          <title>Sistema di ricerca defunti</title>
          <style>
            body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
            iframe { width: 100%; height: 100%; border: none; }
          </style>
        </head>
        <body>
          <iframe 
            src="https://servizicimiteriali.pesaro.aspes.it/public/defunto/cerca" 
            width="100%" 
            height="100%" 
            style="border:none;"
            allow="forms" 
            referrerpolicy="no-referrer"
            ${mobileMode ? 'sandbox="allow-same-origin allow-scripts allow-forms allow-popups"' : ''}
          ></iframe>
          <script>
            // Set a custom user agent to appear as a mobile device
            if (${mobileMode}) {
              try {
                Object.defineProperty(navigator, 'userAgent', {
                  get: function() { return 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1'; }
                });
              } catch(e) { console.error('Failed to override userAgent', e); }
            }
            
            // Listen for form submissions and redirect them
            document.addEventListener('submit', function(e) {
              console.log('Form submit captured');
              const form = e.target;
              // Allow the form to submit normally but also notify the parent
              window.parent.postMessage({
                type: 'FORM_SUBMIT',
                formAction: form.action,
                formData: new FormData(form)
              }, '*');
            }, true);
            
            // Listen for navigation events
            window.addEventListener('click', function(e) {
              const a = e.target.closest('a');
              if (a) {
                console.log('Link click captured:', a.href);
                window.parent.postMessage({
                  type: 'LINK_CLICK',
                  href: a.href
                }, '*');
              }
            }, true);
          </script>
        </body>
      </html>
    `;
  };
  
  // Monitor iframe activity with better logging
  useEffect(() => {
    if (!isLoading) {
      // Message listener to detect activities in the iframe
      const handleMessage = (event: MessageEvent) => {
        console.log("Messaggio ricevuto:", event.origin, event.data);
        
        // Handle form submissions from our nested iframe
        if (event.data?.type === 'FORM_SUBMIT') {
          console.log("Rilevata sottomissione del form:", event.data);
          setIsLoading(true); // Show loading indicator
          
          // Wait a bit and then check if the iframe content has changed
          setTimeout(() => {
            setIsLoading(false);
          }, 3000);
        }
        
        // Handle link clicks from our nested iframe
        if (event.data?.type === 'LINK_CLICK') {
          console.log("Rilevato click su link:", event.data);
          setIsLoading(true); // Show loading indicator
          
          // Wait a bit and then check if the iframe content has changed
          setTimeout(() => {
            setIsLoading(false);
          }, 3000);
        }
      };
      
      window.addEventListener('message', handleMessage);
      
      // Create a more sophisticated monitoring system
      const monitorIframe = () => {
        if (!iframeRef.current) return;
        
        try {
          console.log("Monitoraggio stato iframe...");
          
          // Try to detect if iframe is in a loading state by checking its attributes
          const iframeEl = iframeRef.current;
          const currentSrc = iframeEl.src || '';
          
          // Check if there's a srcDoc (our custom HTML approach)
          if (iframeEl.getAttribute('srcdoc')) {
            // For srcDoc approach, we can only rely on our custom messages
            console.log("Usando approccio srcDoc, attendendo messaggi...");
          }
          
          // Log current iframe properties
          console.log("Stato iframe:", {
            readyState: document.readyState,
            iframeHeight: iframeEl.offsetHeight,
            iframeVisible: iframeEl.offsetParent !== null,
            currentSrc
          });
        } catch (error) {
          console.error("Errore durante il monitoraggio dell'iframe:", error);
        }
      };
      
      const monitorInterval = setInterval(monitorIframe, 2000);
      
      return () => {
        window.removeEventListener('message', handleMessage);
        clearInterval(monitorInterval);
      };
    }
  }, [isLoading, mobileMode]);

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4 mx-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Errore</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-xl font-semibold">Sistema di ricerca defunti esterno</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={toggleMobileMode}>
            <Smartphone className="h-4 w-4 mr-2" />
            {mobileMode ? "Modalità desktop" : "Modalità mobile"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Ricarica
          </Button>
          <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Apri in una nuova scheda
          </Button>
        </div>
      </div>
      
      <div className="relative" style={{ height: 'calc(100vh - 220px)', minHeight: '600px' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        )}
        
        <div className="bg-amber-50/30 p-3 mb-4 mx-4 rounded border border-amber-200 text-amber-800">
          <p className="text-sm">
            Per limitazioni tecniche del browser, potrebbe non essere possibile utilizzare il modulo di ricerca direttamente in questa pagina. 
            Se la ricerca non funziona, utilizza il pulsante "Apri in una nuova scheda" per accedere direttamente al sistema di ricerca.
            <br />
            <br />
            <strong>Prova la nuova modalità mobile</strong> che potrebbe aggirare alcune restrizioni.
          </p>
        </div>
        
        {/* Use either srcDoc approach or regular iframe depending on the mode */}
        {mobileMode ? (
          <iframe 
            ref={iframeRef}
            srcDoc={generateSrcDoc()}
            title="Sistema di ricerca defunti (modalità mobile)"
            className="w-full h-full border-0 rounded"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ width: '100%' }}
            allow="forms"
          />
        ) : (
          <iframe 
            ref={iframeRef}
            src="https://servizicimiteriali.pesaro.aspes.it/public/defunto/cerca"
            title="Sistema di ricerca defunti"
            className="w-full h-full border-0 rounded"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ width: '100%' }}
            allow="forms"
            referrerPolicy="no-referrer"
          />
        )}
      </div>
    </div>
  );
};

export default ExternalSearchFrame;
