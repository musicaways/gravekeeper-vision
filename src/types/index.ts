
export interface Cemetery {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  established_date: string;
  total_area_sqm: number;
  geo_location: {
    lat: number;
    lng: number;
  };
  contact_info: {
    phone: string;
    email: string;
    website?: string;
  };
  operating_hours: {
    [key: string]: { open: string; close: string }; // e.g. "monday": { open: "09:00", close: "17:00" }
  };
  active: boolean;
}

export interface Section {
  id: string;
  cemetery_id: string;
  name: string;
  section_code: string;
  section_type: "burial" | "cremation" | "mausoleum" | "garden" | "other";
  geo_boundary: {
    type: "Polygon";
    coordinates: number[][][];
  };
  area_sqm: number;
  max_capacity: number;
  current_occupancy: number;
}

export interface Block {
  id: string;
  section_id: string;
  block_code: string;
  geo_boundary: {
    type: "Polygon";
    coordinates: number[][][];
  };
  total_plots: number;
  available_plots: number;
}

export interface Plot {
  id: string;
  block_id: string;
  plot_number: string;
  row_number: string;
  plot_type: "standard" | "family" | "cremation" | "mausoleum" | "niche";
  status: "available" | "reserved" | "occupied" | "maintenance";
  dimensions: {
    length: number;
    width: number;
    depth?: number;
    unit: "m" | "ft";
  };
  geo_location: {
    lat: number;
    lng: number;
  };
  capacity: number;
  current_occupancy: number;
  price?: number;
  purchase_date?: string;
  expiration_date?: string;
}

export interface Deceased {
  id: string;
  plot_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  gender: "male" | "female" | "other" | "unspecified";
  birth_date: string;
  death_date: string;
  burial_date: string;
  death_certificate_number?: string;
  burial_permit_number?: string;
  burial_location: {
    longitude?: number;
    latitude?: number;
    description?: string;
  };
  burial_type: "full_body" | "cremation" | "entombment" | "other";
  next_of_kin_info?: {
    name: string;
    relationship: string;
    phone?: string;
    email?: string;
    address?: string;
  };
}

export type WorkOrderPriority = "low" | "medium" | "high" | "urgent";
export type WorkOrderStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type WorkOrderType = "burial" | "maintenance" | "landscaping" | "construction" | "cleaning" | "other";

export interface WorkOrder {
  id: string;
  cemetery_id: string;
  order_number: string;
  order_type: WorkOrderType;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  related_entity_type: "plot" | "section" | "block" | "cemetery";
  related_entity_id: string;
  description: string;
  requested_date: string;
  scheduled_date?: string;
  assigned_crew_id?: string;
  materials_required?: {
    material_id: string;
    quantity: number;
  }[];
}

export interface WorkCrew {
  id: string;
  cemetery_id: string;
  name: string;
  crew_type: "maintenance" | "burial" | "landscaping" | "cleaning" | "construction" | "other";
  leader_name: string;
  members: {
    name: string;
    role: string;
    contact?: string;
  }[];
  equipment_access: string[];
}

export interface Material {
  id: string;
  cemetery_id: string;
  item_name: string;
  item_code: string;
  category: string;
  quantity_on_hand: number;
  reorder_point: number;
  location: string;
  cost_per_unit: number;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "manager" | "worker" | "viewer";
  permissions: {
    [module: string]: {
      view?: boolean;
      create?: boolean;
      update?: boolean;
      delete?: boolean;
    };
  };
  status: "active" | "inactive" | "pending";
}

export interface AIFunction {
  id: string;
  name: string;
  description: string;
  function_type: "query" | "action" | "report" | "analysis";
  trigger_phrases: string[];
  function_code: string;
  parameters_schema: Record<string, any>;
  enabled: boolean;
  created_by: string;
}

export interface NicheMapProps {
  blockId: string;
  rows: number; // Vertical rows (top to bottom)
  columns: number; // Horizontal columns (right to left)
  niches: NicheInfo[];
  onNicheClick: (nicheId: string) => void;
}

export interface NicheInfo {
  id: string;
  row: number;
  column: number;
  status: "available" | "reserved" | "occupied" | "maintenance";
  deceasedName?: string;
  expirationDate?: string;
}
