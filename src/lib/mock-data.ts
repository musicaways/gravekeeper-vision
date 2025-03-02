
import { 
  Cemetery, Section, Block, Plot, Deceased, 
  WorkOrder, WorkCrew, Material, User, 
  AIFunction, NicheInfo 
} from "@/types";

export const mockCemeteries: Cemetery[] = [
  {
    id: "cem-001",
    name: "Eternal Peace Memorial Park",
    address: "1234 Serenity Lane",
    city: "Meadowbrook",
    state: "California",
    postal_code: "92123",
    country: "USA",
    established_date: "1945-06-15",
    total_area_sqm: 250000,
    geo_location: {
      lat: 32.7157,
      lng: -117.1611
    },
    contact_info: {
      phone: "(555) 123-4567",
      email: "info@eternalpeace.example",
      website: "www.eternalpeace.example"
    },
    operating_hours: {
      monday: { open: "09:00", close: "17:00" },
      tuesday: { open: "09:00", close: "17:00" },
      wednesday: { open: "09:00", close: "17:00" },
      thursday: { open: "09:00", close: "17:00" },
      friday: { open: "09:00", close: "17:00" },
      saturday: { open: "10:00", close: "16:00" },
      sunday: { open: "10:00", close: "16:00" }
    },
    active: true
  },
  {
    id: "cem-002",
    name: "Highland Memorial Gardens",
    address: "5678 Hilltop Drive",
    city: "Evergreen",
    state: "California",
    postal_code: "94952",
    country: "USA",
    established_date: "1968-03-22",
    total_area_sqm: 180000,
    geo_location: {
      lat: 37.7749,
      lng: -122.4194
    },
    contact_info: {
      phone: "(555) 987-6543",
      email: "contact@highlandgardens.example"
    },
    operating_hours: {
      monday: { open: "08:30", close: "16:30" },
      tuesday: { open: "08:30", close: "16:30" },
      wednesday: { open: "08:30", close: "16:30" },
      thursday: { open: "08:30", close: "16:30" },
      friday: { open: "08:30", close: "16:30" },
      saturday: { open: "09:00", close: "15:00" },
      sunday: { open: "10:00", close: "14:00" }
    },
    active: true
  },
  {
    id: "cem-003",
    name: "Oakridge Cemetery",
    address: "910 Valley Road",
    city: "Pineville",
    state: "California",
    postal_code: "90210",
    country: "USA",
    established_date: "1902-11-08",
    total_area_sqm: 320000,
    geo_location: {
      lat: 34.0522,
      lng: -118.2437
    },
    contact_info: {
      phone: "(555) 456-7890",
      email: "info@oakridge.example",
      website: "www.oakridge.example"
    },
    operating_hours: {
      monday: { open: "08:00", close: "18:00" },
      tuesday: { open: "08:00", close: "18:00" },
      wednesday: { open: "08:00", close: "18:00" },
      thursday: { open: "08:00", close: "18:00" },
      friday: { open: "08:00", close: "18:00" },
      saturday: { open: "09:00", close: "17:00" },
      sunday: { open: "09:00", close: "17:00" }
    },
    active: true
  }
];

export const mockSections: Section[] = [
  {
    id: "sec-001",
    cemetery_id: "cem-001",
    name: "Garden of Reflection",
    section_code: "GR",
    section_type: "burial",
    geo_boundary: {
      type: "Polygon",
      coordinates: [[[0, 0], [100, 0], [100, 100], [0, 100], [0, 0]]]
    },
    area_sqm: 5000,
    max_capacity: 500,
    current_occupancy: 342
  },
  {
    id: "sec-002",
    cemetery_id: "cem-001",
    name: "Tranquil Meadows",
    section_code: "TM",
    section_type: "burial",
    geo_boundary: {
      type: "Polygon",
      coordinates: [[[100, 0], [200, 0], [200, 100], [100, 100], [100, 0]]]
    },
    area_sqm: 4500,
    max_capacity: 450,
    current_occupancy: 201
  },
  {
    id: "sec-003",
    cemetery_id: "cem-001",
    name: "Memorial Columbarium",
    section_code: "MC",
    section_type: "cremation",
    geo_boundary: {
      type: "Polygon",
      coordinates: [[[0, 100], [50, 100], [50, 150], [0, 150], [0, 100]]]
    },
    area_sqm: 1000,
    max_capacity: 800,
    current_occupancy: 456
  }
];

export const mockBlocks: Block[] = [
  {
    id: "blk-001",
    section_id: "sec-001",
    block_code: "GR-A",
    geo_boundary: {
      type: "Polygon",
      coordinates: [[[0, 0], [50, 0], [50, 50], [0, 50], [0, 0]]]
    },
    total_plots: 100,
    available_plots: 28
  },
  {
    id: "blk-002",
    section_id: "sec-001",
    block_code: "GR-B",
    geo_boundary: {
      type: "Polygon",
      coordinates: [[[50, 0], [100, 0], [100, 50], [50, 50], [50, 0]]]
    },
    total_plots: 100,
    available_plots: 45
  },
  {
    id: "blk-003",
    section_id: "sec-003",
    block_code: "MC-A",
    geo_boundary: {
      type: "Polygon",
      coordinates: [[[0, 100], [25, 100], [25, 125], [0, 125], [0, 100]]]
    },
    total_plots: 200,
    available_plots: 86
  }
];

export const mockPlots: Plot[] = [
  {
    id: "plt-001",
    block_id: "blk-001",
    plot_number: "A-001",
    row_number: "A",
    plot_type: "standard",
    status: "occupied",
    dimensions: {
      length: 2.5,
      width: 1.2,
      depth: 2.0,
      unit: "m"
    },
    geo_location: {
      lat: 32.7159,
      lng: -117.1615
    },
    capacity: 1,
    current_occupancy: 1,
    price: 2500,
    purchase_date: "2015-04-12",
    expiration_date: ""
  },
  {
    id: "plt-002",
    block_id: "blk-001",
    plot_number: "A-002",
    row_number: "A",
    plot_type: "standard",
    status: "available",
    dimensions: {
      length: 2.5,
      width: 1.2,
      depth: 2.0,
      unit: "m"
    },
    geo_location: {
      lat: 32.7160,
      lng: -117.1616
    },
    capacity: 1,
    current_occupancy: 0,
    price: 2500
  },
  {
    id: "plt-003",
    block_id: "blk-003",
    plot_number: "N-001",
    row_number: "1",
    plot_type: "niche",
    status: "reserved",
    dimensions: {
      length: 0.3,
      width: 0.3,
      unit: "m"
    },
    geo_location: {
      lat: 32.7165,
      lng: -117.1620
    },
    capacity: 2,
    current_occupancy: 0,
    price: 1200,
    purchase_date: "2023-08-15"
  }
];

export const mockDeceased: Deceased[] = [
  {
    id: "dec-001",
    plot_id: "plt-001",
    first_name: "John",
    last_name: "Smith",
    middle_name: "Robert",
    gender: "male",
    birth_date: "1945-03-15",
    death_date: "2015-05-22",
    burial_date: "2015-05-28",
    death_certificate_number: "DC1234567",
    burial_permit_number: "BP987654",
    burial_location: {
      longitude: 32.7159,
      latitude: -117.1615,
      description: "Garden of Reflection, Block A, Plot 1"
    },
    burial_type: "full_body",
    next_of_kin_info: {
      name: "Mary Smith",
      relationship: "Spouse",
      phone: "(555) 234-5678",
      email: "mary.smith@example.com"
    }
  }
];

export const mockWorkOrders: WorkOrder[] = [
  {
    id: "wo-001",
    cemetery_id: "cem-001",
    order_number: "WO-2023-001",
    order_type: "burial",
    status: "completed",
    priority: "medium",
    related_entity_type: "plot",
    related_entity_id: "plt-001",
    description: "Standard burial service for John Smith",
    requested_date: "2015-05-25",
    scheduled_date: "2015-05-28",
    assigned_crew_id: "crew-001"
  },
  {
    id: "wo-002",
    cemetery_id: "cem-001",
    order_number: "WO-2023-045",
    order_type: "maintenance",
    status: "in_progress",
    priority: "low",
    related_entity_type: "section",
    related_entity_id: "sec-001",
    description: "Regular lawn mowing and trimming for Garden of Reflection",
    requested_date: "2023-10-01",
    scheduled_date: "2023-10-05",
    assigned_crew_id: "crew-002",
    materials_required: [
      {
        material_id: "mat-005",
        quantity: 1
      }
    ]
  },
  {
    id: "wo-003",
    cemetery_id: "cem-001",
    order_number: "WO-2023-046",
    order_type: "landscaping",
    status: "pending",
    priority: "medium",
    related_entity_type: "section",
    related_entity_id: "sec-002",
    description: "Plant new ornamental trees along pathways",
    requested_date: "2023-10-03",
    scheduled_date: "2023-10-12",
    assigned_crew_id: "crew-002",
    materials_required: [
      {
        material_id: "mat-007",
        quantity: 12
      },
      {
        material_id: "mat-008",
        quantity: 50
      }
    ]
  }
];

export const mockWorkCrews: WorkCrew[] = [
  {
    id: "crew-001",
    cemetery_id: "cem-001",
    name: "Burial Team Alpha",
    crew_type: "burial",
    leader_name: "Robert Johnson",
    members: [
      {
        name: "Robert Johnson",
        role: "Team Lead",
        contact: "(555) 111-2233"
      },
      {
        name: "Michael Davis",
        role: "Assistant",
        contact: "(555) 111-4455"
      },
      {
        name: "Sarah Wilson",
        role: "Equipment Operator",
        contact: "(555) 111-6677"
      }
    ],
    equipment_access: ["excavator", "lowering_device", "tent"]
  },
  {
    id: "crew-002",
    cemetery_id: "cem-001",
    name: "Grounds Maintenance Crew",
    crew_type: "maintenance",
    leader_name: "David Anderson",
    members: [
      {
        name: "David Anderson",
        role: "Supervisor",
        contact: "(555) 222-3344"
      },
      {
        name: "Lisa Thompson",
        role: "Landscaper",
        contact: "(555) 222-5566"
      },
      {
        name: "Kevin Robinson",
        role: "Maintenance Worker",
        contact: "(555) 222-7788"
      }
    ],
    equipment_access: ["lawn_mower", "weed_trimmer", "leaf_blower", "hedge_trimmer"]
  }
];

export const mockMaterials: Material[] = [
  {
    id: "mat-001",
    cemetery_id: "cem-001",
    item_name: "Standard Concrete Liner",
    item_code: "SCL-001",
    category: "Burial Supplies",
    quantity_on_hand: 15,
    reorder_point: 5,
    location: "Storage Building A",
    cost_per_unit: 350
  },
  {
    id: "mat-005",
    cemetery_id: "cem-001",
    item_name: "Gasoline (5 Gallon)",
    item_code: "GAS-005",
    category: "Maintenance Supplies",
    quantity_on_hand: 8,
    reorder_point: 3,
    location: "Maintenance Shed B",
    cost_per_unit: 25
  },
  {
    id: "mat-007",
    cemetery_id: "cem-001",
    item_name: "Japanese Maple Sapling",
    item_code: "TREE-007",
    category: "Landscaping",
    quantity_on_hand: 6,
    reorder_point: 2,
    location: "Greenhouse",
    cost_per_unit: 75
  },
  {
    id: "mat-008",
    cemetery_id: "cem-001",
    item_name: "Premium Mulch (Bag)",
    item_code: "MULCH-001",
    category: "Landscaping",
    quantity_on_hand: 42,
    reorder_point: 15,
    location: "Storage Building B",
    cost_per_unit: 12
  }
];

export const mockUsers: User[] = [
  {
    id: "usr-001",
    email: "admin@cemeteryapp.example",
    first_name: "Admin",
    last_name: "User",
    role: "admin",
    permissions: {
      cemeteries: { view: true, create: true, update: true, delete: true },
      sections: { view: true, create: true, update: true, delete: true },
      blocks: { view: true, create: true, update: true, delete: true },
      plots: { view: true, create: true, update: true, delete: true },
      deceased: { view: true, create: true, update: true, delete: true },
      work_orders: { view: true, create: true, update: true, delete: true },
      crews: { view: true, create: true, update: true, delete: true },
      inventory: { view: true, create: true, update: true, delete: true },
      users: { view: true, create: true, update: true, delete: true },
      ai_assistant: { view: true, create: true, update: true, delete: true }
    },
    status: "active"
  },
  {
    id: "usr-002",
    email: "manager@cemeteryapp.example",
    first_name: "Manager",
    last_name: "User",
    role: "manager",
    permissions: {
      cemeteries: { view: true, create: false, update: true, delete: false },
      sections: { view: true, create: true, update: true, delete: false },
      blocks: { view: true, create: true, update: true, delete: false },
      plots: { view: true, create: true, update: true, delete: false },
      deceased: { view: true, create: true, update: true, delete: false },
      work_orders: { view: true, create: true, update: true, delete: true },
      crews: { view: true, create: true, update: true, delete: false },
      inventory: { view: true, create: true, update: true, delete: false },
      users: { view: true, create: false, update: false, delete: false },
      ai_assistant: { view: true, create: false, update: false, delete: false }
    },
    status: "active"
  },
  {
    id: "usr-003",
    email: "worker@cemeteryapp.example",
    first_name: "Worker",
    last_name: "User",
    role: "worker",
    permissions: {
      cemeteries: { view: true, create: false, update: false, delete: false },
      sections: { view: true, create: false, update: false, delete: false },
      blocks: { view: true, create: false, update: false, delete: false },
      plots: { view: true, create: false, update: false, delete: false },
      deceased: { view: true, create: false, update: false, delete: false },
      work_orders: { view: true, create: false, update: true, delete: false },
      crews: { view: true, create: false, update: false, delete: false },
      inventory: { view: true, create: false, update: true, delete: false },
      users: { view: false, create: false, update: false, delete: false },
      ai_assistant: { view: true, create: false, update: false, delete: false }
    },
    status: "active"
  }
];

export const mockAIFunctions: AIFunction[] = [
  {
    id: "ai-001",
    name: "findAvailablePlots",
    description: "Finds available plots in a specified section or block",
    function_type: "query",
    trigger_phrases: ["find available plots", "show open plots", "available plots"],
    function_code: `
      const { sectionId, blockId, plotType } = params;
      let query = supabase.from('plots').select('*').eq('status', 'available');
      
      if (blockId) {
        query = query.eq('block_id', blockId);
      } else if (sectionId) {
        query = query.eq('section_id', sectionId);
      }
      
      if (plotType) {
        query = query.eq('plot_type', plotType);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      result = data;
    `,
    parameters_schema: {
      type: "object",
      properties: {
        sectionId: { type: "string", description: "Optional ID of the section to search within" },
        blockId: { type: "string", description: "Optional ID of the block to search within" },
        plotType: { type: "string", enum: ["standard", "family", "cremation", "mausoleum", "niche"], description: "Optional type of plot to filter by" }
      }
    },
    enabled: true,
    created_by: "usr-001"
  }
];

// Mock data for the NicheMap component
export const mockNiches: NicheInfo[] = Array.from({ length: 48 }, (_, i) => {
  const row = Math.floor(i / 8);
  const column = i % 8;
  
  // Set some niches as occupied or reserved to show different statuses
  let status: "available" | "reserved" | "occupied" | "maintenance" = "available";
  let deceasedName: string | undefined = undefined;
  let expirationDate: string | undefined = undefined;
  
  // First 10 as occupied
  if (i < 10) {
    status = "occupied";
    deceasedName = `Deceased ${i+1}`;
  } 
  // Next 5 as reserved
  else if (i < 15) {
    status = "reserved";
    expirationDate = "2024-12-31";
  }
  // A couple under maintenance
  else if (i === 20 || i === 30) {
    status = "maintenance";
  }
  
  return {
    id: `niche-${i+1}`,
    row,
    column,
    status,
    deceasedName,
    expirationDate
  };
});
