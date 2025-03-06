
export interface LightboxImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
}

export interface ImageLightboxProps {
  images: LightboxImage[];
  open: boolean;
  initialIndex: number;
  onClose: () => void;
}

