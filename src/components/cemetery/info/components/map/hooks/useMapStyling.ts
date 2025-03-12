
import { useEffect } from "react";

export const useMapStyling = () => {
  useEffect(() => {
    // Hide the standard google maps copyright and terms text
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = `
      .gmnoprint a, .gmnoprint span, .gm-style-cc {
        display: none;
      }
      .gmnoprint div {
        background: none !important;
      }
    `;
    document.getElementsByTagName('head')[0].appendChild(styleElement);
    
    return () => {
      // Clean up the style element when component unmounts
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []);
};
