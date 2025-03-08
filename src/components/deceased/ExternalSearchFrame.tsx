
import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ExternalSearchFrame: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  
  const handleIframeLoad = () => {
    setIsLoading(false);
    console.log("Iframe caricato con successo");
    
    // Apply a delay to allow iframe to fully initialize
    setTimeout(() => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        console.log("Tentativo di abilitare funzionalità dell'iframe");
        
        try {
          // Try to enable form submission by posting a message to the iframe
          iframeRef.current.contentWindow.postMessage({
            type: 'ENABLE_FORM_SUBMISSION',
            origin: window.location.origin
          }, 'https://servizicimiteriali.pesaro.aspes.it');
          
          console.log("Messaggio inviato all'iframe per attivare funzionalità");
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
  
  // Try to support form submission through a proxy approach
  useEffect(() => {
    if (!isLoading) {
      // Message listener to detect activities in the iframe
      const handleMessage = (event: MessageEvent) => {
        if (event.origin.includes('servizicimiteriali.pesaro.aspes.it')) {
          console.log("Messaggio ricevuto dall'iframe:", event.data);
          
          // If we receive a form submission message, we could handle it here
          if (event.data?.type === 'FORM_SUBMIT') {
            console.log("Rilevata sottomissione del form");
          }
        }
      };
      
      window.addEventListener('message', handleMessage);
      
      // Monitor for any navigation events within the iframe
      const checkIframeStatus = setInterval(() => {
        if (iframeRef.current) {
          try {
            console.log("Monitoraggio stato iframe...");
            
            // Try to detect loading state changes indirectly
            const iframeEl = iframeRef.current;
            const isCurrentlyLoading = iframeEl.classList.contains('loading');
            
            if (isCurrentlyLoading !== isLoading) {
              setIsLoading(isCurrentlyLoading);
              console.log("Stato di caricamento dell'iframe aggiornato:", isCurrentlyLoading);
            }
          } catch (error) {
            console.error("Errore durante il monitoraggio dell'iframe:", error);
          }
        }
      }, 1000);
      
      return () => {
        window.removeEventListener('message', handleMessage);
        clearInterval(checkIframeStatus);
      };
    }
  }, [isLoading]);

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
          </p>
        </div>
        
        <iframe 
          ref={iframeRef}
          src="https://servizicimiteriali.pesaro.aspes.it/public/defunto/cerca"
          title="Sistema di ricerca defunti"
          className="w-full h-full border-0 rounded"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          style={{ width: '100%' }}
          allow="forms"
        />
      </div>
    </div>
  );
};

export default ExternalSearchFrame;
