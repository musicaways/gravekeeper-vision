
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenericFileViewerProps {
  title: string;
  handleDownload: () => void;
}

const GenericFileViewer = ({ title, handleDownload }: GenericFileViewerProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <FileText className="w-16 h-16 text-muted-foreground" />
      <p className="text-center max-w-md text-muted-foreground">
        {title ? title : "Questo tipo di file non può essere visualizzato."}
      </p>
      <Button
        variant="outline"
        onClick={handleDownload}
      >
        <Download className="w-4 h-4 mr-1" /> Scarica file
      </Button>
    </div>
  );
};

export default GenericFileViewer;
