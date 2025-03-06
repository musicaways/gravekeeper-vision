
export const isImageFile = (fileType: string): boolean => {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
  return imageTypes.includes(fileType.toLowerCase());
};

export const isPdfFile = (fileType: string): boolean => {
  return fileType.toLowerCase() === 'pdf';
};

export const getFileLoaderComponent = (fileType: string): 'pdf' | 'image' | 'generic' => {
  console.log("Checking file type:", fileType);
  if (isPdfFile(fileType)) {
    console.log("PDF file detected");
    return 'pdf';
  }
  if (isImageFile(fileType)) {
    console.log("Image file detected");
    return 'image';
  }
  console.log("Generic file detected");
  return 'generic';
};
