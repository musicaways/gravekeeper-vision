
export const isImageFile = (fileType: string): boolean => {
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(fileType.toLowerCase());
};

export const isPdfFile = (fileType: string): boolean => {
  return fileType.toLowerCase() === 'pdf';
};

export const getFileLoaderComponent = (fileType: string): 'pdf' | 'image' | 'generic' => {
  if (isPdfFile(fileType)) return 'pdf';
  if (isImageFile(fileType)) return 'image';
  return 'generic';
};
