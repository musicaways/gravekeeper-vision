
import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, RefreshCw, Smartphone, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const ExternalSearchFrame: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMode, setMobileMode] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleIframeLoad = () => {
    setIsLoading(false);
    console.log("Iframe caricato con successo");
    
    if (iframeRef.current) {
      try {
        // Tenta di osservare i cambiamenti nel contenuto dell'iframe
        const iframeDocument = iframeRef.current.contentDocument || 
          (iframeRef.current.contentWindow && iframeRef.current.contentWindow.document);
          
        if (iframeDocument) {
          console.log("Accesso al documento dell'iframe ottenuto");
          
          // Osserva i cambiamenti per rilevare quando avviene il caricamento
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              console.log("Rilevata mutazione nel DOM dell'iframe:", mutation.type);
              
              // Cerca l'elemento di caricamento
              const loadingElement = iframeDocument.querySelector('.loading-overlay');
              if (loadingElement) {
                console.log("Elemento di caricamento trovato:", loadingElement);
              }
              
              // Cerca il form di ricerca
              const searchForm = iframeDocument.querySelector('form');
              if (searchForm) {
                console.log("Form di ricerca trovato:", searchForm);
                
                // Intercetta il submit del form
                searchForm.addEventListener('submit', (e) => {
                  console.log("Intercettato submit del form");
                  // Non preveniamo l'evento predefinito per consentire il submit normale
                });
              }
            });
          });
          
          // Configura l'observer per monitorare tutto il documento
          observer.observe(iframeDocument.body, {
            childList: true,
            subtree: true,
            attributes: true
          });
          
          console.log("MutationObserver configurato con successo");
        }
      } catch (err) {
        console.error("Errore durante l'accesso al documento dell'iframe:", err);
      }
    }
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
    
    setTimeout(handleRefresh, 500);
  };

  // Generiamo un ID univoco per la popup
  const popupId = "search-popup-" + Math.random().toString(36).substring(2, 9);
  
  const openPopupWindow = () => {
    const width = 800;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    // Apri la finestra popup con le dimensioni specificate
    const popup = window.open(
      "https://servizicimiteriali.pesaro.aspes.it/public/defunto/cerca", 
      popupId,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
    
    if (popup) {
      // Comunica con la popup
      popup.onload = () => {
        console.log("Popup caricata correttamente");
        
        // Tenta di iniettare un cookie di sessione o un token
        try {
          popup.postMessage({ type: "INIT_FROM_PARENT" }, "*");
        } catch (err) {
          console.error("Errore nel comunicare con la popup:", err);
        }
      };
      
      // Controlla quando la popup viene chiusa
      const checkPopupInterval = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupInterval);
          console.log("Popup chiusa dall'utente");
          toast({
            title: "Finestra di ricerca chiusa",
            description: "La finestra di ricerca esterna è stata chiusa"
          });
        }
      }, 1000);
      
      toast({
        title: "Ricerca aperta in finestra dedicata",
        description: "Una finestra dedicata è stata aperta per la ricerca senza limitazioni"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Popup bloccata",
        description: "Il browser ha bloccato l'apertura della finestra. Controlla le impostazioni del browser."
      });
    }
  };
  
  // Per dispositivi mobili, mostriamo un foglio scorrevole invece di un iframe
  const renderMobileSheet = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          <Share2 className="h-4 w-4 mr-2" />
          Apri ricerca in modalità mobile
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] p-0">
        <div className="p-4 border-b">
          <SheetHeader>
            <SheetTitle>Ricerca defunti</SheetTitle>
            <SheetDescription>
              Sistema di ricerca esterno in modalità mobile
            </SheetDescription>
          </SheetHeader>
        </div>
        <iframe 
          src="https://servizicimiteriali.pesaro.aspes.it/public/defunto/cerca"
          className="w-full h-full border-0"
          allow="forms"
          referrerPolicy="no-referrer"
        />
      </SheetContent>
    </Sheet>
  );

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
      
      <div className="bg-amber-50/30 p-3 mb-4 mx-4 rounded border border-amber-200 text-amber-800">
        <p className="text-sm">
          Per limitazioni tecniche del browser, non è possibile utilizzare completamente il modulo di ricerca in questa pagina.
          <br />
          <br />
          <strong>Soluzione consigliata:</strong> Utilizza il nuovo pulsante "Apri in finestra dedicata" che ti permette di utilizzare 
          il sistema di ricerca senza le limitazioni di sicurezza del browser.
        </p>
      </div>
      
      <div className="flex flex-col gap-4 mx-4 mb-6">
        <Button onClick={openPopupWindow} className="bg-primary hover:bg-primary/90">
          <ExternalLink className="h-4 w-4 mr-2" />
          Apri in finestra dedicata
        </Button>
        
        {isMobile && renderMobileSheet()}
      </div>
      
      <div className="relative" style={{ height: 'calc(100vh - 380px)', minHeight: '400px' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Mostriamo ancora l'iframe per consentire di vedere la pagina, ma consigliamo l'uso della popup */}
        <iframe 
          ref={iframeRef}
          src="https://servizicimiteriali.pesaro.aspes.it/public/defunto/cerca"
          title="Sistema di ricerca defunti"
          className="w-full h-full border-0 rounded"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          style={{ width: '100%' }}
          allow="forms scripts"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};

export default ExternalSearchFrame;
