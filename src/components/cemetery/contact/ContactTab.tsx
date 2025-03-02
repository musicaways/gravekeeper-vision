
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Phone } from "lucide-react";

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

export default ContactTab;
