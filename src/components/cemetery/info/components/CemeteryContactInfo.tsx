
import React from "react";
import { Phone, Mail, Globe } from "lucide-react";

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
    <div className="space-y-4">
      {contactInfo.phone && (
        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium">Telefono</h4>
            <p className="text-sm md:text-base">{contactInfo.phone}</p>
          </div>
        </div>
      )}

      {contactInfo.email && (
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium">Email</h4>
            <p className="text-sm md:text-base break-words">{contactInfo.email}</p>
          </div>
        </div>
      )}

      {contactInfo.website && (
        <div className="flex items-start gap-3">
          <Globe className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium">Sito Web</h4>
            <a 
              href={contactInfo.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm md:text-base text-primary hover:underline break-words"
            >
              {contactInfo.website}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CemeteryContactInfo;
