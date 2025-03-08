
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
        console.log("Applicazione stili e comportamenti all'iframe");
        try {
          // Try to access iframe content directly
          const iframeDocument = iframeRef.current.contentWindow.document;
          // Check if we have access - this will throw an error if restricted by CORS
          if (iframeDocument) {
            console.log("Accesso al documento iframe riuscito");
          }
        } catch (err) {
          console.log("Non è possibile accedere direttamente al documento dell'iframe a causa di restrizioni CORS", err);
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

  // Monitor iframe activity and fix potential issues
  useEffect(() => {
    if (!isLoading) {
      try {
        console.log("Configurazione monitoraggio iframe");
        
        // Create a function to handle messages from the iframe
        const handleMessage = (event: MessageEvent) => {
          if (event.origin.includes('servizicimiteriali.pesaro.aspes.it')) {
            console.log("Messaggio ricevuto dall'iframe:", event.data);
          }
        };
        
        // Add event listener for messages from the iframe
        window.addEventListener('message', handleMessage);
        
        // Cleanup function
        return () => {
          window.removeEventListener('message', handleMessage);
        };
      } catch (err) {
        console.error("Errore durante la configurazione del monitoraggio:", err);
      }
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
        
        <iframe 
          ref={iframeRef}
          src="https://servizicimiteriali.pesaro.aspes.it/public/defunto/cerca"
          title="Sistema di ricerca defunti"
          className="w-full h-full border-0 rounded"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

export default ExternalSearchFrame;
