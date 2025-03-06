
/**
 * Create a marker for the cemetery location
 */
export const createCemeteryMarker = (
  position: google.maps.LatLngLiteral,
  map: google.maps.Map,
  title: string
): google.maps.Marker => {
  const markerOptions: google.maps.MarkerOptions = {
    position,
    map,
    animation: google.maps.Animation.DROP,
    title: title || 'Cimitero',
    // Use the standard Google Maps marker with purple color
    icon: {
      url: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
      scaledSize: new google.maps.Size(32, 32),
    }
  };
  
  return new google.maps.Marker(markerOptions);
};

/**
 * Create and attach an info window to a marker
 */
export const createInfoWindow = (
  marker: google.maps.Marker,
  map: google.maps.Map,
  cemetery: any
): google.maps.InfoWindow => {
  const { Nome, Latitudine, Longitudine, Indirizzo } = cemetery;
  
  const infoContent = `
    <div style="padding: 10px; max-width: 200px; font-family: 'Inter', sans-serif;">
      <h3 style="margin: 0 0 5px; font-size: 16px; color: #3b82f6;">${Nome || 'Cimitero'}</h3>
      <p style="margin: 5px 0; font-size: 13px; color: #4b5563;">
        Lat: ${Latitudine?.toFixed(6)}<br>
        Lng: ${Longitudine?.toFixed(6)}
      </p>
      ${Indirizzo ? `<p style="margin: 5px 0; font-size: 13px;">${Indirizzo}</p>` : ''}
    </div>
  `;
  
  const infoWindow = new google.maps.InfoWindow({
    content: infoContent,
    maxWidth: 250
  });
  
  // Show info window on marker click
  google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(map, marker);
  });
  
  return infoWindow;
};
