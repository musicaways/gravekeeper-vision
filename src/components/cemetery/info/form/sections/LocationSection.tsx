
import React, { useState } from "react";
import { Control, useFormContext } from "react-hook-form";
import { AddressFields, CoordinateFields, AdditionalFields, MapSelectorDialog } from "./location";

interface LocationSectionProps {
  control: Control<any>;
  isGettingLocation: boolean;
  getGPSCoordinates: () => void;
}

const LocationSection = ({ 
  control,
  isGettingLocation,
  getGPSCoordinates
}: LocationSectionProps) => {
  const [showMapSelector, setShowMapSelector] = useState(false);
  const form = useFormContext();
  
  // Get current lat/lng values from the form to pass to the map selector
  const getInitialCoordinates = () => {
    const latValue = form.getValues('Latitudine');
    const lngValue = form.getValues('Longitudine');
    
    return {
      lat: latValue ? parseFloat(latValue) : undefined,
      lng: lngValue ? parseFloat(lngValue) : undefined
    };
  };
  
  const handleMapLocationSelect = (lat: number, lng: number) => {
    form.setValue('Latitudine', lat.toString(), { shouldValidate: true });
    form.setValue('Longitudine', lng.toString(), { shouldValidate: true });
    setShowMapSelector(false);
  };
  
  // Get initial coordinates for the map
  const { lat: initialLat, lng: initialLng } = getInitialCoordinates();
  
  return (
    <div className="space-y-4">
      <AddressFields control={control} />
      <CoordinateFields 
        control={control} 
        isGettingLocation={isGettingLocation} 
        getGPSCoordinates={getGPSCoordinates}
        onOpenMapSelector={() => setShowMapSelector(true)}
      />
      <AdditionalFields control={control} />
      
      <MapSelectorDialog 
        isOpen={showMapSelector} 
        onOpenChange={setShowMapSelector}
        onSelectLocation={handleMapLocationSelect}
        initialLat={initialLat}
        initialLng={initialLng}
      />
    </div>
  );
};

export default LocationSection;
