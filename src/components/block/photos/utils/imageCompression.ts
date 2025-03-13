
/**
 * Utility for compressing images before upload
 */

/**
 * Compresses an image file to reduce its size while maintaining quality
 * @param file The original image file to compress
 * @param maxSizeMB Maximum size in MB (default: 1)
 * @returns Promise resolving to a compressed blob
 */
export const compressImage = async (file: File, maxSizeMB = 1): Promise<Blob> => {
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
