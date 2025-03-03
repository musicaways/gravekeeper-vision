
import { Badge } from "@/components/ui/badge";
import { Block } from "./types";

interface SectionBlocksProps {
  blocks: Block[];
}

export const SectionBlocks: React.FC<SectionBlocksProps> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-2">
        Nessun blocco disponibile per questo settore
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-medium mb-2">Blocchi ({blocks.length})</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {blocks.map(block => (
          <div key={block.Id} className="border rounded p-3 bg-background">
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium">{block.Codice || `Blocco ${block.Id}`}</div>
              <Badge variant="outline" className="text-xs">
                {block.NumeroLoculi || 0} loculi
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {block.Descrizione || "Nessuna descrizione"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
