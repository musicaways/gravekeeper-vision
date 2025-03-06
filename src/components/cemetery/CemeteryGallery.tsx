import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ImageLightbox, { LightboxImage } from "@/components/ui/image-lightbox";
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

interface Photo {
  Id: string;
  Url: string;
  NomeFile?: string;
  Descrizione?: string;
  DataInserimento?: string;
}

export interface CemeteryGalleryProps {
  cemeteryId: string;
  columns?: 1 | 2 | 3 | 4;
  aspect?: "square" | "video" | "wide";
  className?: string;
}

const CemeteryGallery: React.FC<CemeteryGalleryProps> = ({ 
  cemeteryId, 
  columns = 3, 
  aspect = "square",
  className = "" 
}) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const fetchPhotos = async () => {
    try {
      const numericId = parseInt(cemeteryId, 10);
      
      if (isNaN(numericId)) {
        console.error("ID cimitero non valido");
        setPhotos([]);
        return;
      }

      const { data, error } = await supabase
        .from('CimiteroFoto')
        .select('*')
        .eq('IdCimitero', numericId)
        .order('DataInserimento', { ascending: false }); // Most recent photos first
        
      if (error) {
        console.error("Errore nel caricamento delle foto:", error);
      } else {
        setPhotos(data || []);
      }
    } catch (err) {
      console.error("Errore nel caricamento delle foto:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [cemeteryId]);

  const lightboxImages: LightboxImage[] = photos.map(photo => ({
    id: photo.Id,
    url: photo.Url,
    title: photo.NomeFile || "",
    description: photo.Descrizione || "",
    date: photo.DataInserimento || ""
  }));

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('CimiteroFoto')
        .delete()
        .eq('Id', photoId);
      
      if (error) throw error;
      
      await fetchPhotos();
      
      return Promise.resolve();
    } catch (error) {
      console.error("Errore durante l'eliminazione della foto:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile eliminare la foto. Riprova più tardi.",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };

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

  if (loading) {
    return <div className="py-4 text-center">Caricamento foto...</div>;
  }

  if (photos.length === 0) {
    return <div className="py-4 text-center text-muted-foreground">Nessuna foto disponibile</div>;
  }

  return (
    <div className={className}>
      <div className={`grid ${getGridClass()} gap-1`}>
        {photos.map((photo, index) => (
          <div 
            key={photo.Id} 
            className="group relative cursor-pointer overflow-hidden rounded-md"
            onClick={() => openLightbox(index)}
          >
            <AspectRatio ratio={1} className={`bg-muted ${getAspectClass()}`}>
              <img 
                src={photo.Url} 
                alt={photo.Descrizione || `Foto ${index + 1}`} 
                className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105" 
              />
            </AspectRatio>
          </div>
        ))}
      </div>

      <ImageLightbox 
        images={lightboxImages}
        open={lightboxOpen}
        initialIndex={selectedPhotoIndex}
        onClose={closeLightbox}
        onDeletePhoto={handleDeletePhoto}
      />
    </div>
  );
};

export default CemeteryGallery;
