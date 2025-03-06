
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LoadingIndicator from "./LoadingIndicator";
import { injectSingleFingerPanScript } from "../mapUtils";

interface MapIframeProps {
  mapUrl: string;
  forceRefresh: number;
}

const MapIframe: React.FC<MapIframeProps> = ({ mapUrl, forceRefresh }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeId = "cemetery-map-iframe";
  
  useEffect(() => {
    setIframeLoaded(false);
    
    // When forceRefresh changes, we reload the iframe directly
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
    
    // Inject the single finger pan script
    injectSingleFingerPanScript(iframeId);
    
    // Attempt to inject styles into the iframe to customize the appearance
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        // Create a style element to hide specific Google Maps elements
        const styleEl = iframeDoc.createElement('style');
        styleEl.textContent = `
          /* Hide Google logo and terms */
          .gmnoprint, .gm-style-cc, .gm-style a[href^="https://maps.google.com"] {
            display: none !important;
          }
          
          /* Hide the coordinate overlay */
          .gm-iv-address, .gm-iv-short-address {
            display: none !important;
          }
          
          /* Hide the bottom-left panel */
          .gm-style-mtc, .gm-bundled-control {
            display: none !important;
          }
          
          /* Enable gesture handling for single touch */
          .gm-control-active {
            touch-action: pan-x pan-y !important;
          }
          
          /* Additional selectors to hide more UI elements */
          .gm-style .gm-style-iw, .gm-style-iw-c, .gm-style-iw-d {
            display: none !important;
          }
          
          /* Hide all control elements */
          .gm-ui-hover-effect, .gm-fullscreen, .gm-svpc, .gm-control-active {
            display: none !important;
          }
        `;
        
        iframeDoc.head.appendChild(styleEl);
      }
    } catch (e) {
      console.warn("Could not customize map appearance due to cross-origin restrictions:", e);
    }
  };
  
  return (
    <div className="rounded-md overflow-hidden border border-border h-[400px] mt-2 relative">
      <iframe 
        id={iframeId}
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
