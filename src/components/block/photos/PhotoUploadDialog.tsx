
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import PhotoFileInput from "./components/PhotoFileInput";
import UploadProgressBar from "./components/UploadProgressBar";
import { usePhotoUpload } from "./hooks/usePhotoUpload";

interface PhotoUploadDialogProps {
  blockId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
}

const PhotoUploadDialog: React.FC<PhotoUploadDialogProps> = ({ 
  blockId, 
  open, 
  onOpenChange,
  onUploadComplete
}) => {
  const [photoDescription, setPhotoDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { isUploading, uploadProgress, uploadPhoto } = usePhotoUpload({
    blockId,
    onSuccess: () => {
      resetForm();
      onUploadComplete();
    }
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    await uploadPhoto(selectedFile, photoDescription);
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
          <PhotoFileInput 
            onChange={setSelectedFile} 
            disabled={isUploading}
          />
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrizione (nota per questa foto)</Label>
            <Textarea 
              id="description" 
              placeholder="Inserisci una descrizione o una nota per questa foto"
              value={photoDescription}
              onChange={(e) => setPhotoDescription(e.target.value)}
              disabled={isUploading}
            />
          </div>
          
          <UploadProgressBar progress={uploadProgress} />
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
            onClick={handleUpload} 
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
