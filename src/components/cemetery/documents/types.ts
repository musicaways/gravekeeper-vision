
export interface DocumentItemType {
  id: string;
  name: string;
  description: string;
  type: string;
  size: string;
  date: string;
  url: string;
}

export type Document = DocumentItemType;

export interface FileUploadFormValues {
  filename: string;
  description: string;
}
