
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Landmark, Users, MapPin } from "lucide-react";

interface CemeteryCardProps {
  id: string;
  name: string;
  location: string;
  deceased?: number;
  className?: string;
}

const CemeteryCard = ({ id, name, location, deceased = 0, className }: CemeteryCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/cemetery/${id}`);
  };

  return (
    <Card 
      className={`h-full overflow-hidden hover:shadow-md transition-shadow ${className}`}
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {name}
          </CardTitle>
          <Landmark className="h-5 w-5 text-muted-foreground shrink-0 ml-2" />
        </div>
      </CardHeader>
      <CardContent className="pb-0 text-sm text-muted-foreground">
        <div className="flex items-start mb-2">
          <MapPin className="h-4 w-4 shrink-0 mr-1 mt-0.5" />
          <span className="line-clamp-2">{location}</span>
        </div>
        {deceased > 0 && (
          <div className="flex items-center">
            <Users className="h-4 w-4 shrink-0 mr-1" />
            <span>{deceased.toLocaleString()} deceased</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4">
        <Button variant="secondary" size="sm" className="w-full" onClick={handleClick}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CemeteryCard;
