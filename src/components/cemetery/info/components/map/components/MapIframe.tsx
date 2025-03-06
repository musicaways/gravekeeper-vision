
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LoadingIndicator from "./LoadingIndicator";

interface MapIframeProps {
  mapUrl: string;
  forceRefresh: number;
}

const MapIframe: React.FC<MapIframeProps> = ({ mapUrl, forceRefresh }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  
  useEffect(() => {
    setIframeLoaded(false);
    
    // When forceRefresh changes, we reload the iframe directly instead of
    // adding a refresh parameter to the URL
    if (iframeRef.current) {
      try {
        // Access the contentWindow and reload it
        const frameWindow = iframeRef.current.contentWindow;
        if (frameWindow) {
          frameWindow.location.reload();
        }
      } catch (error) {
        console.error("Error reloading iframe:", error);
      }
    }
  }, [forceRefresh]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    console.log("Map iframe loaded successfully");
  };
  
  return (
    <div className="rounded-md overflow-hidden border border-border h-[400px] mt-2 relative">
      <iframe 
        ref={iframeRef}
        src={mapUrl}
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen={false} 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Mappa del cimitero"
        onLoad={handleIframeLoad}
        onError={(e) => {
          console.error("Map iframe loading error:", e);
          toast.error("Errore nel caricamento della mappa");
        }}
      ></iframe>
      
      {!iframeLoaded && <LoadingIndicator />}
    </div>
  );
};

export default MapIframe;
