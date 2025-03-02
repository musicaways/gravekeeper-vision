
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Mail, Phone, User, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CemeteryAdministrationProps {
  cemeteryId: string;
}

const CemeteryAdministration: React.FC<CemeteryAdministrationProps> = ({ cemeteryId }) => {
  // Mock data per l'amministrazione del cimitero
  const administrationInfo = {
    manager: "Comune di Milano - Dipartimento Servizi Cimiteriali",
    responsiblePerson: "Dott. Marco Bianchi",
    address: "Via Verdi 123, 20100 Milano",
    phone: "02 1234567",
    email: "servizi.cimiteriali@comune.milano.it",
    officeTimes: "Lun-Ven: 9:00-17:00",
    regulations: "Regolamento comunale n.45/2019"
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Amministrazione
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">Ente gestore</p>
              <p className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{administrationInfo.manager}</span>
              </p>
            </div>
            
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">Responsabile</p>
              <p className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{administrationInfo.responsiblePerson}</span>
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Indirizzo ufficio</p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{administrationInfo.address}</span>
                </p>
              </div>
              
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Orari ufficio</p>
                <p className="flex items-center gap-2">
                  <span>{administrationInfo.officeTimes}</span>
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Telefono</p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{administrationInfo.phone}</span>
                </p>
              </div>
              
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Email</p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{administrationInfo.email}</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex flex-col space-y-1 mb-4">
              <p className="text-sm font-medium">Regolamento</p>
              <p className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{administrationInfo.regulations}</span>
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Scarica regolamento
              </Button>
              <Button className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contatta amministrazione
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CemeteryAdministration;
