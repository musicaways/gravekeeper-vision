
export interface DocumentViewerFile {
  id: string;
  url: string;
  title?: string;
  description?: string;
  date?: string;
  type?: string;
}

export interface DocumentViewerProps {
  files: DocumentViewerFile[];
  open: boolean;
  initialIndex: number;
  onClose: () => void;
  onDeleteFile?: (fileId: string) => Promise<void>;
}
