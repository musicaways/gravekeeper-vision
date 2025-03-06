
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
  Latitudine: string | number | null; // Updated to accept both string and number
  Longitudine: string | number | null; // Updated to accept both string and number
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
    // Convert string coordinates to numbers if they exist
    Latitudine: formData.Latitudine ? parseFloat(formData.Latitudine) : null,
    Longitudine: formData.Longitudine ? parseFloat(formData.Longitudine) : null,
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
  
  const { error, data: updatedData } = await supabase
    .from('Cimitero')
    .update(data)
    .eq('Id', cemeteryId)
    .select();

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }

  console.log("Update successful:", updatedData);
  return updatedData;
};
