
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Info, Calendar, Phone, Mail, Globe, Map } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface CemeteryInfoCardProps {
  cemetery: any;
}

const CemeteryInfoCard = ({ cemetery }: CemeteryInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informazioni Generali</CardTitle>
        <CardDescription>Dati principali e informazioni sul cimitero</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {cemetery.Descrizione && (
          <div>
            <h3 className="text-lg font-medium mb-2">Descrizione</h3>
            <p>{cemetery.Descrizione}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Indirizzo</h4>
                <p>{cemetery.Indirizzo || "Non disponibile"}</p>
                <p>{cemetery.city && cemetery.postal_code ? `${cemetery.city}, ${cemetery.postal_code}` : ""}</p>
                <p>{cemetery.state && cemetery.country ? `${cemetery.state}, ${cemetery.country}` : ""}</p>
              </div>
            </div>

            {cemetery.established_date && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Data di fondazione</h4>
                  <p>{formatDate(cemetery.established_date, "long")}</p>
                </div>
              </div>
            )}

            {cemetery.total_area_sqm && (
              <div className="flex items-start gap-3">
                <Map className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Area totale</h4>
                  <p>{cemetery.total_area_sqm} m²</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {cemetery.contact_info && cemetery.contact_info.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Telefono</h4>
                  <p>{cemetery.contact_info.phone}</p>
                </div>
              </div>
            )}

            {cemetery.contact_info && cemetery.contact_info.email && (
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p>{cemetery.contact_info.email}</p>
                </div>
              </div>
            )}

            {cemetery.contact_info && cemetery.contact_info.website && (
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Sito Web</h4>
                  <a href={cemetery.contact_info.website} target="_blank" rel="noopener noreferrer" 
                     className="text-primary hover:underline">
                    {cemetery.contact_info.website}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Stato</h4>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cemetery.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {cemetery.active ? 'Attivo' : 'Non attivo'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CemeteryInfoCard;
