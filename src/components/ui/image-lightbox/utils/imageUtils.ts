
import { LightboxImage } from "../types";

export const parseImageDetails = (currentImage: LightboxImage | undefined) => {
  if (!currentImage) {
    return { title: "", description: "", dateInfo: "" };
  }
  
  // Parse and format the description and date information
  const title = currentImage.title || "";
  let description = "";
  let dateInfo = "";
  
  if (currentImage.description) {
    // Check if the description contains "Date:" which was used to separate
    // the actual description from the date information
    const parts = currentImage.description.split("Date:");
    description = parts[0].trim();
    if (parts.length > 1) {
      dateInfo = parts[1].trim();
    }
  }
  
  // If we have date directly from the image object, use that instead
  if (currentImage.date) {
    dateInfo = currentImage.date;
  }
  
  return { title, description, dateInfo };
};
