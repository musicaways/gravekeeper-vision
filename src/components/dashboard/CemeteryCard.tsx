
import React from "react";
import { useNavigate } from "react-router-dom";
import { Map, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cemetery } from "@/types";

interface CemeteryCardProps {
  cemetery: Cemetery;
}

export function CemeteryCard({ cemetery }: CemeteryCardProps) {
  const hasContactInfo = cemetery.contact_info?.phone || cemetery.contact_info?.email;
  const navigate = useNavigate();
  
  // Assicuriamo che handleCardClick funzioni correttamente
  const handleCardClick = () => {
    console.log(`Navigating to cemetery/${cemetery.id}`);
    navigate(`/cemetery/${cemetery.id}`);
  };
  
  return (
    <Card 
      className="hover:bg-accent transition-colors cursor-pointer h-full"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <CardTitle>{cemetery.name}</CardTitle>
        <CardDescription>
          {cemetery.city || cemetery.state ? 
            `${cemetery.city}${cemetery.state ? `, ${cemetery.state}` : ''}` : 
            cemetery.address}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-2">
          {cemetery.address && (
            <div className="flex items-start">
              <Map className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <span>{cemetery.address}</span>
            </div>
          )}
          
          {hasContactInfo && (
            <div className="border-t pt-2 mt-2">
              {cemetery.contact_info?.phone && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{cemetery.contact_info.phone}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="pt-1 flex items-center justify-between">
            {cemetery.established_date && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Est. {cemetery.established_date}</span>
              </div>
            )}
            
            {cemetery.active ? (
              <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                Active
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
                Inactive
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
