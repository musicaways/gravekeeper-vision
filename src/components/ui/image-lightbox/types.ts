
export interface LightboxImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
  date?: string;
}

export interface ImageLightboxProps {
  images: LightboxImage[];
  open: boolean;
  initialIndex: number;
  onClose: () => void;
  onDeletePhoto?: (photoId: string) => Promise<void>;
}
