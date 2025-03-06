
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FileUploadFormValues {
  filename: string;
  description: string;
}

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

  const handleFormSubmit = async (values: FileUploadFormValues) => {
    if (!selectedFile) return;
    await onSubmit(values, selectedFile);
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
            onClick={onCancel}
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
  );
};

export default DocumentUploadForm;
