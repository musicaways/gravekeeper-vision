
import { LightboxImage } from "../types";

export const parseImageDetails = (currentImage: LightboxImage) => {
  // Parse and format the description and date information
  const title = currentImage.title || "";
  let description = "";
  let dateInfo = "";
  
  if (currentImage.description) {
    const parts = currentImage.description.split("Date:");
    description = parts[0].trim();
    if (parts.length > 1) {
      dateInfo = parts[1].trim();
    }
  }
  
  return { title, description, dateInfo };
};
