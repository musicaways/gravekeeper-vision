
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface AddDeceasedDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newDeceased: {
    first_name: string;
    last_name: string;
    gender: string;
    birth_date: string;
    death_date: string;
    burial_date: string;
    burial_type: string;
    plot_id: string;
  };
  setNewDeceased: React.Dispatch<React.SetStateAction<{
    first_name: string;
    last_name: string;
    gender: string;
    birth_date: string;
    death_date: string;
    burial_date: string;
    burial_type: string;
    plot_id: string;
  }>>;
  plots: any[] | undefined;
  plotsLoading: boolean;
  onSave: () => void;
}

export const AddDeceasedDialog: React.FC<AddDeceasedDialogProps> = ({
  isOpen,
  onOpenChange,
  newDeceased,
  setNewDeceased,
  plots,
  plotsLoading,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Aggiungi un nuovo defunto</DialogTitle>
          <DialogDescription>
            Inserisci i dettagli del defunto da aggiungere al cimitero
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="first_name">Nome</Label>
            <Input 
              id="first_name" 
              value={newDeceased.first_name}
              onChange={(e) => setNewDeceased({...newDeceased, first_name: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="last_name">Cognome</Label>
            <Input 
              id="last_name" 
              value={newDeceased.last_name}
              onChange={(e) => setNewDeceased({...newDeceased, last_name: e.target.value})}
            />
          </div>
        
          <div className="grid gap-2">
            <Label htmlFor="birth_date">Data di nascita</Label>
            <Input 
              id="birth_date" 
              type="date" 
              value={newDeceased.birth_date}
              onChange={(e) => setNewDeceased({...newDeceased, birth_date: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="death_date">Data di decesso</Label>
            <Input 
              id="death_date" 
              type="date" 
              value={newDeceased.death_date}
              onChange={(e) => setNewDeceased({...newDeceased, death_date: e.target.value})}
            />
          </div>
        
          <div className="grid gap-2">
            <Label>Genere</Label>
            <RadioGroup 
              value={newDeceased.gender} 
              onValueChange={(value) => setNewDeceased({...newDeceased, gender: value})}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Maschio</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Femmina</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="unspecified" id="unspecified" />
                <Label htmlFor="unspecified">Non specificato</Label>
              </div>
            </RadioGroup>
          </div>
        
          <div className="grid gap-2">
            <Label htmlFor="burial_date">Data di sepoltura</Label>
            <Input 
              id="burial_date" 
              type="date" 
              value={newDeceased.burial_date}
              onChange={(e) => setNewDeceased({...newDeceased, burial_date: e.target.value})}
            />
          </div>
        
          <div className="grid gap-2">
            <Label htmlFor="burial_type">Tipo di sepoltura</Label>
            <Select 
              value={newDeceased.burial_type} 
              onValueChange={(value) => setNewDeceased({...newDeceased, burial_type: value})}
            >
              <SelectTrigger id="burial_type">
                <SelectValue placeholder="Seleziona tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full_body">Corpo intero</SelectItem>
                <SelectItem value="cremation">Cremazione</SelectItem>
                <SelectItem value="entombment">Tumulazione</SelectItem>
                <SelectItem value="other">Altro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        
          <div className="grid gap-2">
            <Label htmlFor="plot_id">Loculo</Label>
            <Select 
              value={newDeceased.plot_id} 
              onValueChange={(value) => setNewDeceased({...newDeceased, plot_id: value})}
            >
              <SelectTrigger id="plot_id">
                <SelectValue placeholder="Seleziona loculo" />
              </SelectTrigger>
              <SelectContent>
                {plotsLoading ? (
                  <SelectItem value="" disabled>Caricamento...</SelectItem>
                ) : plots && plots.length > 0 ? (
                  plots.map((plot) => (
                    <SelectItem key={plot.Id} value={plot.Id.toString()}>
                      Loculo {plot.Numero} (Fila {plot.Fila})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>Nessun loculo disponibile</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button type="button" onClick={onSave}>
            Salva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
