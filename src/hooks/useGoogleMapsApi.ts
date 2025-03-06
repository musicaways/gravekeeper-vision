
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    googleMapsCallback?: () => void;
  }
}

export function useGoogleMapsApi() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Function to load Google Maps API
    const loadGoogleMapsApi = async () => {
      try {
        // Get the API key from local storage
        const apiKey = localStorage.getItem('googleMapsApiKey');
        
        if (!apiKey) {
          throw new Error('Chiave API di Google Maps non trovata. Impostala nelle impostazioni.');
        }

        // Define a callback function that Google Maps will call when loaded
        window.googleMapsCallback = () => {
          setIsLoaded(true);
          console.log('Google Maps API loaded successfully');
        };

        // Add the Google Maps script to the page
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=googleMapsCallback&libraries=places&language=it`;
        script.async = true;
        script.defer = true;
        
        // Error handling
        script.onerror = () => {
          setIsError(true);
          setLoadingError('Impossibile caricare l\'API di Google Maps. Controlla la connessione e la chiave API.');
          console.error('Google Maps API loading error');
        };

        document.head.appendChild(script);

        return () => {
          // Clean up
          if (window.googleMapsCallback) {
            delete window.googleMapsCallback;
          }
          document.head.removeChild(script);
        };
      } catch (error) {
        setIsError(true);
        setLoadingError(error instanceof Error ? error.message : 'Errore sconosciuto durante il caricamento di Google Maps');
        console.error('Error setting up Google Maps API:', error);
      }
    };

    loadGoogleMapsApi();
  }, []);

  return { isLoaded, isError, loadingError };
}
