
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Phone, Mail, Globe, Map, Check, X, Edit } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface CemeteryInfoCardProps {
  cemetery: any;
}

const CemeteryInfoCard = ({ cemetery }: CemeteryInfoCardProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Helper function to render boolean fields with Yes/No icons
  const renderBooleanField = (label: string, value: boolean | null | undefined) => {
    if (value === null || value === undefined) return null;
    
    return (
      <div className="flex items-start gap-3">
        {value ? 
          <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" /> : 
          <X className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
        }
        <div>
          <h4 className="font-medium">{label}</h4>
          <p className="text-sm md:text-base">{value ? 'Sì' : 'No'}</p>
        </div>
      </div>
    );
  };

  // Check if any additional facilities exist to determine column layout
  const hasFacilities = cemetery.ricevimento_salme !== null || 
                      cemetery.chiesa !== null || 
                      cemetery.camera_mortuaria !== null || 
                      cemetery.cavalletti !== null || 
                      cemetery.impalcatura !== null;

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // In a real implementation, this would open an edit form
    // For now, we're just toggling the state
  };

  // Only show edit button if user is logged in (we'd need more robust permission checks in a real app)
  const canEdit = !!user;

  return (
    <Card className="w-full shadow-sm relative">
      {canEdit && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute top-2 right-2 z-10" 
          onClick={handleEditToggle}
        >
          <Edit className="h-4 w-4 mr-1" />
          <span className="text-xs">Modifica</span>
        </Button>
      )}
      <CardContent className="space-y-6 pt-6">
        {cemetery.Descrizione && (
          <div>
            <h3 className="text-lg font-medium mb-2">Descrizione</h3>
            <p className="text-sm md:text-base">{cemetery.Descrizione}</p>
          </div>
        )}
        
        {cemetery.Note && (
          <div>
            <h3 className="text-lg font-medium mb-2">Note</h3>
            <p className="text-sm md:text-base">{cemetery.Note}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium">Indirizzo</h4>
                <p className="text-sm md:text-base">{cemetery.Indirizzo || "Non disponibile"}</p>
                <p className="text-sm md:text-base">{cemetery.city && cemetery.postal_code ? `${cemetery.city}, ${cemetery.postal_code}` : ""}</p>
                <p className="text-sm md:text-base">{cemetery.state && cemetery.country ? `${cemetery.state}, ${cemetery.country}` : ""}</p>
              </div>
            </div>

            {cemetery.established_date && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium">Data di fondazione</h4>
                  <p className="text-sm md:text-base">{formatDate(cemetery.established_date, "long")}</p>
                </div>
              </div>
            )}

            {cemetery.total_area_sqm && (
              <div className="flex items-start gap-3">
                <Map className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium">Area totale</h4>
                  <p className="text-sm md:text-base">{cemetery.total_area_sqm} m²</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {cemetery.contact_info && cemetery.contact_info.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium">Telefono</h4>
                  <p className="text-sm md:text-base">{cemetery.contact_info.phone}</p>
                </div>
              </div>
            )}

            {cemetery.contact_info && cemetery.contact_info.email && (
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-sm md:text-base break-words">{cemetery.contact_info.email}</p>
                </div>
              </div>
            )}

            {cemetery.contact_info && cemetery.contact_info.website && (
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium">Sito Web</h4>
                  <a href={cemetery.contact_info.website} target="_blank" rel="noopener noreferrer" 
                     className="text-sm md:text-base text-primary hover:underline break-words">
                    {cemetery.contact_info.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional facilities section - only shown if at least one facility is defined */}
        {hasFacilities && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Strutture e servizi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {renderBooleanField("Ricevimento salme", cemetery.ricevimento_salme)}
              {renderBooleanField("Chiesa", cemetery.chiesa)}
              {renderBooleanField("Camera mortuaria", cemetery.camera_mortuaria)}
              {renderBooleanField("Cavalletti", cemetery.cavalletti)}
              {renderBooleanField("Impalcatura", cemetery.impalcatura)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CemeteryInfoCard;
