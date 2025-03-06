
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, DownloadCloud, File, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface CemeteryDocumentsProps {
  cemeteryId: string;
}

interface FileUploadFormValues {
  filename: string;
  description: string;
}

const CemeteryDocuments: React.FC<CemeteryDocumentsProps> = ({ cemeteryId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  // Mock documents - in a real application, these would be fetched from a database
  const documents = [
    { id: 1, name: "Regolamento cimiteriale", description: "Regolamento ufficiale del cimitero", type: "PDF", size: "1.2 MB", date: "01/03/2023" },
    { id: 2, name: "Piano manutenzione", description: "Piano di manutenzione annuale", type: "DOCX", size: "850 KB", date: "15/06/2023" },
    { id: 3, name: "Mappa dei settori", description: "Mappa dettagliata dei settori", type: "PDF", size: "3.5 MB", date: "22/09/2023" },
    { id: 4, name: "Autorizzazioni comunali", description: "Documenti di autorizzazione", type: "PDF", size: "1.8 MB", date: "10/12/2023" },
  ];

  const form = useForm<FileUploadFormValues>({
    defaultValues: {
      filename: "",
      description: ""
    }
  });

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

    // In a real implementation, you would:
    // 1. Upload the file to storage (Supabase, Firebase, etc.)
    // 2. Save metadata (name, description, etc.) to your database
    
    try {
      // Simulating file upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "File caricato",
        description: `${values.filename} è stato caricato con successo`,
      });
      
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      form.reset();
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="w-full shadow-sm mb-6">
        <CardContent className="px-4 md:px-6 py-4">
          {documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-accent rounded-md hover:bg-accent/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <File className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium text-sm sm:text-base">{doc.name}</h3>
                      <p className="text-xs text-muted-foreground">{doc.description}</p>
                      <p className="text-xs text-muted-foreground">{doc.type} • {doc.size} • {doc.date}</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-full hover:bg-background transition-colors">
                    <DownloadCloud className="h-4 w-4 text-primary" />
                  </button>
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
    </div>
  );
};

export default CemeteryDocuments;
