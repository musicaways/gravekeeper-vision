
import React from 'react';

interface SwipeDirectionIndicatorProps {
  direction: "left" | "right" | null;
}

const SwipeDirectionIndicator = ({ direction }: SwipeDirectionIndicatorProps) => {
  if (!direction) return null;
  
  return (
    direction === "left" ? (
      <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full">
        &lt;
      </div>
    ) : (
      <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full">
        &gt;
      </div>
    )
  );
};

export default SwipeDirectionIndicator;
