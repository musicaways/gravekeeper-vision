
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface CemeteryErrorDisplayProps {
  error: string | null;
}

const CemeteryErrorDisplay = ({ error }: CemeteryErrorDisplayProps) => {
  return (
    <div className="min-h-screen bg-background p-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Errore</CardTitle>
          <CardDescription>
            Si è verificato un errore nel caricamento dei dettagli del cimitero
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error || "Cimitero non trovato"}</p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Torna alla lista dei cimiteri
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CemeteryErrorDisplay;
