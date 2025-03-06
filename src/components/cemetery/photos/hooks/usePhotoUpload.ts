
import { useState } from "react";
import { 
  prepareImageForUpload,
  generateUniqueFileName,
  createPhotoRecord,
  uploadFileToStorage,
  showUploadResultToast
} from "../utils/photoUploadUtils";

interface UsePhotoUploadProps {
  cemeteryId: string;
  onSuccess: () => void;
}

export const usePhotoUpload = ({ cemeteryId, onSuccess }: UsePhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadPhoto = async (file: File, description: string) => {
    if (!file || !cemeteryId) return false;
    
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // Prepare the file (compress if needed)
      const fileToUpload = await prepareImageForUpload(file);
      setUploadProgress(30);
      
      // Generate a unique filename
      const fileName = generateUniqueFileName(file.name);
      setUploadProgress(50);
      
      // Create the database record
      const recordResult = await createPhotoRecord(cemeteryId, file, fileName, description);
      if (!recordResult.success) throw recordResult.error;
      setUploadProgress(70);
      
      // Upload the actual file to storage
      const uploadResult = await uploadFileToStorage(cemeteryId, fileName, fileToUpload);
      if (!uploadResult.success) throw uploadResult.error;
      
      setUploadProgress(100);
      showUploadResultToast(true);
      
      onSuccess();
      return true;
    } catch (error) {
      console.error("Error during upload process:", error);
      showUploadResultToast(false);
      return false;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    isUploading,
    uploadProgress,
    uploadPhoto
  };
};
