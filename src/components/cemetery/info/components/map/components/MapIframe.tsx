
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
  }, [mapUrl, forceRefresh]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    console.log("Map iframe loaded successfully");
  };

  const mapUrlWithParams = `${mapUrl}${mapUrl.includes('?') ? '&' : '?'}refresh=${forceRefresh}`;
  
  return (
    <div className="rounded-md overflow-hidden border border-border h-[400px] mt-2 relative">
      <iframe 
        ref={iframeRef}
        src={mapUrlWithParams}
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
          toast.error("Errore nel caricamento della mappa: API key non valida");
        }}
      ></iframe>
      
      {!iframeLoaded && <LoadingIndicator />}
    </div>
  );
};

export default MapIframe;
