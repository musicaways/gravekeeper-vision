
import React from "react";
import { FormProvider } from "react-hook-form";
import { Form } from "@/components/ui/form";
import MapSelectorDialog from "./form/map-selector/MapSelectorDialog";
import CoverImageSection from "./form/sections/CoverImageSection";
import { 
  BasicInfoSection,
  NumericInfoSection,
  TextAreaSection,
  LocationSection
} from "./form/sections";
import { BlockFormData } from "./types/blockFormTypes";
import { useBlockFormInitialization } from "./form/hooks/useBlockFormInitialization";
import { useLocationHandlers } from "./form/hooks/useLocationHandlers";
import { useFormSubmission } from "./form/hooks/useFormSubmission";
import BlockFormActions from "./form/BlockFormActions";

interface BlockInfoEditFormProps {
  block: any;
  onSave: (data: BlockFormData) => void;
  onCancel: () => void;
}

const BlockInfoEditForm: React.FC<BlockInfoEditFormProps> = ({ block, onSave, onCancel }) => {
  // Form initialization with block data
  const form = useBlockFormInitialization(block);
  
  // Location-related handlers
  const {
    isGettingLocation,
    showMapSelector,
    setShowMapSelector,
    getGPSCoordinates,
    handleMapLocationSelect,
    getInitialCoordinates
  } = useLocationHandlers(form);
  
  // Form submission logic
  const { handleSubmit, isSubmitting, isUploading } = useFormSubmission({
    block,
    onSuccess: onSave
  });

  const { lat: initialLat, lng: initialLng } = getInitialCoordinates();

  return (
    <div className="w-full mb-6">
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <CoverImageSection 
              control={form.control} 
              defaultImage={block.FotoCopertina} 
            />
            
            <BasicInfoSection control={form.control} />
            
            <div className="space-y-6">
              <TextAreaSection 
                control={form.control}
                name="Descrizione"
                label="Descrizione"
                placeholder="Inserisci una descrizione del blocco"
              />
              
              <TextAreaSection 
                control={form.control}
                name="Note"
                label="Note"
                placeholder="Inserisci eventuali note"
              />
            </div>
            
            <LocationSection
              control={form.control}
              isGettingLocation={isGettingLocation}
              getGPSCoordinates={getGPSCoordinates}
              onOpenMapSelector={() => setShowMapSelector(true)}
            />
            
            <NumericInfoSection control={form.control} />
            
            <BlockFormActions
              isSubmitting={isSubmitting}
              isUploading={isUploading}
              onCancel={onCancel}
            />
          </form>
        </Form>
      </FormProvider>
      
      <MapSelectorDialog
        isOpen={showMapSelector}
        onOpenChange={setShowMapSelector}
        onSelectLocation={handleMapLocationSelect}
        initialLat={initialLat}
        initialLng={initialLng}
      />
    </div>
  );
};

export default BlockInfoEditForm;
