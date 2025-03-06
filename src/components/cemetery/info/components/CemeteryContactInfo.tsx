
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
    <div className="w-full py-1">
      <h3 className="text-base font-medium mb-2 text-foreground mt-0.5">Contatti</h3>
      <div className="space-y-4">
        {contactInfo.phone && (
          <div className="flex items-start gap-4">
            <Phone className="h-5 w-5 text-primary mt-1 shrink-0" />
            <div>
              <h4 className="font-medium text-sm mb-1">Telefono</h4>
              <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
            </div>
          </div>
        )}

        {contactInfo.email && (
          <div className="flex items-start gap-4">
            <Mail className="h-5 w-5 text-primary mt-1 shrink-0" />
            <div>
              <h4 className="font-medium text-sm mb-1">Email</h4>
              <p className="text-sm text-muted-foreground break-words">{contactInfo.email}</p>
            </div>
          </div>
        )}

        {contactInfo.website && (
          <div className="flex items-start gap-4">
            <Globe className="h-5 w-5 text-primary mt-1 shrink-0" />
            <div>
              <h4 className="font-medium text-sm mb-1">Sito Web</h4>
              <a 
                href={contactInfo.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-primary hover:underline break-words transition-colors"
              >
                {contactInfo.website}
              </a>
            </div>
          </div>
        )}
      </div>
      <Separator className="mt-3 bg-slate-200" />
    </div>
  );
};

export default CemeteryContactInfo;
