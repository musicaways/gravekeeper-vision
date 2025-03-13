
import { useState } from "react";
import { 
  prepareImageForUpload,
  generateUniqueFileName,
  createPhotoRecord,
  uploadFileToStorage,
  showUploadResultToast
} from "../utils/photoUploadUtils";

interface UsePhotoUploadProps {
  blockId: string;
  onSuccess: () => void;
}

export const usePhotoUpload = ({ blockId, onSuccess }: UsePhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadPhoto = async (file: File, description: string) => {
    if (!file || !blockId) return false;
    
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // Prepare the file (compress if needed)
      const fileToUpload = await prepareImageForUpload(file);
      setUploadProgress(30);
      
      // Generate a unique filename
      const fileName = generateUniqueFileName(file.name);
      setUploadProgress(50);
      
      // Upload the actual file to storage first
      const uploadResult = await uploadFileToStorage(blockId, fileName, fileToUpload);
      if (!uploadResult.success) throw uploadResult.error;
      setUploadProgress(70);
      
      // Then create the database record
      const recordResult = await createPhotoRecord(blockId, file, fileName, description);
      if (!recordResult.success) throw recordResult.error;
      
      setUploadProgress(100);
      showUploadResultToast(true);
      
      // Give a moment before calling onSuccess to ensure the UI updates
      setTimeout(() => {
        onSuccess();
      }, 500);
      
      return true;
    } catch (error) {
      console.error("Error during upload process:", error);
      showUploadResultToast(false);
      return false;
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    }
  };

  return {
    isUploading,
    uploadProgress,
    uploadPhoto
  };
};
