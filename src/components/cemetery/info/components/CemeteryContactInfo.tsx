
import React from "react";
import { Phone, Mail, Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CemeteryContactInfoProps {
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

const CemeteryContactInfo = ({ contactInfo }: CemeteryContactInfoProps) => {
  if (!contactInfo) return null;

  return (
    <div className="w-full">
      <div className="flex items-center mb-3">
        <Phone className="h-5 w-5 text-primary mr-2.5" />
        <h3 className="text-base font-medium text-foreground">Contatti</h3>
      </div>
      
      <div className="pl-7 pr-1 space-y-4 mb-4">
        {contactInfo.phone && (
          <div>
            <h4 className="font-medium text-sm mb-1.5">Telefono</h4>
            <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
          </div>
        )}

        {contactInfo.email && (
          <div>
            <h4 className="font-medium text-sm mb-1.5">Email</h4>
            <p className="text-sm text-muted-foreground break-words">{contactInfo.email}</p>
          </div>
        )}

        {contactInfo.website && (
          <div>
            <h4 className="font-medium text-sm mb-1.5">Sito Web</h4>
            <a 
              href={contactInfo.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-primary hover:underline break-words transition-colors"
            >
              {contactInfo.website}
            </a>
          </div>
        )}
      </div>
      
      <Separator className="mb-4" />
    </div>
  );
};

export default CemeteryContactInfo;
