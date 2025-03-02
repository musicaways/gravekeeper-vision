
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CemeteryCard } from "./CemeteryCard";
import { Cemetery } from "@/types";

interface RecentCemeteriesProps {
  cemeteries: Cemetery[];
}

export function RecentCemeteries({ cemeteries }: RecentCemeteriesProps) {
  return (
    <div className="lg:col-span-2">
      <h2 className="text-2xl font-bold mb-4">Recent Cemeteries</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cemeteries.map((cemetery) => (
          <CemeteryCard key={cemetery.id} cemetery={cemetery} />
        ))}
      </div>
      <div className="mt-4">
        <Link to="/cemeteries">
          <Button variant="outline" className="w-full">View All Cemeteries</Button>
        </Link>
      </div>
    </div>
  );
}
