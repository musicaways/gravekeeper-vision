
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CemeteryInfoCard from "./CemeteryInfoCard";
import { CemeterySectionsTab } from "./CemeterySectionsTab";
import { CemeteryDeceasedTab } from "./CemeteryDeceasedTab";
import CemeteryHours from "./CemeteryHours";
import { CemeteryMapTab } from "./CemeteryMapTab";
import CemeteryGallery from "./CemeteryGallery";
import CemeteryAdministration from "./CemeteryAdministration";
import { CemeteryNicheMap } from "./CemeteryNicheMap";
import { Info, ListTodo, Map, Clock, Image, Building, Users, FileText, Phone } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export interface CemeteryTabsProps {
  cemetery: any;
  cemeteryId: string;
}

export const CemeteryTabs: React.FC<CemeteryTabsProps> = ({ cemetery, cemeteryId }) => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("info");
  
  // Salva la tab attiva nel localStorage per mantenerla tra le navigazioni
  useEffect(() => {
    const savedTab = localStorage.getItem(`cemetery-${id}-tab`);
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, [id]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem(`cemetery-${id}-tab`, value);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="mb-6 flex flex-wrap gap-1">
        <TabsTrigger value="info" className="flex items-center gap-1.5">
          <Info className="h-4 w-4" />
          <span>Informazioni</span>
        </TabsTrigger>
        <TabsTrigger value="sections" className="flex items-center gap-1.5">
          <Building className="h-4 w-4" />
          <span>Settori e Blocchi</span>
        </TabsTrigger>
        <TabsTrigger value="niches" className="flex items-center gap-1.5">
          <ListTodo className="h-4 w-4" />
          <span>Mappa Nicchie</span>
        </TabsTrigger>
        <TabsTrigger value="map" className="flex items-center gap-1.5">
          <Map className="h-4 w-4" />
          <span>Mappa</span>
        </TabsTrigger>
        <TabsTrigger value="deceased" className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          <span>Defunti</span>
        </TabsTrigger>
        <TabsTrigger value="hours" className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>Orari</span>
        </TabsTrigger>
        <TabsTrigger value="gallery" className="flex items-center gap-1.5">
          <Image className="h-4 w-4" />
          <span>Galleria</span>
        </TabsTrigger>
        <TabsTrigger value="administration" className="flex items-center gap-1.5">
          <FileText className="h-4 w-4" />
          <span>Amministrazione</span>
        </TabsTrigger>
        <TabsTrigger value="contact" className="flex items-center gap-1.5">
          <Phone className="h-4 w-4" />
          <span>Contatti</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="space-y-6">
        <CemeteryInfoCard cemetery={cemetery} />
      </TabsContent>

      <TabsContent value="sections" className="space-y-6">
        <CemeterySectionsTab cemeteryId={cemeteryId} />
      </TabsContent>
      
      <TabsContent value="niches" className="space-y-6">
        <CemeteryNicheMap cemeteryId={cemeteryId} />
      </TabsContent>

      <TabsContent value="map" className="space-y-6">
        <CemeteryMapTab />
      </TabsContent>

      <TabsContent value="deceased" className="space-y-6">
        <CemeteryDeceasedTab cemeteryId={cemeteryId} />
      </TabsContent>

      <TabsContent value="hours" className="space-y-6">
        <CemeteryHours cemetery={cemetery} />
      </TabsContent>

      <TabsContent value="gallery" className="space-y-6">
        <CemeteryGallery cemeteryId={cemeteryId} />
      </TabsContent>

      <TabsContent value="administration" className="space-y-6">
        <CemeteryAdministration cemeteryId={cemeteryId} />
      </TabsContent>
      
      <TabsContent value="contact" className="space-y-6">
        <ContactTab cemetery={cemetery} />
      </TabsContent>
    </Tabs>
  );
};

// Nuovo componente per la tab Contatti
interface ContactTabProps {
  cemetery: any;
}

const ContactTab: React.FC<ContactTabProps> = ({ cemetery }) => {
  const contactInfo = cemetery.contact_info || {};
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Informazioni di contatto
            </CardTitle>
            <CardDescription>
              Dettagli per contattare l'amministrazione del cimitero
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contactInfo.phone ? (
              <div>
                <div className="font-medium text-sm text-muted-foreground mb-1">Telefono</div>
                <div className="text-lg">{contactInfo.phone}</div>
              </div>
            ) : null}
            
            {contactInfo.email ? (
              <div>
                <div className="font-medium text-sm text-muted-foreground mb-1">Email</div>
                <div className="text-lg">{contactInfo.email}</div>
              </div>
            ) : null}
            
            {contactInfo.website ? (
              <div>
                <div className="font-medium text-sm text-muted-foreground mb-1">Sito Web</div>
                <div className="text-lg">
                  <a 
                    href={contactInfo.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline"
                  >
                    {contactInfo.website}
                  </a>
                </div>
              </div>
            ) : null}
            
            {!contactInfo.phone && !contactInfo.email && !contactInfo.website && (
              <div className="text-muted-foreground text-center py-4">
                Nessuna informazione di contatto disponibile
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Indirizzo</CardTitle>
            <CardDescription>
              Ubicazione del cimitero
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cemetery.Indirizzo && (
                <p className="text-lg">{cemetery.Indirizzo}</p>
              )}
              {(cemetery.city || cemetery.state) && (
                <p className="text-lg">
                  {cemetery.city}{cemetery.city && cemetery.state ? ', ' : ''}{cemetery.state}
                </p>
              )}
              {cemetery.postal_code && (
                <p className="text-lg">{cemetery.postal_code}</p>
              )}
              {cemetery.country && (
                <p className="text-lg">{cemetery.country}</p>
              )}
              
              {!cemetery.Indirizzo && !cemetery.city && !cemetery.state && !cemetery.postal_code && !cemetery.country && (
                <div className="text-muted-foreground text-center py-4">
                  Nessun indirizzo disponibile
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
