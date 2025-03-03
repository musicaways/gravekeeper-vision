
interface SectionStatsProps {
  area_sqm: number;
  max_capacity: number;
  current_occupancy: number;
}

export const SectionStats: React.FC<SectionStatsProps> = ({
  area_sqm,
  max_capacity,
  current_occupancy
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      <div className="bg-background p-3 rounded-md border">
        <div className="text-sm text-muted-foreground">Area Totale</div>
        <div className="text-lg font-medium mt-1">
          {area_sqm ? `${area_sqm} m²` : "N/D"}
        </div>
      </div>
      <div className="bg-background p-3 rounded-md border">
        <div className="text-sm text-muted-foreground">Capacità Massima</div>
        <div className="text-lg font-medium mt-1">
          {max_capacity || "N/D"}
        </div>
      </div>
      <div className="bg-background p-3 rounded-md border">
        <div className="text-sm text-muted-foreground">Occupazione Attuale</div>
        <div className="text-lg font-medium mt-1">
          {current_occupancy !== null && max_capacity 
            ? `${current_occupancy}/${max_capacity} (${Math.round((current_occupancy / max_capacity) * 100)}%)`
            : "N/D"
          }
        </div>
      </div>
    </div>
  );
};
