
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Map, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBlockMap } from "./hooks/useBlockMap";
import BlockMapImage from "./components/BlockMapImage";
import BlockMapEmpty from "./components/BlockMapEmpty";

interface BlockMapDisplayProps {
  block: any;
}

const BlockMapDisplay: React.FC<BlockMapDisplayProps> = ({ block }) => {
  const { mapUrl, loading, error } = useBlockMap(block);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="px-4 md:px-6 py-4 md:py-6">
        <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
          <Map className="h-5 w-5" />
          Mappa del blocco
        </h3>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <span className="ml-2">Caricamento mappa...</span>
          </div>
        ) : mapUrl && !imageError ? (
          <BlockMapImage mapUrl={mapUrl} onError={handleImageError} />
        ) : (
          <BlockMapEmpty />
        )}
      </CardContent>
    </Card>
  );
};

export default BlockMapDisplay;
