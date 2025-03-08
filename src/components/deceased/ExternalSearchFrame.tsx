
import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ExternalSearchFrame: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const handleIframeLoad = () => {
    setIsLoading(false);
    applyIframeStyles();
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Impossibile caricare il sistema di ricerca esterno. Riprova più tardi.');
  };

  // Function to inject custom CSS into the iframe to hide unwanted elements
  // Note: This will only work if the iframe is from the same origin or has proper CORS settings
  const applyIframeStyles = () => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
        
        if (iframeDoc) {
          // Create style element
          const styleElement = document.createElement('style');
          styleElement.textContent = `
            /* Hide ASPES logo and headers */
            img[alt="Logo ASPES"], 
            h1, h2,
            .navbar, 
            .footer,
            .header-container {
              display: none !important;
            }
            
            /* Adjust spacing and container */
            body {
              padding-top: 0 !important;
              margin-top: 0 !important;
            }
            
            .container {
              padding-top: 0 !important;
              margin-top: 0 !important;
            }
            
            /* Hide any explanatory text */
            .alert-info {
              display: none !important;
            }
          `;
          
          // Try to append style to iframe head
          try {
            iframeDoc.head?.appendChild(styleElement);
            console.log("Successfully applied styles to iframe");
          } catch (e) {
            console.error("Cannot modify iframe content due to same-origin policy:", e);
          }
        }
      }
    } catch (err) {
      console.error("Error applying styles to iframe:", err);
    }
  };

  // Use a custom header instead of relying on the iframe content
  const CustomSearchHeader = () => (
    <div className="py-4 px-6 border-b">
      <h2 className="text-xl font-semibold">Ricerca Defunto</h2>
      <p className="text-sm text-muted-foreground">Inserisci i dati del defunto per la ricerca</p>
    </div>
  );

  useEffect(() => {
    // Add an additional attempt to apply styles when component mounts
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        applyIframeStyles();
      }
    }, 1500); // Delay to ensure iframe has loaded
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full">
      {error && (
        <Alert variant="destructive" className="mb-4 mx-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Errore</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="bg-card rounded-md shadow-sm overflow-hidden">
        <CustomSearchHeader />
        
        <div className="relative" style={{ height: 'calc(100vh - 220px)', minHeight: '600px' }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          )}
          
          <iframe 
            ref={iframeRef}
            src="https://servizicimiteriali.pesaro.aspes.it/public/defunto/cerca"
            title="Sistema di ricerca defunti"
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
          
          {/* Overlay message about iframe limitations */}
          <div className="absolute bottom-0 right-0 p-2 bg-background/80 text-xs text-muted-foreground rounded-tl-md">
            Sistema di ricerca esterno integrato
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalSearchFrame;
