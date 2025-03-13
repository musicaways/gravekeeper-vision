
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface PhotoFileInputProps {
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

const PhotoFileInput: React.FC<PhotoFileInputProps> = ({ onChange, disabled = false }) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Formato non valido",
          description: "Per favore seleziona un'immagine.",
          variant: "destructive"
        });
        return;
      }
      
      // Check size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          title: "File troppo grande",
          description: "L'immagine verrà compressa prima del caricamento.",
        });
      }
      
      onChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="photo">Seleziona un'immagine</Label>
      <Input 
        id="photo" 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  );
};

export default PhotoFileInput;
