
import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, RefreshCw } from 'lucide-react';

const ExternalSearchFrame: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const handleIframeLoad = () => {
    setIsLoading(false);
    console.log("Iframe caricato con successo");
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Impossibile caricare il sistema di ricerca esterno. Riprova più tardi.');
    console.error("Errore nel caricamento dell'iframe");
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    
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
  };

  useEffect(() => {
    const checkIframeFormSubmission = () => {
      try {
        if (iframeRef.current) {
          console.log("Monitoraggio iframe attivo");
          
          // Add message listener to catch any errors or events from the iframe
          window.addEventListener('message', (event) => {
            if (event.origin.includes('servizicimiteriali.pesaro.aspes.it')) {
              console.log("Messaggio ricevuto dall'iframe:", event.data);
            }
          });
        }
      } catch (err) {
        console.error("Errore durante il monitoraggio dell'iframe:", err);
      }
    };

    const timer = setTimeout(checkIframeFormSubmission, 2000);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('message', () => {});
    };
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
            Se il modulo di ricerca non funziona correttamente all'interno della pagina, utilizza il pulsante "Apri in una nuova scheda" per accedere direttamente al sistema di ricerca.
          </p>
        </div>
        
        <iframe 
          ref={iframeRef}
          src="https://servizicimiteriali.pesaro.aspes.it/public/defunto/cerca"
          title="Sistema di ricerca defunti"
          className="w-full h-full border-0 rounded"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>
    </div>
  );
};

export default ExternalSearchFrame;
