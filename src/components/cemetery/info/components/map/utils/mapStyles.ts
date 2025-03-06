
/**
 * Map styles for cemetery maps
 * Minimal style without roads and labels for a cleaner cemetery view
 */
export const cemeteryMapStyles = [
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#cbe8b9" }]
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#e8f5e9" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#bbdefb" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#c9c9c9" }, { weight: 0.8 }]
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }]
  }
];

/**
 * Default map configuration options
 */
export const getMapOptions = (position: google.maps.LatLngLiteral): google.maps.MapOptions => {
  return {
    center: position,
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.HYBRID,
    disableDefaultUI: true,
    scrollwheel: false,
    clickableIcons: false,
    styles: cemeteryMapStyles,
    gestureHandling: 'greedy', // Enable one-finger navigation
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: false // Remove zoom controls
  };
};
