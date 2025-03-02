
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CemeteryHeaderProps {
  name: string;
  location: string;
}

const CemeteryHeader = ({ name, location }: CemeteryHeaderProps) => {
  return (
    <header className="bg-primary text-primary-foreground p-6 shadow-md">
      <div className="container mx-auto">
        <Button variant="outline" asChild className="mb-4">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Torna alla lista
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{name || "Dettagli Cimitero"}</h1>
        <p className="text-xl opacity-90">{location}</p>
      </div>
    </header>
  );
};

export default CemeteryHeader;
