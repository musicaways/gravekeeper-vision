
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, DownloadCloud, File, Upload, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export interface CemeteryDocumentsProps {
  cemeteryId: string;
}

interface FileUploadFormValues {
  filename: string;
  description: string;
}

interface DocumentItem {
  id: string;
  name: string;
  description: string;
  type: string;
  size: string;
  date: string;
  url: string;
}

const CemeteryDocuments: React.FC<CemeteryDocumentsProps> = ({ cemeteryId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentItem | null>(null);
  const { toast } = useToast();
  
  const form = useForm<FileUploadFormValues>({
    defaultValues: {
      filename: "",
      description: ""
    }
  });

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      const numericId = parseInt(cemeteryId, 10);
      
      if (isNaN(numericId)) {
        toast({
          title: "Errore",
          description: "ID cimitero non valido",
          variant: "destructive"
        });
        setDocuments([]);
        return;
      }

      const { data, error } = await supabase
        .from('CimiteroDocumenti')
        .select('*')
        .eq('IdCimitero', numericId)
        .order('DataInserimento', { ascending: false });
        
      if (error) {
        console.error("Errore nel caricamento dei documenti:", error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante il caricamento dei documenti",
          variant: "destructive"
        });
        setDocuments([]);
      } else {
        // Transform the data to match our DocumentItem interface
        const formattedDocuments = data.map(doc => {
          // Extract file extension for type
          const fileExtension = doc.TipoFile || doc.NomeFile.split('.').pop()?.toUpperCase() || 'FILE';
          
          // Format date
          const date = doc.DataInserimento 
            ? new Date(doc.DataInserimento).toLocaleDateString('it-IT') 
            : 'Data non disponibile';
          
          return {
            id: doc.Id,
            name: doc.NomeFile,
            description: doc.Descrizione || '',
            type: fileExtension,
            // We don't have size information from the database
            size: 'N/A',
            date: date,
            url: doc.Url
          };
        });
        
        setDocuments(formattedDocuments);
      }
    } catch (err) {
      console.error("Errore nel caricamento dei documenti:", err);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento dei documenti",
        variant: "destructive"
      });
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [cemeteryId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      form.setValue("filename", file.name);
    }
  };

  const handleUpload = async (values: FileUploadFormValues) => {
    if (!selectedFile) {
      toast({
        title: "Errore",
        description: "Nessun file selezionato",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const numericId = parseInt(cemeteryId, 10);
      
      if (isNaN(numericId)) {
        throw new Error("ID cimitero non valido");
      }
      
      // 1. Upload the file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${cemeteryId}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cemetery-documents')
        .upload(filePath, selectedFile);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // 2. Get the URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('cemetery-documents')
        .getPublicUrl(filePath);
      
      const fileUrl = publicUrlData.publicUrl;
      
      // 3. Save metadata to the database
      const { error: dbError } = await supabase
        .from('CimiteroDocumenti')
        .insert({
          IdCimitero: numericId,
          NomeFile: values.filename,
          Descrizione: values.description,
          TipoFile: fileExt?.toUpperCase() || 'FILE',
          Url: fileUrl
        });
      
      if (dbError) {
        throw dbError;
      }
      
      toast({
        title: "File caricato",
        description: `${values.filename} è stato caricato con successo`,
      });
      
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      form.reset();
      
      // Refresh the document list
      fetchDocuments();
      
    } catch (error) {
      console.error("Errore durante il caricamento:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (document: DocumentItem) => {
    window.open(document.url, '_blank');
  };

  const openDeleteDialog = (document: DocumentItem) => {
    setDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      // 1. Delete from database
      const { error: dbError } = await supabase
        .from('CimiteroDocumenti')
        .delete()
        .eq('Id', documentToDelete.id);
      
      if (dbError) throw dbError;
      
      // 2. Get the storage path from the URL
      // This is a simplification - in a real app you might want to store the storage path in your database
      const urlParts = documentToDelete.url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${cemeteryId}/${fileName}`;
      
      // 3. Delete from storage
      // This step might fail if the file path doesn't match exactly
      const { error: storageError } = await supabase.storage
        .from('cemetery-documents')
        .remove([filePath]);
      
      if (storageError) {
        console.warn("File might not have been removed from storage:", storageError);
      }
      
      toast({
        title: "Documento eliminato",
        description: `${documentToDelete.name} è stato eliminato con successo`,
      });
      
      fetchDocuments();
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione del documento",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <div className="w-full">
      <Card className="w-full shadow-sm mb-6">
        <CardContent className="px-4 md:px-6 py-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Caricamento documenti...</p>
            </div>
          ) : documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-accent rounded-md hover:bg-accent/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <File className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium text-sm sm:text-base">{doc.name}</h3>
                      <p className="text-xs text-muted-foreground">{doc.description}</p>
                      <p className="text-xs text-muted-foreground">{doc.type} • {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      className="p-2 rounded-full hover:bg-background transition-colors"
                      onClick={() => handleDownload(doc)}
                      aria-label="Scarica documento"
                    >
                      <DownloadCloud className="h-4 w-4 text-primary" />
                    </button>
                    <button 
                      className="p-2 rounded-full hover:bg-background transition-colors"
                      onClick={() => openDeleteDialog(doc)}
                      aria-label="Elimina documento"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
              <h3 className="font-medium text-lg mb-1">Nessun file</h3>
              <p className="text-sm text-muted-foreground">Non ci sono file disponibili per questo cimitero.</p>
            </div>
          )}
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
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpload)} className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="fileUpload" className="text-sm font-medium mb-1">
                  Seleziona file
                </label>
                <Input
                  id="fileUpload"
                  type="file"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
              
              <FormField
                control={form.control}
                name="filename"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome file</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrizione</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Inserisci una descrizione per questo file" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsUploadDialogOpen(false)}
                  disabled={isUploading}
                >
                  Annulla
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Caricamento..." : "Carica"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo documento
              {documentToDelete ? ` "${documentToDelete.name}"` : ""}? 
              Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CemeteryDocuments;
