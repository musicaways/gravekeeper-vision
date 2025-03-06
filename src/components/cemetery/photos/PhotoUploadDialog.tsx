
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadDialogProps {
  cemeteryId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
}

const PhotoUploadDialog: React.FC<PhotoUploadDialogProps> = ({ 
  cemeteryId, 
  open, 
  onOpenChange,
  onUploadComplete
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoDescription, setPhotoDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
      
      setSelectedFile(file);
    }
  };

  const compressImage = async (file: File, maxSizeMB = 1): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          const maxDimension = 1920; // Max dimension for large screen
          if (width > height && width > maxDimension) {
            height = Math.round(height * maxDimension / width);
            width = maxDimension;
          } else if (height > maxDimension) {
            width = Math.round(width * maxDimension / height);
            height = maxDimension;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to blob with quality adjustment
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Canvas to Blob conversion failed'));
              }
            },
            file.type,
            0.7 // Quality factor (0.7 is a good balance)
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadPhoto = async () => {
    if (!selectedFile || !cemeteryId) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      let fileToUpload: Blob | File = selectedFile;
      
      // Compress if larger than 2MB
      if (selectedFile.size > 2 * 1024 * 1024) {
        fileToUpload = await compressImage(selectedFile);
        setUploadProgress(30);
      }
      
      // Generate a unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      setUploadProgress(50);
      
      // Upload to Supabase
      const { data, error } = await supabase
        .from('CimiteroFoto')
        .insert({
          IdCimitero: parseInt(cemeteryId, 10),
          NomeFile: selectedFile.name,
          Descrizione: photoDescription,
          TipoFile: selectedFile.type,
          Url: `https://ytfuenxlejrogesnsvhl.supabase.co/storage/v1/object/public/cimitero-foto/${cemeteryId}/${fileName}`,
          DataInserimento: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setUploadProgress(70);
      
      // Upload the actual file to storage
      const { error: storageError } = await supabase.storage
        .from('cimitero-foto')
        .upload(`${cemeteryId}/${fileName}`, fileToUpload);
      
      if (storageError) throw storageError;
      
      setUploadProgress(100);
      toast({
        title: "Foto caricata",
        description: "La foto è stata caricata con successo.",
      });
      
      // Reset form and close dialog
      resetForm();
      onUploadComplete();
    } catch (error) {
      console.error("Errore nel caricamento:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPhotoDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Carica una nuova foto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="photo">Seleziona un'immagine</Label>
            <Input 
              id="photo" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrizione (nota per questa foto)</Label>
            <Textarea 
              id="description" 
              placeholder="Inserisci una descrizione o una nota per questa foto"
              value={photoDescription}
              onChange={(e) => setPhotoDescription(e.target.value)}
            />
          </div>
          
          {uploadProgress > 0 && (
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={resetForm}
            disabled={isUploading}
          >
            Annulla
          </Button>
          <Button 
            onClick={uploadPhoto} 
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Caricamento..." : "Carica foto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUploadDialog;
