
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface CoverImageSectionProps {
  control: Control<any>;
  defaultImage?: string | null;
}

const CoverImageSection = ({ control, defaultImage }: CoverImageSectionProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImage || null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Immagine di copertina</h3>
      
      <FormField
        control={control}
        name="coverImage"
        render={({ field: { onChange, value, ...rest } }) => (
          <FormItem>
            <FormLabel>Immagine di copertina</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {previewUrl && (
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Anteprima immagine di copertina" 
                      className="w-full h-48 object-cover rounded-md border border-gray-200"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => {
                        setPreviewUrl(null);
                        setFileName(null);
                        onChange(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <div className="flex gap-4 items-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          setFileName(file.name);
                          onChange(file);
                          
                          // Create preview URL
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setPreviewUrl(e.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {previewUrl ? 'Cambia immagine' : 'Carica immagine'}
                  </Button>
                  
                  {fileName && !previewUrl && (
                    <span className="text-sm text-muted-foreground">{fileName}</span>
                  )}
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {!previewUrl && defaultImage && (
        <div className="p-4 bg-muted/50 rounded-md flex items-center gap-2 text-sm">
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
          <span>L'immagine di copertina attuale verrà mantenuta se non ne carichi una nuova.</span>
        </div>
      )}
    </div>
  );
};

export default CoverImageSection;
