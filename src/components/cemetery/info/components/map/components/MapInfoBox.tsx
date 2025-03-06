
import React from "react";

const MapInfoBox: React.FC = () => {
  return (
    <div className="mt-2 bg-blue-50 border border-blue-200 p-3 rounded-md text-sm">
      <p className="text-blue-800">
        <strong>Info:</strong> Per modificare la posizione del cimitero sulla mappa, inserisci le coordinate geografiche
        (latitudine e longitudine) o l'indirizzo completo nella schermata di modifica.
      </p>
    </div>
  );
};

export default MapInfoBox;
