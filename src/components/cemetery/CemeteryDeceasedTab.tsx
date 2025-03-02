
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, Users, CalendarClock, PlusCircle, Search, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Deceased } from "@/types";

export interface CemeteryDeceasedTabProps {
  cemeteryId: string;
}

export const CemeteryDeceasedTab: React.FC<CemeteryDeceasedTabProps> = ({ cemeteryId }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newDeceased, setNewDeceased] = useState({
    first_name: "",
    last_name: "",
    gender: "unspecified",
    birth_date: "",
    death_date: "",
    burial_date: "",
    burial_type: "full_body",
    plot_id: "",
  });

  // Fetch available plots for the cemetery
  const { data: plots, isLoading: plotsLoading } = useQuery({
    queryKey: ['cemetery-plots', cemeteryId],
    queryFn: async () => {
      // Convert cemeteryId to number
      const numericCemeteryId = parseInt(cemeteryId, 10);
      
      if (isNaN(numericCemeteryId)) {
        throw new Error("ID cimitero non valido");
      }

      // First get the sections in this cemetery
      const { data: sections, error: sectionsError } = await supabase
        .from('Settore')
        .select('Id')
        .eq('IdCimitero', numericCemeteryId);

      if (sectionsError) throw sectionsError;
      
      if (!sections || sections.length === 0) return [];
      
      // Get all blocks in these sections
      const sectionIds = sections.map(section => section.Id);
      const { data: blocks, error: blocksError } = await supabase
        .from('Blocco')
        .select('Id')
        .in('IdSettore', sectionIds);
        
      if (blocksError) throw blocksError;
      
      if (!blocks || blocks.length === 0) return [];
      
      // Get all plots (loculi) in these blocks
      const blockIds = blocks.map(block => block.Id);
      const { data: plots, error: plotsError } = await supabase
        .from('Loculo')
        .select('*')
        .in('IdBlocco', blockIds);
        
      if (plotsError) throw plotsError;
      
      return plots || [];
    },
    retry: 1,
  });

  // Fetch deceased persons from the database
  const { data: deceased, isLoading, isError, refetch } = useQuery({
    queryKey: ['cemetery-deceased', cemeteryId, searchTerm],
    queryFn: async () => {
      try {
        const numericCemeteryId = parseInt(cemeteryId, 10);
        
        if (isNaN(numericCemeteryId)) {
          throw new Error("ID cimitero non valido");
        }

        // First get all loculi (plots) associated with this cemetery
        // This is a multi-step process:
        // 1. Get all sectors for this cemetery
        const { data: sectors, error: sectorsError } = await supabase
          .from('Settore')
          .select('Id')
          .eq('IdCimitero', numericCemeteryId);
          
        if (sectorsError) throw sectorsError;
        
        if (!sectors || sectors.length === 0) return [];
        
        // 2. Get all blocks in these sectors
        const sectorIds = sectors.map(sector => sector.Id);
        const { data: blocks, error: blocksError } = await supabase
          .from('Blocco')
          .select('Id')
          .in('IdSettore', sectorIds);
          
        if (blocksError) throw blocksError;
        
        if (!blocks || blocks.length === 0) return [];
        
        // 3. Get all loculi (plots) in these blocks
        const blockIds = blocks.map(block => block.Id);
        const { data: loculi, error: loculiError } = await supabase
          .from('Loculo')
          .select('Id')
          .in('IdBlocco', blockIds);
          
        if (loculiError) throw loculiError;
        
        if (!loculi || loculi.length === 0) return [];
        
        // 4. Get all deceased associated with these loculi
        const loculiIds = loculi.map(loculo => loculo.Id);
        let query = supabase
          .from('Defunto')
          .select('*')
          .in('IdLoculo', loculiIds);
          
        // Apply search filter if provided
        if (searchTerm) {
          query = query.ilike('Nominativo', `%${searchTerm}%`);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error("Error fetching deceased:", error);
        throw error;
      }
    },
    retry: 1,
  });

  // Function to get the next available ID for the Defunto table
  const getNextDefuntoId = async () => {
    try {
      // First, try to get the maximum ID currently in the table
      const { data, error } = await supabase
        .from('Defunto')
        .select('Id')
        .order('Id', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      // If there are records, return the next available ID (max + 1)
      if (data && data.length > 0) {
        return data[0].Id + 1;
      }
      
      // If there are no records, start with ID 1
      return 1;
    } catch (error) {
      console.error("Error getting next ID:", error);
      // Default to a high number to reduce the chance of conflicts
      return Math.floor(Math.random() * 10000) + 1000;
    }
  };

  const handleAddDeceased = async () => {
    try {
      // Basic validation
      if (!newDeceased.first_name || !newDeceased.last_name) {
        toast.error("Nome e cognome sono obbligatori");
        return;
      }

      // Combine first and last name into full name for the database
      const fullName = `${newDeceased.first_name} ${newDeceased.last_name}`;

      // Get the next available ID
      const nextId = await getNextDefuntoId();

      // Create the record with the required Id field
      const { data, error } = await supabase
        .from('Defunto')
        .insert([{
          Id: nextId,
          Nominativo: fullName,
          Sesso: newDeceased.gender,
          DataNascita: newDeceased.birth_date,
          DataDecesso: newDeceased.death_date,
          IdLoculo: newDeceased.plot_id ? parseInt(newDeceased.plot_id) : null,
        }])
        .select();

      if (error) {
        throw error;
      }

      // Close dialog and reset form
      setIsAddDialogOpen(false);
      setNewDeceased({
        first_name: "",
        last_name: "",
        gender: "unspecified",
        birth_date: "",
        death_date: "",
        burial_date: "",
        burial_type: "full_body",
        plot_id: "",
      });

      // Refetch data
      refetch();
      
      toast.success("Defunto aggiunto con successo");
    } catch (error) {
      console.error("Error adding deceased:", error);
      toast.error("Errore durante l'aggiunta del defunto");
    }
  };

  // Function to format the date from database format to readable format
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    
    try {
      // Try to parse the date - can handle both ISO strings and DD/MM/YYYY formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If date is invalid, return original string
        return dateString;
      }
      
      // Format date as DD/MM/YYYY
      return date.toLocaleDateString('it-IT');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Defunti nel cimitero
        </CardTitle>
        <CardDescription>
          Visualizza e gestisci l'elenco dei defunti sepolti in questo cimitero
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cerca defunto..."
              className="w-full pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Aggiungi defunto
              </Button>
            </DialogTrigger>
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
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annulla
                </Button>
                <Button type="button" onClick={handleAddDeceased}>
                  Salva
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          // Loading state
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 rounded-md border p-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          // Error state
          <div className="text-center py-10">
            <p className="text-muted-foreground">Si è verificato un errore durante il caricamento dei dati</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              Riprova
            </Button>
          </div>
        ) : deceased && deceased.length > 0 ? (
          // Data available
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {deceased.map((person) => (
                <div key={person.Id} className="flex items-start space-x-4 rounded-md border p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <UserRound className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium leading-none">{person.Nominativo}</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      {person.DataNascita && (
                        <div className="flex items-center">
                          <span>Nascita: {formatDate(person.DataNascita)}</span>
                        </div>
                      )}
                      {person.DataDecesso && (
                        <div className="flex items-center">
                          <span>Decesso: {formatDate(person.DataDecesso)}</span>
                        </div>
                      )}
                      {person.Sesso && (
                        <div className="flex items-center">
                          <span>Genere: {person.Sesso === 'male' ? 'Maschio' : person.Sesso === 'female' ? 'Femmina' : 'Non specificato'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          // No data
          <div className="text-center py-10">
            <p className="text-muted-foreground">Nessun defunto registrato per questo cimitero</p>
            <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Aggiungi un nuovo defunto
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
