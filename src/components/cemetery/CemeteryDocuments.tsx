
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import DocumentsList from "./documents/DocumentsList";
import DocumentUploadForm from "./documents/DocumentUploadForm";
import DeleteDocumentDialog from "./documents/DeleteDocumentDialog";
import { useDocuments } from "./documents/useDocuments";

export interface CemeteryDocumentsProps {
  cemeteryId: string;
}

const CemeteryDocuments: React.FC<CemeteryDocumentsProps> = ({ cemeteryId }) => {
  const {
    documents,
    loading,
    isUploading,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    documentToDelete,
    handleUpload,
    handleDownload,
    openDeleteDialog,
    handleDelete
  } = useDocuments(cemeteryId);

  return (
    <div className="w-full">
      <Card className="w-full shadow-sm mb-6">
        <CardContent className="px-4 md:px-6 py-4">
          <DocumentsList 
            documents={documents}
            loading={loading}
            onDownload={handleDownload}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      {/* Floating upload button */}
      <Button
        onClick={() => setIsUploadDialogOpen(true)}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg p-0"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Upload dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Carica file</DialogTitle>
          </DialogHeader>
          
          <DocumentUploadForm 
            onSubmit={handleUpload}
            onCancel={() => setIsUploadDialogOpen(false)}
            isUploading={isUploading}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <DeleteDocumentDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        document={documentToDelete}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CemeteryDocuments;
