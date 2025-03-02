
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DeceasedListSkeleton } from "./components/DeceasedListSkeleton";
import { DeceasedListError } from "./components/DeceasedListError";
import { DeceasedListEmpty } from "./components/DeceasedListEmpty";
import { DeceasedListItem } from "./components/DeceasedListItem";

interface DeceasedListProps {
  deceased: any[] | null;
  isLoading: boolean;
  isError: boolean;
  onAddClick: () => void;
  onRetry: () => void;
}

export const DeceasedList: React.FC<DeceasedListProps> = ({
  deceased,
  isLoading,
  isError,
  onAddClick,
  onRetry,
}) => {
  if (isLoading) {
    return <DeceasedListSkeleton />;
  }

  if (isError) {
    return <DeceasedListError onRetry={onRetry} />;
  }

  if (!deceased || deceased.length === 0) {
    return <DeceasedListEmpty onAddClick={onAddClick} />;
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-4">
        {deceased.map((person) => (
          <DeceasedListItem key={person.Id} person={person} />
        ))}
      </div>
    </ScrollArea>
  );
};
