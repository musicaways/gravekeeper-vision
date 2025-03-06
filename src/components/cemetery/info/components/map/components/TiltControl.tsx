
import React from 'react';

export const createTiltControl = (
  controlDiv: HTMLDivElement,
  map: google.maps.Map
): HTMLDivElement => {
  // Set CSS for the control border
  const controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginTop = '10px';
  controlUI.style.marginRight = '10px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Clicca per attivare/disattivare la vista inclinata';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  const controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.lineHeight = '20px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = '3D';
  controlUI.appendChild(controlText);

  // Setup the click event listener
  let isTilted = false;
  
  // Custom event for tilt changes
  const dispatchTiltChangeEvent = () => {
    // Create and dispatch a custom event that can be listened to
    const event = new CustomEvent('tiltchange', { detail: { tilt: isTilted ? 45 : 0 } });
    document.dispatchEvent(event);
  };
  
  controlUI.addEventListener('click', () => {
    isTilted = !isTilted;
    if (isTilted) {
      // Set to 45 degrees for 3D view
      (map as any).setTilt(45);
      // When activating 3D, reset heading to 0 to avoid confusion
      (map as any).setHeading(0);
    } else {
      // Set to 0 degrees for 2D view
      (map as any).setTilt(0);
    }
    controlText.innerHTML = isTilted ? '2D' : '3D';
    
    // Notify other components about the tilt change
    dispatchTiltChangeEvent();
  });
  
  return controlUI;
};

export default createTiltControl;
