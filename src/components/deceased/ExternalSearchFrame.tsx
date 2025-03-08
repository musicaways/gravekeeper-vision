
import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

  // Monitoraggio eventi del form e debug
  useEffect(() => {
    const checkIframeFormSubmission = () => {
      try {
        if (iframeRef.current) {
          console.log("Monitoraggio iframe attivo");
        }
      } catch (err) {
        console.error("Errore durante il monitoraggio dell'iframe:", err);
      }
    };

    const timer = setTimeout(checkIframeFormSubmission, 2000);
    return () => clearTimeout(timer);
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
      
      <div className="relative" style={{ height: 'calc(100vh - 160px)', minHeight: '600px' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        )}
        
        <iframe 
          ref={iframeRef}
          src="https://servizicimiteriali.pesaro.aspes.it/public/defunto/cerca"
          title="Sistema di ricerca defunti"
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>
    </div>
  );
};

export default ExternalSearchFrame;
