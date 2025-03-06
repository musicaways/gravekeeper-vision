
import { useIsMobile } from "@/hooks/use-mobile";

export const useGalleryLayout = (columns: 1 | 2 | 3 | 4, aspect: "square" | "video" | "wide") => {
  const isMobile = useIsMobile();
  
  const getGridClass = () => {
    if (isMobile) {
      switch (columns) {
        case 1: return "grid-cols-1";
        case 2: return "grid-cols-2";
        case 3: return "grid-cols-2";
        case 4: return "grid-cols-3";
        default: return "grid-cols-2";
      }
    } else {
      switch (columns) {
        case 1: return "grid-cols-1";
        case 2: return "grid-cols-2 sm:grid-cols-3";
        case 3: return "grid-cols-3 sm:grid-cols-4 md:grid-cols-5";
        case 4: return "grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8";
        default: return "grid-cols-3 sm:grid-cols-4 md:grid-cols-5";
      }
    }
  };

  const getAspectClass = () => {
    switch (aspect) {
      case "square": return "aspect-square";
      case "video": return "aspect-video";
      case "wide": return "aspect-[16/9]";
      default: return "aspect-square";
    }
  };

  return {
    gridClass: getGridClass(),
    aspectClass: getAspectClass()
  };
};
