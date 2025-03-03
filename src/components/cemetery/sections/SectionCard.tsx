
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Section } from "./types";
import { SectionStats } from "./SectionStats";
import { SectionBlocks } from "./SectionBlocks";

interface SectionCardProps {
  section: Section;
}

export const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted/50 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {section.Codice || `Settore ${section.Id}`}
              {section.section_type && (
                <Badge variant="outline" className="ml-2">
                  {section.section_type}
                </Badge>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">
              {section.Descrizione || "Nessuna descrizione"}
            </p>
          </div>
          <Button variant="outline" size="sm">
            Dettagli
          </Button>
        </div>
      </div>

      <div className="p-4">
        <SectionStats 
          area_sqm={section.area_sqm} 
          max_capacity={section.max_capacity} 
          current_occupancy={section.current_occupancy} 
        />

        <SectionBlocks blocks={section.blocchi || []} />
      </div>

      <CardFooter className="bg-muted/20 justify-end p-2">
        <Button variant="ghost" size="sm">
          Gestisci Blocchi
        </Button>
      </CardFooter>
    </div>
  );
};
