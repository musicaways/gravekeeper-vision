
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileUploadFormValues } from "./types";

interface DocumentUploadFormProps {
  onSubmit: (values: FileUploadFormValues, file: File) => Promise<void>;
  onCancel: () => void;
  isUploading: boolean;
}

const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({ 
  onSubmit, 
  onCancel,
  isUploading 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const form = useForm<FileUploadFormValues>({
    defaultValues: {
      filename: "",
      description: ""
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File selection triggered");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("File selected:", file.name, "Size:", file.size, "Type:", file.type);
      
      try {
        // Check file size (limit to 50MB)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
          console.log("File too large:", file.size, "max:", maxSize);
          toast({
            title: "File troppo grande",
            description: "Il file selezionato è troppo grande. Il limite è di 50MB.",
            variant: "destructive"
          });
          e.target.value = '';
          return;
        }
        
        setSelectedFile(file);
        form.setValue("filename", file.name);
        console.log("File successfully set for upload:", file.name);
      } catch (error) {
        console.error("Error during file selection:", error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante la selezione del file.",
          variant: "destructive"
        });
        e.target.value = '';
      }
    }
  };

  const handleFormSubmit = async (values: FileUploadFormValues) => {
    console.log("Form submit triggered with values:", values);
    
    if (!selectedFile) {
      console.log("No file selected, showing error toast");
      toast({
        title: "Nessun file selezionato",
        description: "Per favore seleziona un file da caricare.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Proceeding with upload of file:", selectedFile.name);
    
    try {
      await onSubmit(values, selectedFile);
    } catch (error) {
      console.error("Error during form submission:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento del file.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    console.log("Resetting upload form");
    form.reset();
    setSelectedFile(null);
    onCancel();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <label htmlFor="fileUpload" className="text-sm font-medium mb-1">
            Seleziona file
          </label>
          <Input
            id="fileUpload"
            type="file"
            onChange={handleFileChange}
            className="cursor-pointer"
            disabled={isUploading}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.bmp"
          />
          {selectedFile && (
            <p className="text-xs text-muted-foreground mt-1">
              File selezionato: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>
        
        <FormField
          control={form.control}
          name="filename"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome file</FormLabel>
              <FormControl>
                <Input {...field} disabled={isUploading} />
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
                <Textarea 
                  {...field} 
                  placeholder="Inserisci una descrizione per questo file" 
                  disabled={isUploading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter className="mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={resetForm}
            disabled={isUploading}
          >
            Annulla
          </Button>
          <Button 
            type="submit" 
            disabled={isUploading || !selectedFile}
          >
            {isUploading ? "Caricamento..." : "Carica"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default DocumentUploadForm;
