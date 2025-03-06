
import { supabase } from "@/integrations/supabase/client";

export interface CemeteryUpdateData {
  Descrizione: string;
  Note: string;
  Indirizzo: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
  established_date: string | null;
  total_area_sqm: number | null;
  Latitudine: string | number | null;
  Longitudine: string | number | null;
  custom_map_marker_id: string | null;
  contact_info: {
    phone: string;
    email: string;
    website: string;
  };
  ricevimento_salme: boolean | null;
  chiesa: boolean | null;
  camera_mortuaria: boolean | null;
  cavalletti: boolean | null;
  impalcatura: boolean | null;
}

export const formatCemeteryData = (formData: any): CemeteryUpdateData => {
  return {
    Descrizione: formData.Descrizione,
    Note: formData.Note,
    Indirizzo: formData.Indirizzo,
    city: formData.city,
    postal_code: formData.postal_code,
    state: formData.state,
    country: formData.country,
    established_date: formData.established_date || null,
    total_area_sqm: formData.total_area_sqm ? parseFloat(formData.total_area_sqm) : null,
    Latitudine: formData.Latitudine ? parseFloat(formData.Latitudine) : null,
    Longitudine: formData.Longitudine ? parseFloat(formData.Longitudine) : null,
    custom_map_marker_id: formData.custom_map_marker_id || null,
    contact_info: {
      phone: formData.contact_info.phone || "",
      email: formData.contact_info.email || "",
      website: formData.contact_info.website || ""
    },
    ricevimento_salme: formData.ricevimento_salme,
    chiesa: formData.chiesa,
    camera_mortuaria: formData.camera_mortuaria,
    cavalletti: formData.cavalletti,
    impalcatura: formData.impalcatura
  };
};

export const updateCemeteryInfo = async (cemeteryId: number, data: CemeteryUpdateData) => {
  console.log("Updating cemetery data:", data);
  
  // Create a copy of the data and ensure Latitudine and Longitudine are numbers
  const updateData = {
    ...data,
    Latitudine: data.Latitudine !== null ? parseFloat(String(data.Latitudine)) : null,
    Longitudine: data.Longitudine !== null ? parseFloat(String(data.Longitudine)) : null
  };
  
  const { error, data: updatedData } = await supabase
    .from('Cimitero')
    .update(updateData)
    .eq('Id', cemeteryId)
    .select();

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }

  console.log("Update successful:", updatedData);
  return updatedData;
};
