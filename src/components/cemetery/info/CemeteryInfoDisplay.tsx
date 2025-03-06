
import { Card, CardContent } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import CemeteryTextSection from "./components/CemeteryTextSection";
import CemeteryLocationInfo from "./components/CemeteryLocationInfo";
import CemeteryContactInfo from "./components/CemeteryContactInfo";
import CemeteryFacilities from "./components/CemeteryFacilities";
import CemeteryMapSection from "./components/CemeteryMapSection";

interface CemeteryInfoDisplayProps {
  cemetery: any;
  onEditClick: () => void;
}

const CemeteryInfoDisplay = ({ cemetery, onEditClick }: CemeteryInfoDisplayProps) => {
  const { user } = useAuth();
  const canEdit = !!user;

  return (
    <Card className="w-full shadow-sm relative mx-auto">
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-6">
          <CemeteryTextSection title="Descrizione" content={cemetery.Descrizione} />
          <CemeteryTextSection title="Note" content={cemetery.Note} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <CemeteryLocationInfo cemetery={cemetery} />
            <CemeteryContactInfo contactInfo={cemetery.contact_info} />
          </div>

          <CemeteryFacilities cemetery={cemetery} />
          <CemeteryMapSection cemeteryId={cemetery.Id} />
        </div>
      </CardContent>
      
      {canEdit && (
        <Button 
          onClick={onEditClick}
          size="icon"
          variant="secondary"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-md z-10 bg-primary-light hover:bg-primary-dark text-white transition-all duration-300"
        >
          <Edit className="h-5 w-5" />
        </Button>
      )}
    </Card>
  );
};

export default CemeteryInfoDisplay;
