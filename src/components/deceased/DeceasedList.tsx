
import React from "react";
import { useDeceasedData } from "./hooks/useDeceasedData";
import DeceasedListItem from "./DeceasedListItem";
import DeceasedEmptyState from "./DeceasedEmptyState";
import DeceasedLoadingSkeleton from "./DeceasedLoadingSkeleton";
import { DeceasedListProps } from "./types/deceased";

const DeceasedList: React.FC<DeceasedListProps> = ({ 
  searchTerm, 
  sortBy, 
  filterBy,
  selectedCemetery = null
}) => {
  const { loading, filteredDeceased } = useDeceasedData({
    searchTerm,
    sortBy,
    filterBy,
    selectedCemetery
  });

  if (loading) {
    return <DeceasedLoadingSkeleton />;
  }

  if (filteredDeceased.length === 0) {
    return <DeceasedEmptyState searchTerm={searchTerm} onClear={() => {}} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-1">
        {filteredDeceased.map((deceased) => (
          <DeceasedListItem key={deceased.id} deceased={deceased} />
        ))}
      </div>
    </div>
  );
};

export default DeceasedList;
