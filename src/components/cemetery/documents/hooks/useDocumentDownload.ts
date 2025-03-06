
import { DocumentItemType } from "../types";

export const useDocumentDownload = () => {
  const handleDownload = (document: DocumentItemType) => {
    window.open(document.url, '_blank');
  };

  return { handleDownload };
};
