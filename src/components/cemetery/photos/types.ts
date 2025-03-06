
export interface Photo {
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
