
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface WorkOrdersToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function WorkOrdersToolbar({ searchQuery, onSearchChange }: WorkOrdersToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <p className="text-muted-foreground">Manage and track maintenance tasks</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Input
          placeholder="Search work orders..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-[250px]"
        />
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Work Order
        </Button>
      </div>
    </div>
  );
}

export function WorkOrdersFilter() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>All Orders</DropdownMenuItem>
        <DropdownMenuItem>High Priority</DropdownMenuItem>
        <DropdownMenuItem>Assigned to Me</DropdownMenuItem>
        <DropdownMenuItem>Created Today</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
